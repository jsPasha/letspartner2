const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueString = require("unique-string");

// define the schema for our user model
const hashSchema = new Schema({
  email: String,
  hash: {
    type: String,
    default: uniqueString()
  }
});

// create the model for users and expose it to our app
mongoose.model("authHash", hashSchema);
