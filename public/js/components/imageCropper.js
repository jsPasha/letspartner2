import $ from "jquery";
import loader from "./loader";
import updateConstructor from "../methods/updateConstructor";

require("magnific-popup");
require("cropper");

const popupId = "cropperPopup";
const imgId = "cropperImage";
let $img;
let currentPicker;

/* When user is updating images the old images need to be deleted from server.
Array of images which will be deleted */
let previousImages = [];
let previousImage = null;

let galleryUpdating = false,
  galleryImageIndex,
  galleryInput,
  galleryBox,
  ratio;

const imageCropper = input => {
  galleryUpdating = false;

  if (input.files && input.files[0]) {
    let reader = new FileReader();

    loader.show();

    reader.onload = e => {
      ratio = input.dataset.ratio;
      initCropperPopup(e.target.result);
    };

    reader.readAsDataURL(input.files[0]);

    currentPicker = input;
  }
};

const initCropperPopup = imageSrc => {
  let imageTemplate = `<img id="${imgId}" src="${imageSrc}" />`;

  if (!document.getElementById(`${popupId}`)) {
    let popupTemplate = `<div id="${popupId}" class="mfp-hide">${imageTemplate}<div class="center"><button class="save_cropped button blue_button">Обрезать</button></div></div>`;
    let $popup = $(popupTemplate);
    $popup.appendTo("body");
  } else {
    $(`#${popupId}`).prepend(imageTemplate);
  }

  $.magnificPopup.open({
    items: {
      src: `#${popupId}`
    },
    closeOnBgClick: false,
    callbacks: {
      open: () => {
        loader.hide();
        $img = $(`#${imgId}`);
        initCropper();
      },
      close: () => {
        destroyCropper();
      }
    }
  });
};

const initCropper = () => {
  let aspectRatio = false;
  if (ratio) {
    let splitRatio = ratio.split(":");
    aspectRatio = splitRatio[0] / splitRatio[1];
  }
  $img.cropper({
    autoCropArea: 1,
    aspectRatio,
    viewMode: 2
  });
};

$("body").on("click", ".save_cropped", () => {
  if (previousImage && previousImage.indexOf("/temp/") === -1) {
    previousImages.push(previousImage);
  } else if (previousImage) {
    console.log("here");
    deleteImage(previousImage);
  }
  previousImage = null;
  getImage();
});

$(".update_form").submit(function(e) {
  previousImages.forEach(el => {
    $(this).append(
      `<input type="hidden" name="fileForDelete[]" value="${el}" />`
    );
  });
  return true;
});

const getImage = () => {
  $img.cropper("getCroppedCanvas").toBlob(function(blob) {
    if (!galleryUpdating) {
      let formData = new FormData();
      formData.append("croppedImage", blob);
      loader.hide();
      $.magnificPopup.close();
      $.ajax("/action/upload/cropped-image", {
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
          insertCroppedImage(data.fileName);
        },
        error: function(error) {
          console.log("Upload error");
        }
      });
    } else {
      uploadImage(blob, galleryImageIndex, galleryInput);
      $.magnificPopup.close();
    }
  });
};

const destroyCropper = () => {
  $img.cropper("destroy");
  $(`#${imgId}`).remove();
  $(".image_pick").val("");
};

const insertCroppedImage = path => {
  let $input = $(currentPicker);
  let img = $input.siblings(".cropped_image_view").find("img");

  $input.closest(".image_pick_area").addClass("active");
  $input.siblings(".delete_image").attr("data-url", path);
  $input.siblings(".hidden_image_url").val(path);
  $input.siblings(".upload_new_image").attr("data-del-url", path);
  if (!img.length) {
    $(`<img src="/uploads${path}">`).appendTo($input.siblings('.cropped_image_view'));
  } else {
    img.attr("src", `/uploads${path}`);
  }
};

$("body").on("click", ".cropped_image_view", function(e) {
  $(this).siblings('.image_pick').click();
});

$("body").on("click", ".delete_image", function(e) {
  e.preventDefault();
  let $this = $(this);

  let url = $this.attr("data-url");

  let index = $this.closest(".gallery_image").attr("data-id");

  if (index !== undefined) {
    $this
      .closest(".gallery_image")
      .nextAll()
      .each(function() {
        $(this).attr("data-id", +$(this).attr("data-id") - 1);
      });
  }

  if (
    $this.closest("form").hasClass("update_form") &&
    url.indexOf("/temp/") === -1
  ) {
    previousImages.push(url);
  } else {
    console.log("click delete_image");
    deleteImage(url);
  }

  $this.closest(".image_pick_area").removeClass("active");
  $this.siblings(".hidden_image_url").val("");
  $this.siblings('.cropped_image_view').find("img").remove();
  $this.parent(".gallery_image").remove();
});

$("body").on("click", ".item_delete", function() {
  // if (confirm("Удалить?")) {
  let item = $(this).closest(".constructor_item");
  let func;
  switch ($(this).attr("data-type")) {
    case "gallery":
      func = () => {
        item.find(".gallery_image").each(function() {
          let url = $(this).attr("data-url");
          if (url.indexOf("/temp/") === -1) {
            previousImages.push(url);
          } else {
            console.log("click item_delete");
            deleteImage(url);
          }
        });
      };
      break;
    case "text":
      func = () =>
        item.find(".ckeditor_item").each(function() {
          this.editor.destroy();
        });
    default:
      break;
  }

  if (func) func();

  item.remove();

  updateConstructor();
});

$("body").on("click", ".upload_new_image", function(e) {
  e.preventDefault();
  previousImage = $(this).attr("data-del-url");
  $(this)
    .siblings(".image_pick")
    .click();
});

/*Удалить ранее загруженную картинку*/
const deleteImage = url => {
  $.ajax("/action/file/delete/", {
    method: "POST",
    data: {
      url
    },
    success: data => {
      console.log(data);
    },
    error: error => {
      console.log(error);
    }
  });
};

let asyncUploadImageCounter = 0;

const multipleInit = input => {
  galleryUpdating = false;

  asyncUploadImageCounter = 0;

  let imagesBox = $(input).siblings(".images_box");
  let galeryImagesLength = imagesBox.find(".gallery_image").length;

  [].forEach.call(input.files, (el, index) => {
    uploadImage(el, index + galeryImagesLength, input);
  });
};

$('body').on('click', '.add_gallery_image', function() {
  $(this).closest('.form-group').find('.image_pick_multiple').click();
});

const uploadImage = (imageData, index, input) => {
  let fd = new FormData();
  let imagesBox;
  let globalIndex = $(input).attr("data-id");
  if (!galleryUpdating) {
    imagesBox = $(input).siblings(".images_box");
  } else {
    imagesBox = galleryBox;
    let url = imagesBox
      .find(`.gallery_image[data-id="${index}"]`)
      .attr("data-url");
    if (url.indexOf("/temp/") !== -1) {
      fd.append("url", url);
    }
  }

  fd.append("image", imageData);
  fd.append("index", index);

  if (!galleryUpdating) {
    let addButton = imagesBox.find('.add_gallery_image')
    $(`<div class="gallery_image" data-id="${index}" data-url="">
      <div class="image loading" style="background-image: url(/img/loader.svg)"></div>
      <input type="hidden" class="hidden_image_url content_position_index" value="" name="floatContent[${globalIndex}][gallery][]" />
      <a class="update_image" data-url="" href="#">update_image</a>
      <a class="delete_image" data-url="" href="#">delete_image</a>
    </div>`).insertBefore(addButton);
  }

  $.ajax({
    url: "/action/upload/constructor_image",
    data: fd,
    processData: false,
    contentType: false,
    type: "POST",
    success: function(data) {
      let currentImage = imagesBox.find(
        `.gallery_image[data-id="${data.index}"]`
      );
      const url = data.fileName;
      currentImage
        .find(`.image`)
        .removeClass("loading")
        .css("background-image", `url(/uploads${url})`);
      currentImage.attr("data-url", url);
      currentImage.find(".hidden_image_url").val(url);

      if (!galleryUpdating && input.files.length === ++asyncUploadImageCounter)
        $(input).val("");
    }
  });
};

$("body").on("click", ".update_image", function() {
  galleryUpdating = true;

  const imageBlock = $(this).closest(".gallery_image");

  let url = imageBlock.attr("data-url"),
    index = imageBlock.attr("data-id");

  previousImage = url;

  galleryBox = $(this).closest(".images_box");
  galleryInput = galleryBox.siblings("input");
  galleryImageIndex = index;
  initCropperPopup(`/uploads${url}`);
});

export { imageCropper, multipleInit };
