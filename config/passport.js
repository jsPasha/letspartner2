// load all the things we need
const mongoose = require("mongoose");

// load up the user model
const User = mongoose.model("users");

// expose this function to our app using module.exports
module.exports = function(passport) {
 
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  require("./strategies/LocalSignup")(passport);
  
  require("./strategies/LocalLogin")(passport);

  require("./strategies/Google")(passport);
  
};
