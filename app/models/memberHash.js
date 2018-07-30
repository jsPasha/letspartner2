const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueString = require("unique-string");

// define the schema for our user model
const memberHashSchema = new Schema({
  email: String,
  companyId: String,
  name: String,
  userId: String,
  hash: String
});

memberHashSchema.methods.generateHash = () => {
  return uniqueString();
}

// create the model for users and expose it to our app
mongoose.model("memberHash", memberHashSchema);
