// We reuse this import in order to have access to the `body` property in requests
const express = require("express");

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const { MONGO_URI } = require("../db");

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESS_SECRET, // create SESS_SECRET const in env file
      //MONGO_URI is pulled from dg index.js because it has to be the same database url
      store: MongoStore.create({ mongoUrl: MONGO_URI }),
      resave: true,
      saveUninitialized: true,

      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 600000, // 60 * 1000 * 10 ms === 10 min
      },
    })
  );

  // Normalizes the path to the views folder
  app.set("views", path.join(__dirname, "../views"));

  // Sets the view engine to handlebars
  app.set("view engine", "hbs");
  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, "../public")));

  // Handles access to the favicon
  app.use(favicon(path.join(__dirname, "../public/images/favicon.ico")));

  //helper for: check if user is logged in
  //!! create boolean from value, if it exists, its true
  app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.user;
    next();
  });
};
