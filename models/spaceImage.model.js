const { Schema, model } = require("mongoose");

const privateSpaceSchema = new Schema({
  name: String,
  user: String,
  description: String,
  image: String,
});

const PrivateSpaceModel = model("privateSpaceModel", privateSpaceSchema);
module.exports = PrivateSpaceModel;
