const express = require("express");
const router = express.Router();
const NasaAPIHandler = require("../NasaAPIHandler");
const PrivateSpaceModel = require("../models/spaceImage.model");

const isAdmin = require("../middlewares/isAdmin");
const isLoggedIn = require("../middlewares/isLoggedIn");
//instantiation of NasaAPI class
const nasaAPIInstance = new NasaAPIHandler();

// get Images for Home Page
router.get("/", async (req, res) => {
  try {
    const pictureOfTheDay = await nasaAPIInstance.getPictureOfTheDay();
    const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(6);
    const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(1);
    const sunPhotoData = await nasaAPIInstance.searchNasaImages("sun", 1);
    const moonPhotoData = await nasaAPIInstance.searchNasaImages("moon", 1);
    const venusPhotoData = await nasaAPIInstance.searchNasaImages("venus", 1);

    res.render("./index", {
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

//Picture of the Day Page
router.get("/picture-of-the-day", async (req, res) => {
  try {
    const pictureOfTheDay = await nasaAPIInstance.getRangeOfPicturesOfTheDay();
    res.render("./picture-of-day", { pictureOfTheDay });
  } catch (err) {
    console.log("There was an error", err);
  }
});

//get Nasa Space Image
router.get("/library", async (req, res) => {
  try {
    const randomLibrary = await nasaAPIInstance.getRandomSpaceImages(200);
    res.render("./library", { randomLibrary });
  } catch (err) {
    console.log("There was an error", err);
  }
});

//get Nasa Space Image in detail
router.get("/library/:nasaImageId", async (req, res) => {
  try {
    const { nasaImageId } = req.params;
    const imageData = await nasaAPIInstance.getdetailedNasaImage(nasaImageId);
    res.render("./nasa-image-detail", { imageData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Space Image and Mars Photos for Mars Rover
router.get("/curiosity", async (req, res) => {
  try {
    const marsPhotoData = await nasaAPIInstance.getMarsCuriosityImages(15);
    res.render("./curiosity", { marsPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Sun Image
router.get("/sun", async (req, res) => {
  try {
    const sunPhotoData = await nasaAPIInstance.searchNasaImages("sun", 15);
    res.render("./sun", { sunPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Nasa Moon Image
router.get("/moon", async (req, res) => {
  try {
    const moonPhotoData = await nasaAPIInstance.searchNasaImages("moon", 15);
    res.render("./moon", { moonPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

// get Venus  Images
router.get("/venus", async (req, res) => {
  try {
    const venusPhotoData = await nasaAPIInstance.searchNasaImages("venus", 15);
    res.render("./venus", { venusPhotoData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

//create new private image
router.get("/library/search", (req, res) => {
  res.render("./search");
});

router.post("/library/search", async (req, res) => {
  try {
    const { keyword } = req.body;
    const searchedImages = await nasaAPIInstance.searchNasaImages(keyword, 12);
    res.render("./search", { searchedImages, keyword });
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/library");
  }
});

//admin page
router.get("/admin", isAdmin, isLoggedIn, async (req, res) => {
  try {
    const allImages = await PrivateSpaceModel.find();
    res.render("./admin-settings", { allImages });
  } catch (err) {
    console.log("There was an error", err);
    res.render("./admin-settings");
  }
});

module.exports = router;
