const express = require("express");
const router = express.Router();
const NasaAPIHandler = require("../NasaAPIHandler");
const User = require("../models/User.model");
//instantiation of NasaAPI class
const nasaAPIInstance = new NasaAPIHandler();

// get Picture of the day
router.get("/", async (req, res, next) => {
  const pictureOfTheDay = await nasaAPIInstance.getPictureOfTheDay();
  const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(6);
  const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(1);
  const sunPhotoData = await nasaAPIInstance.SearchNasaImages("sun", 1);
  const moonPhotoData = await nasaAPIInstance.SearchNasaImages("moon", 1);
  const venusPhotoData = await nasaAPIInstance.SearchNasaImages("venus", 1);

  res.render("index", {
    ...pictureOfTheDay,
    randomLibrary,
    marsPhotoData,
    sunPhotoData,
    moonPhotoData,
    venusPhotoData,
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
router.get("/curiosity", async (req, res) => {
  try {
    const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(15);

    res.render("curiosity", { marsPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Sun Image
router.get("/The-Sun", async (req, res) => {
  try {
    const sunPhotoData = await nasaAPIInstance.SearchNasaImages("sun", 15);

    res.render("sun", { sunPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Moon Image
router.get("/The-Moon", async (req, res) => {
  try {
    const moonPhotoData = await nasaAPIInstance.SearchNasaImages("moon", 15);

    res.render("moon", { moonPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Venus  Images
router.get("/The-Venus", async (req, res) => {
  try {
    const venusPhotoData = await nasaAPIInstance.SearchNasaImages("venus", 15);

    res.render("venus", { venusPhotoData });
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
