const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const MemberHash = mongoose.model("memberHash");
const Team = require("../../app/helpers/members");

module.exports = passport =>
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        const { hash } = req.body;

        User.findOne({ email }, function(err, user) {
          if (err) return done(err);
          if (!user)
            return done(
              null,
              false,
              req.flash("loginMessage", "No user found.")
            );

          if (user.authType !== "local") {
            return done(
              null,
              false,
              req.flash(
                "loginMessage",
                `You have already been signed up with ${
                  user.authType
                }. Please use it for login`
              )
            );
          }

          if (!user.validPassword(password))
            return done(
              null,
              false,
              req.flash("loginMessage", "Oops! Wrong password.")
            );

          if (hash) {
            MemberHash.findOne({ hash }, (err, item) => {
              if (item && item.email === email) {
                Team.confirmParticipation({ item, req, user })
                  .then(message => {
                    if (!err) MemberHash.deleteOne({ hash });
                    return done(err, user, req.flash("submitMember", message));
                  })
                  .catch(err => {
                    console.log("LocalLogin error");
                    return done(err);
                  });
              }
            });
          } else {
            return done(null, user);
          }

          // all is well, return successful user
        });
      }
    )
  );
