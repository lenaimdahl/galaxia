const router = require("express").Router();
const User = require("../models/User.model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;

//signup
router.get("/signup", (req, res) => {
  res.render("./auth/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser) {
      res.status(500).render("auth/signup", {
        errorMessage: "Username is already taken.",
      });
      return;
    }

    if (req.body.username === "" || req.body.password === "") {
      res.render("./auth/signup", {
        errorMessage:
          "All fields are mandatory! Please provide your username and your password!",
      });
      return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(req.body.password)) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const salt = await bcryptjs.genSalt(saltRounds);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const user = await User.create({
      username: req.body.username,
      password: hash,
      admin: false,
    });

    req.session.user = {
      username: user.username,
      admin: user.admin,
      id: user._id,
    };

    res.redirect("/profile");
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/signup");
  }
});

//Login
router.get("/login", (req, res) => {
  res.render("./auth/login");
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.render("./auth/login", {
        errorMessage: "Please enter both, username and password to login.",
      });
    }

    const passwordsMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!passwordsMatch) {
      return res.render("./auth/login", {
        errorMessage: "Sorry the password is incorrect! Try again.",
      });
    }

    req.session.user = {
      username: user.username,
      admin: user.admin,
      id: user._id,
    };

    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
});

module.exports = router;
