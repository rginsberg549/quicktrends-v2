// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the todos
  app.get("/api/stocks", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Stocks.findAll({}).then(function(dbStocks) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbStocks);
    });
  })
}