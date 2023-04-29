const express = require("express");
const router = require("express").Router();

router.get("/profile", (req, res) => {
  res.render("auth/profile");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/private-library", (req, res) => {
  res.render("auth/private-library");
});

module.exports = router;
