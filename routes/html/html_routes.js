// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var db = require("../../models/");

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
    db.Stock.findAll({}).then((data) => {
      console.log(data);
      let stocks = [];
      data.forEach((element) => {
        stocks.push(element.dataValues);
      });
      console.log(stocks);
      res.render("dashboard", {stocks: stocks});
    })
  })
}