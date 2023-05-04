const express = require("express");
const router = express.Router();
const NasaAPIHandler = require("../NasaAPIHandler");
//instantiation of NasaAPI class
const nasaAPIInstance = new NasaAPIHandler();

router.get("/", async (req, res, next) => {
  const pictureOfTheDay = await nasaAPIInstance.getPictureOfTheDay();
  const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(12);
  res.render("index", { ...pictureOfTheDay, randomLibrary });
});

router.get("/library", async (req, res) => {
  const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(30);
  res.render("library", { randomLibrary });
});

//get Image detailed page
router.get("/library/:nasaImageId", async (req, res) => {
  try {
    const { nasaImageId } = req.params;
    const imageData = await nasaAPIInstance.getdetailedNasaImage(nasaImageId);
    console.log(imageData);
    res.render("nasaImage-detail", { imageData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

module.exports = router;
