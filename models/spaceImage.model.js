const { Schema, model } = require("mongoose");

const privateSpaceSchema = new Schema({
  name: String,
  description: String,
  image: String,
});

const privateSpaceModel = model("privateSpaceModel", privateSpaceSchema);
module.exports = privateSpaceModel;
