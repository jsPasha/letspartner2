const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const MemberHash = mongoose.model("memberHash");

const configAuth = require("../auth");

const Team = require("../../app/helpers/members");

const { saveGoogleImage } = require("../../app/helpers/files");

module.exports = passport =>
  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true,
        proxy: true
      },
      function(request, token, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, function(err, googleUser) {
          if (err) return done(err);

          if (googleUser) {
            if (request.session.hash) {
              MemberHash.findOne(
                { hash: request.session.hash },
                (err, item) => {
                  if (item && item.email === googleUser.email) {
                    Team.confirmParticipation({
                      item,
                      req: request,
                      user: googleUser
                    })
                      .then(message => {
                        request.session.hash = null;
                        return done(
                          err,
                          googleUser,
                          request.flash("submitMember", message)
                        );
                      })
                      .catch(err => {
                        console.log("GoogleLognn error");
                        return done(err);
                      });
                  }
                }
              );
            } else {
              return done(null, googleUser);
            }
          } else {
            User.findOne({ email: profile.emails[0].value }, async function(
              err,
              localUser
            ) {
              if (localUser) {
                if (request.session.hash) {
                  MemberHash.findOne(
                    { hash: request.session.hash },
                    (err, item) => {
                      if (item && item.email === localUser.email) {
                        Team.confirmParticipation({
                          item,
                          req: request,
                          user: localUser
                        })
                          .then(message => {
                            request.session.hash = null;
                            return done(
                              err,
                              localUser,
                              request.flash("submitMember", message)
                            );
                          })
                          .catch(err => {
                            console.log("GoogleLognn error");
                            return done(err);
                          });
                      }
                    }
                  );
                } else {
                  return done(null, localUser);
                }
              } else {
                const image = await saveGoogleImage(profile.photos[0].value);
                const time = new Date().getTime();

                var newUser = new User({
                  authType: "google",
                  googleId: profile.id,
                  email: profile.emails[0].value,
                  originalEmail: profile.emails[0].value,
                  name: profile.name.givenName,
                  surname: profile.name.familyName,
                  image,
                  active: true,
                  createdAt: time,
                  activatedAt: time
                });

                newUser.save(function(err) {
                  if (err) return done(err);
                  done(null, newUser);
                });
              }
            });
          }
        });
      }
    )
  );
