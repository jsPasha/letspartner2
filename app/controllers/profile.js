const mongoose = require("mongoose");
const User = mongoose.model("users");

const timezoneJson = require("timezones.json");
const { templatePath } = require("../../data/settings");

const profileController = {
  updateMe: (req, res, next) => {
    let _id = req.user.id;

    if (req.body.phone === "+") req.body.phone = "";
    if (req.user.role !== "admin") delete req.body.email;

    User.update({ _id }, { $set: req.body }, err => {
      if (err) return res.send(err);
      const text = {
        type: "success",
        text: "Data was saved"
      };
      if (req.xhr) return res.send(text);
      req.flash("profileMessage", text);
      res.redirect(`/${req.locale}/profile`);
    });
  },
  update: (req, res, next) => {
    let _id = req.params.id;
    if (req.body.phone === "+") req.body.phone = "";
    User.update({ _id }, { $set: req.body }, err => {
      if (err) return res.send(err);
      if (req.xhr)
        return res.send({
          type: "success",
          text: "Data was saved"
        });
      res.send("this request must bee ajax");
    });
  },
  view: (req, res) => {
    res.render(templatePath, {
      content: "../modules/profile/index",
      infoPopup: req.infoPopup,
      timezoneJson,
      message: req.flash("profileMessage")[0],
      companySubmitMessage: req.flash("submitMember")
    });
  }
};

module.exports = profileController;
