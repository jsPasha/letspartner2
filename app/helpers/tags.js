const mongoose = require("mongoose");
const Tags = mongoose.model("tags");

const saveTags = tags => {
  if (tags)
    tags.forEach(name => {
      Tags.findOne({ name }, (err, tag) => {
		  if (!tag) new Tags({ name }).save();
		  return;
      });
    });
};

module.exports = saveTags;
