const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const AuthHash = mongoose.model("authHash");

module.exports = passport =>
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        process.nextTick(() => {
          User.findOne({ email: email }, function(err, user) {
            if (err) return done(err);

            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That email is already taken.")
              );
            }

            var newUser = new User();

            newUser.email = email;
            newUser.originalEmail = email;
            newUser.authType = "local";
            newUser.password = newUser.generateHash(password);
            newUser.createdAt = new Date().getTime();

            var hash = new AuthHash({ email });

            newUser.save(function(err) {
              if (err) throw err;
              hash.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
            });
          });
        });
      }
    )
  );
