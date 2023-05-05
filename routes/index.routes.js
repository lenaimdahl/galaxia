const express = require("express");
const router = express.Router();
const NasaAPIHandler = require("../NasaAPIHandler");
//instantiation of NasaAPI class
const nasaAPIInstance = new NasaAPIHandler();

// get Picture of the day
router.get("/", async (req, res, next) => {
  const pictureOfTheDay = await nasaAPIInstance.getPictureOfTheDay();
  const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(6);
  const marsImageData = await nasaAPIInstance.getMarsRoverImages(6);
  res.render("index", { ...pictureOfTheDay, randomLibrary, marsImageData });
});

//get Nasa Space Image
router.get("/library", async (req, res) => {
  try {
    const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(15);
    res.render("library", { randomLibrary });
  } catch (err) {
    console.log("There was an error", err);
  }
});

//get Nasa Space Image in detail
router.get("/library/:nasaImageId", async (req, res) => {
  try {
    const { nasaImageId } = req.params;
    const imageData = await nasaAPIInstance.getdetailedNasaImage(nasaImageId);
    res.render("nasaImage-detail", { imageData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Space Image for Mars Rover
router.get("/gallery", async (req, res) => {
  try {
    const marsImageData = await nasaAPIInstance.getMarsRoverImages(15);
    res.render("gallery", { marsImageData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

module.exports = router;
