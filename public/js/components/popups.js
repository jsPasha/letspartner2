import $ from "jquery";

require("magnific-popup");

let infoPopupInstanse = document.getElementById("info_popup");
let phonePopupInstanse = document.getElementById("phone_popup");
let blockPopupInstanse = document.getElementById("block_popup");

const openInfoPopup = () => {
  if (!blockPopupInstanse && infoPopupInstanse) {
    setTimeout(() => {
      if (!phonePopupInstanse) {
        $.magnificPopup.open({
          items: {
            src: "#info_popup"
          }
        });
      }
    }, 500);
  }
};

openInfoPopup();

if (!blockPopupInstanse && phonePopupInstanse) {
  setTimeout(() => {
    $.magnificPopup.open({
      items: {
        src: "#phone_popup"
      },
      callbacks: {
        close: () => {
          phonePopupInstanse = false;
          openInfoPopup();
        }
      }
    });
  }, 500);
}

if (blockPopupInstanse) {
  $.magnificPopup.open({
    items: {
      src: "#block_popup"
    }
  });
}

$(".show_checkbox").click(function() {
  const val = this.checked;
  const popup = this.dataset.show;
  $.ajax({
    type: "POST",
    url: "/action/popup-visibility",
    data: {
      val,
      popup
    },
    error: () => alert()
  });
});

$(".close").click(() => {
  $.magnificPopup.close();
});
