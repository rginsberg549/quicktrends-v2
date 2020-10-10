var db = require("../../models");
const axios = require("axios");

module.exports = function (app) {
  app.get("/api/stocks", function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Stock.findAll({}).then(function (dbStock) {
      res.json(dbStock);
    });
  });

  app.get("/api/stocks/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Stock.findOne({
      where: {
        id: req.params.id,
      },
    }).then(function (dbStock) {
      res.json(dbStock);
    });
  });

  app.post("/api/stocks/:name", function (req, res) {
    console.log(req.user);
    db.Stock.create({
      name: req.params.name,
      user_id: req.user.id,
    }).then(function (dbStock) {
      res.json(dbStock);
    });

    //   axios({
    //     "method":"GET",
    //     "url":"https://financial-modeling-prep.p.rapidapi.com/balance-sheet-statement/" + req.params.name,
    //     "headers":{
    //       "content-type":"application/octet-stream",
    //       "x-rapidapi-host":"financial-modeling-prep.p.rapidapi.com",
    //       "x-rapidapi-key":"c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b",
    //       "useQueryString":true
    //     },"params":{
    //       "apikey":"demo"
    //     }})
    //     .then((response)=>{
    //       res.render("dashboard", response.data);
    //   })
    //   .catch((error)=>{
    //     console.log(error)
    //   })
  });

  app.delete("/api/stocks/:id", function (req, res) {
    db.Stock.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function (dbStock) {
      res.json(dbStock);
    });
  });
};
