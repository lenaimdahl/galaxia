const router = require("express").Router();
const PrivateSpaceModel = require("../models/spaceImage.model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/profile", isLoggedIn, (req, res) => {
  const isAdmin = req.session.user.admin;
  console.log(isAdmin);
  res.render("private-page/profile", { isAdmin });
});

//get all images
router.get("/private-library", isLoggedIn, async (req, res) => {
  try {
    const allImages = await PrivateSpaceModel.find();
    res.render("private-page/private-library", { allImages });
  } catch (err) {
    console.log("There was an error", err);
  }
  res.render("private-page/private-library");
});

//create new private image
router.get("/private/create", isLoggedIn, (req, res) => {
  res.render("private-page/new-space-image");
});

router.post("/private/create", async (req, res) => {
  try {
    await PrivateSpaceModel.create(req.body);
    res.redirect("/private-library");
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/create");
  }
});

//get Image detailed page
router.get("/private-library/:spaceImageId", async (req, res) => {
  try {
    const { spaceImageId } = req.params;
    const imageData = await PrivateSpaceModel.findById(spaceImageId);
    res.render("private-page/image-detail", { imageData });
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

//delete image

module.exports = router;
