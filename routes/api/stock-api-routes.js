var db = require("../../models");
const axios = require("axios");

module.exports = function (app) {
  app.get("/api/searches", function (req, res) {
    console.log(req.user);
    db.Stock.findAll({
      where: {
        user_id: req.user.id,
      },
    }).then(function (recentSearches) {
      res.json(recentSearches);
    });
  });

  app.get("/api/stocks/:id", function (req, res) {
    db.Stock.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    }).then(function (stockDetails) {
      res.json(stockDetails);
    });
  });

  app.post("/api/stocks/:name", function (req, res) {
    const apikey = "c08946528f1aa8ab38e951cb961b2d08";
    const stockSymbol = req.params.name.toUpperCase();

    axios({
      method: "GET",
      url:
        "https://financial-modeling-prep.p.rapidapi.com/profile/" + stockSymbol,
      headers: {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
        "x-rapidapi-key": "c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b",
        useQueryString: true,
      },
      params: {
        apikey: apikey,
      },
    })
      .then((response) => {
        db.Stock.findOne({
          where: {
            user_id: req.user.id,
            name: stockSymbol,
          },
        }).then((stockExists) => {
          if (stockExists == null) {
            console.log("Posting a new stock");
            db.Stock.create({
              name: stockSymbol,
              user_id: req.user.id,
              price: response.data[0].price,
              lastDiv: response.data[0].lastDiv,
              companyName: response.data[0].companyName,
              website: response.data[0].website,
              ceo: response.data[0].ceo,
              sector: response.data[0].sector,
              image: response.data[0].image,
            }).then(function (dbStock) {
              return res.json(dbStock);
            });
          } else {
            console.log("Updatimg an existing stock");
            db.Stock.update(
              {
                price: response.data[0].price,
                lastDiv: response.data[0].lastDiv,
                companyName: response.data[0].companyName,
                website: response.data[0].website,
                ceo: response.data[0].ceo,
                sector: response.data[0].sector,
                image: response.data[0].image,
              },
              {
                where: {
                  user_id: req.user.id,
                  name: stockSymbol,
                },
                returning: true,
                plain: true,
              }
            ).then(() => {
              db.Stock.findOne({
                where: {
                  user_id: req.user.id,
                  name: stockSymbol,
                },
              }).then((newStockData) => {
                res.json(newStockData);
              });
            });
          }
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
