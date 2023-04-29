const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;
const isAdmin = require("../middlewares/isAdmin");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/profile", isLoggedIn, (req, res) => {
  const isAdmin = req.session.user.admin;
  console.log(isAdmin);
  res.render("auth/profile", { isAdmin });
});

router.get("/private-library", isLoggedIn, (req, res) => {
  res.render("auth/private-library");
});

router.get("/admin", isAdmin, isLoggedIn, (req, res) => {
  res.render("auth/admin-settings");
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

//Login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    console.log(user);

    if (!user) {
      return res.render("auth/login", { error: "User is not existent" });
    }

    const passwordsMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!passwordsMatch) {
      return res.render("auth/login", {
        error: "Sorry the password is incorrect!",
      });
    }

    req.session.user = {
      username: user.username,
      admin: user.admin,
    };

    console.log(req.body);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
});

module.exports = router;
