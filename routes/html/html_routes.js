// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
const axios = require("axios");
var path = require("path");
var db = require("../../models/");

// Routes
// =============================================================
module.exports = function (app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", checkNotAuth, function (req, res) {
    res.render("home");
  });

  app.get("/login", checkNotAuth, function (req, res) {
    res.render("login", {message: req.flash('error')});
  });

  app.get("/logout", checkAuth, function (req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/signup", checkNotAuth, function (req, res) {
    res.render("signup");
  });

  app.get("/dashboard/:id?", checkAuth, async function (req, res) {
    let stockId = req.params.id

    if (!stockId) {
      let searchHistory = await axios.get("http://localhost:3001/api/searches");
      
      res.render("dashboard", { 
        searchHistory: searchHistory.data
      });
    } else {
      let searchHistory = await axios.get("http://localhost:3001/api/searches");
      let newSearch = await axios.get("http://localhost:3001/api/stocks/" + stockId);
      res.render("dashboard", { 
        searchHistory: searchHistory.data,
        newSearch: newSearch.data
     });
    }
  });

  // Middleware to not allow access to the list without being signed in
  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
  function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    }
    return next();
  }
};
