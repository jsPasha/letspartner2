const mongoose = require("mongoose");
const crypto = require("crypto");
const async = require("async");
const nodemailer = require("nodemailer");

const smtpSettings = require("../../data/smtp");

const User = mongoose.model("users");

const { genResetMail } = require("../../data/mails");

const sendRestoreMail = req => {
  return new Promise((resolve, reject) => {
    async.waterfall(
      [
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString("hex");
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if (!user)
              return done("No account with that email address exists.");

            if (user.authType !== "local")
              return done(`Try to login with ${user.authType}`);
 
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          nodemailer.createTestAccount((err) => {
            if (err) return done(err);

            let transporter = nodemailer.createTransport(smtpSettings);

            var mailOptions = genResetMail({ host: req.headers.host, token, email: user.email })

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) return done(err);
              done(null);
            });
          });
        }
      ],
      function(err) {
        if (err) {
          req.flash("restoreMessage", err);
          return reject(err);
        }
        req.flash("restoreMessage", "We sent you reset link on email.");
        resolve();
      }
    );
  });
};

const resetPassword = req => {
  return new Promise((resolve, reject) => {
    async.waterfall(
      [
        function(done) {
          User.findOne(
            {
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() }
            },
            function(err, user) {
              if (err) return done(err);

              if (!user)
                return done("Password reset token is invalid or has expired.");

              const password = req.body.password;

              if (password && password.length < 6)
                return done("Short Password!");

              user.password = user.generateHash(password);
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            }
          );
        }
      ],
      function(err) {
        if (err) {
          req.flash("resetMessage", err);
          return reject(err);
        }
        resolve();
      }
    );
  });
};

module.exports = { sendRestoreMail, resetPassword };
