const { isNotLoggedIn } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = mongoose.model("users");
const MemberHash = mongoose.model("memberHash");

module.exports = templatePath => {
  router.route("/login").get(
    isNotLoggedIn,
    (req, res, next) => {
      MemberHash.findOne({hash: req.query.q}).exec((err, item) => {
        req.hashItem = item;
        next();
      });
    },
    function(req, res) {
      res.render(templatePath, {
        content: "../modules/auth/login",
        message: req.flash("loginMessage"),
        hashItem: req.hashItem
      });
    }
  );

  router.route("/signup").get(isNotLoggedIn, function(req, res) {
    res.render(templatePath, {
      content: "../modules/auth/signup",
      message: req.flash("signupMessage")
    });
  });

  router.route("/restore").get(isNotLoggedIn, function(req, res) {
    const error = req.session.restoreError;
    req.session.restoreError = undefined;

    res.render(templatePath, {
      content: "../modules/auth/restore",
      message: req.flash("restoreMessage"),
      error
    });
  });

  router.get("/reset/:token", function(req, res) {
    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      function(err, user) {
        if (!user) {
          req.flash(
            "restoreMessage",
            "Password reset token is invalid or has expired."
          );
          return res.redirect("/restore");
        }
        res.render(templatePath, {
          content: "../modules/auth/reset",
          token: req.params.token,
          message: req.flash("resetMessage")
        });
      }
    );
  });

  return router;
};
