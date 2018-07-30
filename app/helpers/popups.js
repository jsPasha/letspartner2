const mongoose = require("mongoose");
const Popup = mongoose.model("popups");

const locales = require("../../data/locales");

let text = {};

locales.forEach((el, i) => {
  text[el] = "text";
});

const setInfoPopup = (req, res, next) => {
  if (req.url !== "/" && req.user && req.user.showInfoPopup) {
    Popup.findOne({ type: "info" }).exec(async (err, popup) => {
      if (!popup) {
        req.infoPopup = await createPopup("info");
      } else {
        if (popup.published) req.infoPopup = popup;
      }
      next();
    });
  } else {
    next();
  }
};

const setPhonePopup = (req, res, next) => {
  if (req.url !== "/" && req.user && !req.user.phone) {
    Popup.findOne({ type: "phone" }).exec(async (err, popup) => {
      if (!popup) {
        req.phonePopup = await createPopup("phone");
      } else {
        if (popup.published) req.phonePopup = popup;
      }
      next();
    });
  } else {
    next();
  }
};

const createPopup = type => {
  return new Promise((res, rej) => {
    let content;
    switch (type) {
      case "info":
        content = [
          {
            type: "top_header",
            text
          },
          {
            type: "header",
            text
          },
          {
            type: "block",
            text
          },
          {
            type: "header",
            text
          },
          {
            type: "block",
            text
          },
          {
            type: "header",
            text
          },
          {
            type: "block",
            text
          }
        ];
        break;
      case "phone":
        content = [
          {
            type: "top_header",
            text
          },
          {
            type: "block",
            text
          },
          {
            type: "block",
            text
          }
        ];
        break;
      default:
        break;
    }

    let popup = new Popup({
      type,
      content
    });

    popup.save((err, el) => {
      if (err) return rej(err);
      res(el);
    });
  });
};

module.exports = { setInfoPopup, setPhonePopup };
