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

module.exports = router;
