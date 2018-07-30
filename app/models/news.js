// load the things we need
const mongoose = require("mongoose");
const { Schema } = mongoose;
const locales = require("../../data/locales");

let langModel = {};

locales.forEach((el, i) => (langModel[el] = { type: String }));

// define the schema for our user model
const newsSchema = new Schema({
  alias: String,
  name: langModel,
  description: langModel,
  createdAt: { type: Number, default: new Date().getTime() },
  published: { type: Boolean, default: 1 },
  images: {
    thumbNewsImage: String,
    mainNewsImage: String
  },
  floatContent: [
    {
      name: langModel,
      gallery: [String],
      contentType: String,
      header: langModel,
      video: {
        pastedUrl: String,
        id: String,
        api: {
          thumbnails: String,
          title: String
        }
      },
      text: langModel
    }
  ]
});

// create the model for users and expose it to our app
mongoose.model("news", newsSchema);
