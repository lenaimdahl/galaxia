const router = require("express").Router();

const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/profile", isLoggedIn, (req, res) => {
  const isAdmin = req.session.user.admin;
  console.log(isAdmin);
  res.render("private-page/profile", { isAdmin });
});

router.get("/private-library", isLoggedIn, (req, res) => {
  res.render("private-page/private-library");
});

module.exports = router;
