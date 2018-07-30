const mongoose = require("mongoose");
const { Schema } = mongoose;

const locales = require("../../data/locales");

let textModel = {};
locales.forEach((el, i) => {
  textModel[el] = String;
});

// define the schema for our user model
const constantsSchema = new Schema({
  key: String,
  value: textModel
});

constantsSchema.methods.setDefaultValue = key => {
  let value = {};
  locales.forEach((el, i) => {
    value[el] = key;
  });
  return value;
};

// create the model for users and expose it to our app
mongoose.model("constants", constantsSchema);
