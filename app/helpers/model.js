const mongoose = require("mongoose");
const News = mongoose.model("news");

const getModel = type => {
  let model;
  switch (type) {
    case "news":
      model = News;
      break;
    default:
      break;
  }
  return model;
};


module.exports = { getModel };