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
    let stockId = parseInt(req.params.id);

    if (!stockId) {
      db.Stock.findAll({
        where: {
          user_id: req.user.id,
        },
      }).then((data) => {
        const items = [];
        data.forEach((element) => {
          items.push(element.dataValues);
        });
        res.render("dashboard", { 
          searchHistory: items
        })
      })
    } else {
     db.Stock.findAll({
       where: {
         user_id: req.user.id,
        },
      })
      .then((data) => {
        const items = [];
        data.forEach((element) => {
          items.push(element.dataValues);
        });
        
        for (let index = 0; index < items.length; index++) {
          console.log(items[index].id);
          console.log(stockId);
          if (stockId === items[index].id) {
            res.render("dashboard", { 
              searchHistory: items,
              newSearch: items[index]
            });
            break
        } else {
          console.log("error");
        }
      }
    })
  }
}) 

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
}