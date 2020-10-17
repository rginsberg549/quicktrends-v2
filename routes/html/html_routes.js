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
    res.render("login", { message: req.flash("error") });
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
          searchHistory: items,
        });
      });
    } else {
      db.Stock.findAll({
        where: {
          user_id: req.user.id,
        },
      }).then((data) => {
        const items = [];
        data.forEach((element) => {
          items.push(element.dataValues);
        });

        for (let index = 0; index < items.length; index++) {
          if (stockId === items[index].id) {
            let nytAPIKey = "&api-key=iabwIkv6ykHl3BTclLtwozsw8QZXDrxl";
            console.log(items[index].companyName)
            console.log(items)
            axios({
              method: "GET",
              url:
                "https://api.nytimes.com/svc/search/v2/articlesearch.json?&q=" +
                items[index].companyName +
                nytAPIKey,
            }).then(function (data) {
              let newsFeedResponse = data.data.response.docs;
              console.log(newsFeedResponse);
              
              let newsFeedObj = [];
              for (let index = 0; index < newsFeedResponse.length; index++) {

                if(newsFeedResponse[index].multimedia[7] != null) {
                   let tempObj = {
                    abstract: newsFeedResponse[index].abstract,
                    newsFeedImg: "https://www.nytimes.com/" + newsFeedResponse[index].multimedia[7].url,
                    webURL: newsFeedResponse[index].web_url
                  };
                  newsFeedObj.push(tempObj);
                } else {
                  continue
                }
              }
              
              res.render("dashboard", {
                searchHistory: items,
                newSearch: items[index],
                newsFeed: newsFeedObj,
              });
            });
          } else {
            console.log("error");
          }
        }
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
