const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const AuthHash = mongoose.model("authHash");
const User = mongoose.model("users");
const { genAuthEmail } = require("../../data/mails");

const smtpSettings = require("../../data/smtp");

const userActivation = (req, res, next) => {
  if (
    req.user &&
    req.url.indexOf("/profile") !== -1 &&
    req.url.indexOf("/activation-user") === -1 &&
    req.url.indexOf("/action/") === -1 &&
    !req.user.active
  ) {
    return res.redirect(`/${req.locale}/activation-user`);
  }
  next();
};

const sendActivationLetter = req => {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount(err => {
      // create reusable transporter object using the default SMTP transport

      if (err) return reject(err);

      const email = req.user.email;

      let transporter = nodemailer.createTransport(smtpSettings);

      AuthHash.findOne({ email }).exec((err, item) => {
        if (err) return reject(err);

        let mailOptions = genAuthEmail({
          host: req.headers.host,
          email,
          hash: item.hash
        });

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) return reject(err);
          resolve();
        });
      });
      // setup email data with unicode symbols
    });
  });
};

const setActivation = req => {
  return new Promise((resolve, reject) => {
    const email = req.user.email;
    const hash = req.query.q;

    AuthHash.findOne({ email }).exec((err, item) => {
      if (err) return reject(err);
      if (item && item.hash === hash) {
        User.findOneAndUpdate(
          { email },
          { active: true, activatedAt: new Date().getTime() },
          err => {
            if (err) return reject(err);
            AuthHash.deleteOne({ email }, err => {
              if (err) reject(err);
            });
            resolve();
          }
        );
      }
    });
  });
};

module.exports = { userActivation, sendActivationLetter, setActivation };
