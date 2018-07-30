// load the things we need
const mongoose = require("mongoose");
const { Schema } = mongoose;
const locales = require("../../data/locales");

const targetAudienceTypes = require("../../data/settings").company
  .targetAudienceTypes;

let langModel = {};

locales.forEach((el, i) => (langModel[el] = { type: String }));

// define the schema for our user model
const companySchema = new Schema({
  alias: String,
  type: {
    type: String,
    enum: ["startup", "corporation"]
  },
  status: {
    type: String,
    enum: ["moderation", "published", "draft", "reject"],
    default: "moderation"
  },
  creator: String,
  name: langModel,
  description: langModel,
  images: {
    logo: String,
    thumb: String,
    main: String
  },
  admin_message: {
    reject: String
  },
  phones: [String],
  social: {
    website: String,
    facebook: String,
    linkedin: String
  },
  locations: [
    {
      lat: String,
      lng: String
    }
  ],
  directions: [String],
  activity: String,
  stages: [String],
  idea: String,
  problems: String,
  projects: String,
  results: String,
  break_even: String,
  targetAudience: {
    type: {
      type: "String",
      enum: targetAudienceTypes
    },
    problems: langModel,
    solving: langModel
  },
  tags: [String],
  members: [
    {
      userId: String,
      email: String,
      phone: String,
      position: String,
      name: String,
      surname: String,
      confirmed: {
        type: Boolean,
        default: false
      },
      companyRole: {
        type: String,
        enum: ["member", "founder"]
      },
      image: String,
      about: String,
      adminRole: {
        type: String,
        enum: ["admin", "user"]
      }
    }
  ],
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
  createdDate: {
    type: String,
    default: () => {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;
      return mm + "/" + dd + "/" + yyyy;
    }
  },
  submitedAt: Number,
  description_lang: [String]
});

// create the model for users and expose it to our app
mongoose.model("company", companySchema);
