var db = require("../../models");
const axios = require("axios");

module.exports = function (app) {

  app.get("/api/searches", function (req, res) {
    db.Stock.findAll({
      where: {
        user_id: 1 //req.user.id,
      }
    }).then(function (recentSearches) {
      res.json(recentSearches);
    });
  });

  app.get("/api/stocks/:id", function (req, res) {
    db.Stock.findOne({
      where: {
        id: req.params.id,
        user_id: 1 //req.user.id
      },
    }).then(function (stockDetails) {
      res.json(stockDetails);
    });
  });

  app.post("/api/stocks/:name", function (req, res) {
    const apikey = "c08946528f1aa8ab38e951cb961b2d08";

    axios({
      "method":"GET",
      "url":"https://financial-modeling-prep.p.rapidapi.com/profile/" + req.params.name,
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"financial-modeling-prep.p.rapidapi.com",
      "x-rapidapi-key":"c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b",
      "useQueryString":true
      },"params":{
      "apikey": apikey
      }
      })
      .then((response) => {
        //console.log(response)
        db.Stock.create({
          name: req.params.name.toUpperCase(),
          user_id: req.user.id,
          price: response.data[0].price,
          lastDiv: response.data[0].lastDiv,
          companyName: response.data[0].companyName,
          website: response.data[0].website,
          ceo: response.data[0].ceo,
          sector: response.data[0].sector,
          image:response.data[0].image,
        }).then(async function (dbStock) {
          return res.json(dbStock);
     
        });
      })
      .catch((error) => {
        console.log(error);
      });
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


