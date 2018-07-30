const mongoose = require("mongoose");
const { Schema } = mongoose;
const locales = require("../../data/locales");

let textModel = {};
locales.forEach((el, i) => {
  textModel[el] = String;
});

const listsSchema = new Schema({
  name: textModel,
  alias: String,
  type: {
    type: String,
    enum: ["directions", "stages", "activities"]
  }
});

mongoose.model("lists", listsSchema);
