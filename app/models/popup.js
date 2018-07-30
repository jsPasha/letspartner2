const mongoose = require("mongoose");

const { Schema } = mongoose;

const locales = require("../../data/locales");

let textModel = {};

locales.forEach((el, i) => {
  textModel[el] = { type: String, default: "hello" };
});

// define the schema for our user model
const popupSchema = new Schema({
  type: String,
  published: { type: Boolean, default: true },
  content: [
    {
      type: { type: String, enum: ["top_header", "header", "block"] },
      text: textModel
    }
  ]
});

mongoose.model("popups", popupSchema);
