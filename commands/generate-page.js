// run command: "node commands/generate-page.js news"
// where "news" is type of page

const mongoose = require("mongoose");

require('../app/models/page');

const Page = mongoose.model("pages");

const configDB = require("../config/db.js");

mongoose.connect(
  configDB.url,
  () => {
    console.log("MongoDB: connect successful");
    process.argv.forEach(function(type, index, array) {
      if (index > 1) {
        Page.find({ type }).exec((err, el) => {
          if (el.length) return console.log("already created");

          let page = new Page({ type });
          
          page.save((err, el) => {
            if (err) return console.log(err);
            console.log(`${type}'s page table was created`);
            mongoose.connection.close();
          });
        });
      }
    });
  }
);
