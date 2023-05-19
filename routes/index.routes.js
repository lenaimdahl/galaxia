const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const NasaAPIHandler = require("../NasaAPIHandler");
const PrivateSpaceModel = require("../models/spaceImage.model");

const isAdmin = require("../middlewares/isAdmin");
const isLoggedIn = require("../middlewares/isLoggedIn");
// instantiation of NasaAPI class
const nasaAPIInstance = new NasaAPIHandler();

// get Images for Home Page
router.get("/", async (req, res) => {
  try {
    const pictureOfTheDay = await nasaAPIInstance.getPictureOfTheDay();
    const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(5);
    const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(1);
    const sunPhotoData = await nasaAPIInstance.searchNasaImages("sun", 1);
    const moonPhotoData = await nasaAPIInstance.searchNasaImages("moon", 1);
    const venusPhotoData = await nasaAPIInstance.searchNasaImages("venus", 1);

    res.render("index", {
      ...pictureOfTheDay,
      randomLibrary,
      marsPhotoData,
      sunPhotoData,
      moonPhotoData,
      venusPhotoData,
    });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// Picture of the Day Page
router.get("/picture-of-the-day", async (req, res) => {
  try {
    const pictureOfTheDay = await nasaAPIInstance.getRangeOfPicturesOfTheDay();
    res.render("galleries/picture-of-the-day", { pictureOfTheDay });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Space Image
router.get("/library", async (req, res) => {
  try {
    const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(200);
    res.render("galleries/library", { randomLibrary });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Space Image and Mars Photos for Mars Rover
router.get("/curiosity", async (req, res) => {
  try {
    const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(50);
    res.render("galleries/curiosity", { marsPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Sun Image
router.get("/sun", async (req, res) => {
  try {
    const sunPhotoData = await nasaAPIInstance.searchNasaImages("sun", 50);
    res.render("galleries/sun", { sunPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Moon image
router.get("/moon", async (req, res) => {
  try {
    const moonPhotoData = await nasaAPIInstance.searchNasaImages("moon", 50);
    res.render("galleries/moon", { moonPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Venus images
router.get("/venus", async (req, res) => {
  try {
    const venusPhotoData = await nasaAPIInstance.searchNasaImages("venus", 50);
    res.render("galleries/venus", { venusPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get quiz images
router.get("/earth-quiz", async (req, res) => {
  try {
    const quizPhotoData = await nasaAPIInstance.searchNasaImages(
      "Mystery Image quiz",
      50
    );
    res.render("galleries/quiz", { quizPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get galex images
router.get("/galex", async (req, res) => {
  try {
    const galexPhotoData = await nasaAPIInstance.searchNasaImages(
      "Galaxy Evolution Explorer",
      50
    );
    res.render("galleries/galex", { galexPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// create new private image
router.get("/library/search", async (req, res) => {
  try {
    const keyword = req.query.q;
    const searchedImages = await nasaAPIInstance.searchNasaImages(keyword, 50);
    res.render("search", { searchedImages, keyword });
  } catch (err) {
    console.log("there was an error", err);
    res.render("search");
  }
});

// get Nasa Space Image in detail
router.get("/library/:nasaImageId", async (req, res) => {
  try {
    const { nasaImageId } = req.params;
    const imageData = await nasaAPIInstance.getdetailedNasaImage(nasaImageId);
    res.render("galleries/nasa-image-detail", { imageData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// admin page
router.get("/admin", isAdmin, isLoggedIn, async (req, res) => {
  try {
    const allImages = await PrivateSpaceModel.find();
    res.render("admin-settings", { allImages });
  } catch (err) {
    console.log("There was an error", err);
    res.render("admin-settings");
  }
});

module.exports = router;
