const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;

router.get("/profile", (req, res) => {
  res.render("auth/profile");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/private-library", (req, res) => {
  res.render("auth/private-library");
});

//signup
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser) {
      res.send("Username is already taken.");
      return;
    }

    const salt = await bcryptjs.genSalt(saltRounds);
    console.log(salt);
    const hash = await bcryptjs.hash(req.body.password, salt);
    console.log(hash);

    await User.create({
      username: req.body.username,
      password: hash,
      admin: false,
    });

    res.redirect("/profile");
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/signup");
  }
});

module.exports = router;
