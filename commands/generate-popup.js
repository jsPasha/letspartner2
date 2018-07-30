// run command: "node commands/generate-popup.js info"
// where "news" is type of page

const mongoose = require("mongoose");

require("../app/models/popup");

const Popup = mongoose.model("popups");

const configDB = require("../config/db.js");

const locales = require("../data/locales");

let text = {};

locales.forEach((el, i) => {
  text[el] = "text";
});

mongoose.connect(
  configDB.url,
  () => {
    console.log("MongoDB: connect successful");
    process.argv.forEach(function(type, index, array) {
      if (index > 1) {
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

        Popup.find({ type }).exec((err, el) => {
          if (el.length) return console.log("already created");

          let popup = new Popup({
            type,
            content
          });

          popup.save((err, el) => {
            if (err) return console.log(err);
            console.log(`${type}' popup table was created`);
            mongoose.connection.close();
          });
        });
      }
    });
  }
);
