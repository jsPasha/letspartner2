const mongoose = require("mongoose");
const Constants = mongoose.model("constants");

const { templatePath } = require("../../data/settings");

const Languages = {
  list: (req, res) => {
    Constants.find({}, (err, data) => {
      res.send(data);
    });
  },

  save: async (req, res) => {
    for (var key in req.body.constants) {
      constants.store[key] = req.body.constants[key];
      await update({ key, req });
    }
    return res.send({
      type: "success",
      text: "Saved"
    });
  },

  view: (req, res) => {
    res.render(templatePath, {
      content: "../modules/admin/modules/languages/index"
    });
  }
};

const update = ({ key, req }) => {
  return new Promise((res, rej) => {
    Constants.update(
      { key },
      { $set: { value: req.body.constants[key] } },
      (err, data) => {
        if (err) console.log(err);
        console.log("saved:" + key);
        res();
      }
    );
  });
};

module.exports = Languages;
