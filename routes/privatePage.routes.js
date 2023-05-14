const router = require("express").Router();
const User = require("../models/User.model");
const PrivateSpaceModel = require("../models/spaceImage.model");
const NasaAPIHandler = require("../NasaAPIHandler");
const nasaAPIInstance = new NasaAPIHandler();
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const isAdmin = req.session.user.admin;
    const allImages = await PrivateSpaceModel.find({
      user: req.session.user.id,
    });
    const userId = req.session.user.id;
    const { favorites: favoritesIds } = await User.findById(userId);

    const firstFavorite = await nasaAPIInstance.getDetailsForNasaId(
      favoritesIds[0]
    );

    res.render("private-page/profile", { isAdmin, allImages, firstFavorite });
  } catch (err) {
    console.log("There was an error", err);
    res.render("private-page/profile");
  }
});

//get all images
router.get("/private-library", isLoggedIn, async (req, res) => {
  try {
    const allImages = await PrivateSpaceModel.find({
      user: req.session.user.id,
    });
    res.render("private-page/private-library", { allImages });
  } catch (err) {
    console.log("There was an error", err);
    res.render("private-page/private-library");
  }
});

//create new private image
router.get("/private/create", isLoggedIn, (req, res) => {
  res.render("private-page/new-space-image");
});

router.post("/private/create", async (req, res) => {
  try {
    await PrivateSpaceModel.create({
      name: req.body.name,
      username: req.body.username,
      description: req.body.description,
      image: req.body.image,
      user: req.session.user.id,
    });

    res.redirect("/private-library");
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/create");
  }
});

//get Image detailed page
router.get("/private-library/:spaceImageId", isLoggedIn, async (req, res) => {
  try {
    const { spaceImageId } = req.params;
    const imageData = await PrivateSpaceModel.findById(spaceImageId);
    res.render("private-page/image-detail", { imageData });
  } catch (err) {
    console.log("There was an error", err);
  }
});
//delete  created image
router.post("/private-library/delete/:spaceImageId", async (req, res) => {
  try {
    const { spaceImageId } = req.params;
    await PrivateSpaceModel.findByIdAndDelete(spaceImageId);
    res.redirect("/private-library");
  } catch (err) {
    console.log("There was an error", err);
  }
});

// edit image
router.get(
  "/private-library/edit/:spaceImageId",
  isLoggedIn,
  async (req, res) => {
    const { spaceImageId } = req.params;
    const spaceImage = await PrivateSpaceModel.findById(spaceImageId);

    res.render("private-page/edit-spaceImage", { spaceImage });
  }
);

router.post("/private-library/edit/:spaceImageId", async (req, res) => {
  try {
    const { spaceImageId } = req.params;
    await PrivateSpaceModel.findByIdAndUpdate({ _id: spaceImageId }, req.body);
    res.redirect("/private-library");
  } catch (err) {
    console.log("There was an error", err);
  }
});

//try route to get favorites from nasa api
router.get("/favorites", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { favorites: favoritesIds } = await User.findById(userId);

    const listOfPromises = favoritesIds.map((favoriteId) => {
      return nasaAPIInstance.getDetailsForNasaId(favoriteId);
    });
    const favorites = await Promise.all(listOfPromises);
    res.render("private-page/favorites", { favorites });
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/profile");
  }
});

// added favorites to user in library
router.post("/favorites", async (req, res, next) => {
  try {
    const { imageId } = req.body;
    await User.findByIdAndUpdate(
      { _id: req.session.user.id },
      { $push: { favorites: imageId } }
    );

    res.redirect("/favorites");
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/profile");
  }
});

//get Nasa Space Image in detail
router.get("/favorites/:nasaImageId", async (req, res) => {
  try {
    const { nasaImageId } = req.params;
    const imageData = await nasaAPIInstance.getdetailedNasaImage(nasaImageId);
    res.render("private-page/favorite-Imagedetail", { imageData });
  } catch (err) {
    console.log("There was an error", err);
  }
});

//delete favorite image
//use fetch with eventlistener
router.post("/favorites/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;
    await User.findByIdAndUpdate(
      { _id: req.session.user.id },
      { $pull: { favorites: imageId } }
    );
    res.redirect("/favorites");
  } catch (err) {
    console.log("There was an error", err);
    res.redirect("/favorites");
  }
});

module.exports = router;
