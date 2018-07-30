import $ from "jquery";
import Sortable from "sortablejs";

import textTemplate from "../templates/text";
import galleryTemplate from "../templates/gallery";
import videoTemplate from "../templates/video";
import generateHeader from "../templates/header";

import initCkeditors from "./ckeditor";
import updateConstructor from "../methods/updateConstructor";

const constrBody = ".constructor_body";

$(".add_item").click(function() {
  const index = $(".constructor_item").length;
  const type = $(this).attr("data-type");

  let item = `<div class="constructor_item">
		<div class="constructor_handle_wrap">
			<div class="item_handle"></div>
			<div class="item_delete" data-type="${type}"></div>
		</div>
		<div class="constructor_content">
			<input type="hidden" class="content_type_input" name="floatContent[${index}][contentType]" value="${type}" />`;

  let callback, params;

  switch (type) {
    case "gallery":
      item += galleryTemplate(index);
      callback = initSortableGallery;
      break;
    case "text":
      item += textTemplate(index);
      callback = initCkeditors;
      params = {
        items: "dynamic_editor",
        callback: el => $(el).removeClass("dynamic_editor")
      };
      break;
    case "video":
      item += videoTemplate(index);
      break;
    case "header":
      item += generateHeader(index);
      break;
    default:
      break;
  }

  item += `
		</div>
	</div>`;

  $(constrBody).append(item);

  if (callback) callback(params);
});

if ($(".constructor_menu").length) {
  $(window).scroll(function() {
    let offset =
      Math.floor($(this).scrollTop()) - Math.floor($(constrBody).offset().top);
    if (offset < 0) offset = 0;
    $(".constructor_menu").css("top", offset + "px");
  });
}

try {
  Sortable.create(document.querySelector(constrBody), {
    handle: ".item_handle",
    animation: 400,
    filter: ".add_gallery_image",
    onSort: () => {
      updateConstructor();
    }
  });
} catch (err) {}

const initSortableGallery = () => {
  document.querySelectorAll(".images_box").forEach(function(el) {
    Sortable.create(el, {
      group: "omega",
      filter: ".add_gallery_image",
      animation: 500,
      onSort: () => {
        updateConstructor();
      }
    });
  });
};

initSortableGallery();
