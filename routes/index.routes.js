const express = require("express");
const router = express.Router();
const NasaAPIHandler = require("../NasaAPIHandler");
//instantiation of NasaAPI class
const nasaAPIInstance = new NasaAPIHandler();

// get Picture of the day
router.get("/", async (req, res, next) => {
  const pictureOfTheDay = await nasaAPIInstance.getPictureOfTheDay();
  const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(4);
  const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(4);
  const marsImageData = await nasaAPIInstance.getMarsRoverImages(4);
  res.render("index", {
    ...pictureOfTheDay,
    randomLibrary,
    marsImageData,
    marsPhotoData,
  });
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

// get Nasa Space Image and Mars Photos for Mars Rover
router.get("/gallery", async (req, res) => {
  try {
    const marsImageData = await nasaAPIInstance.getMarsRoverImages(15);
    const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(15);
    res.render("gallery", { marsImageData, marsPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

//create new private image
router.get("/library/search", (req, res) => {
  res.render("search");
});

router.post("/library/search", async (req, res) => {
  try {
    const { keyword } = req.body;
    const searchedImages = await nasaAPIInstance.SearchNasaImages(keyword, 12);
    res.render("search", { searchedImages, keyword });
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/library");
  }
});

module.exports = router;
