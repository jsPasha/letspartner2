const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagsSchema = new Schema({
  name: String
});

mongoose.model("tags", tagsSchema);
