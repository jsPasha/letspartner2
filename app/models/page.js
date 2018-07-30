const mongoose = require("mongoose");

const { Schema } = mongoose;

const locales = require("../../data/locales");

let nameModel = {},
  descriptionModel = {};

locales.forEach((el, i) => {
  nameModel[el] = { type: String, default: `Hello, this is list page!` };
  descriptionModel[el] = { type: String, default: `Hello, this is list page!` };
  // default name is required
  if (i === 0) nameModel[el].require = true;
});

// define the schema for our user model
const pageSchema = new Schema({
  type: String,
  content: {
    name: nameModel,
    description: descriptionModel,
    image: { type: String, default: "" }
  }
});

mongoose.model("pages", pageSchema);