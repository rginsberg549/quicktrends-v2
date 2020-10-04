// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.render("home");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.get("/logout", function(req, res) {
    res.redirect("/");
  });

  app.get("/signup", function(req, res) {
    res.render("signup")
  });

  app.get("/dashboard", function(req, res) {
    res.render("dashboard")
  });


  
  
  app.get("/dashboard", function(req, res) {
    res.render("dashboard");
  });
}