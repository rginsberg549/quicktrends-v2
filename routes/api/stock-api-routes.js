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
    }).then((profile) => {

      axios({
        method: "GET",
        url:
          "https://financial-modeling-prep.p.rapidapi.com/income-statement/" +
          stockSymbol +
          "?limit=1",
        headers: {
          "content-type": "application/octet-stream",
          "x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
          "x-rapidapi-key":
            "c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b",
          useQueryString: true,
        },
        params: {
          apikey: apikey,
        },
      }).then((incomeStatement)=> {
        
        axios({
          method: "GET",
          url: "https://quicktrends.herokuapp.com/" + stockSymbol
        }).then((trend) => {
          console.log(trend.data.trend);
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
              price: profile.data[0].price,
              lastDiv: profile.data[0].lastDiv,
              companyName: profile.data[0].companyName,
              website: profile.data[0].website,
              ceo: profile.data[0].ceo,
              sector: profile.data[0].sector,
              image: profile.data[0].image,
              eps: incomeStatement.data[0].eps,
              grossProfitRatio: incomeStatement.data[0].grossProfitRatio,
              netIncomeRatio: incomeStatement.data[0].netIncomeRatio,
              trend: trend.data.trend
            }).then(function (dbStock) {
              return res.json(dbStock);
            }).catch(err => {
              console.log(err);
            });
          } else {
            console.log("Updatimg an existing stock");
            db.Stock.update(
              {
                price: profile.data[0].price,
                lastDiv: profile.data[0].lastDiv,
                companyName: profile.data[0].companyName,
                website: profile.data[0].website,
                ceo: profile.data[0].ceo,
                sector: profile.data[0].sector,
                image: profile.data[0].image,
                eps: incomeStatement.data[0].eps,
                grossProfitRatio: incomeStatement.data[0].grossProfitRatio,
                netIncomeRatio: incomeStatement.data[0].netIncomeRatio,
                trend: trend.data.trend
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
      });
    });
  });
  
  
  app.delete("/api/stocks/:id", function (req, res) {
    db.Stock.destroy({
      where: {
        id: req.params.id,
      },
    })
    .then(function (dbStock) {
    res.json(dbStock);
  })
});

app.get("/api/trend/:id", function (req, res) {
  const apiKey = "ZY0GHO5HP0KA7RXS";
  const stockSymbol = req.params.id.toUpperCase();

  var stockLabels = [];
  let stockPrices8 = [];
  let stockPrices21 = [];
  let stockRealPriceBucket = [];
  let stockRealPrice = [];


  axios({
    method: "GET",
    url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="  + stockSymbol + "&apikey=" + apiKey
  }).then(function (data) {
    
    var convertSeriesObj = Object.entries(data.data["Time Series (Daily)"]);
    
    for (i = 0; i < 50; i++) {
      stockRealPrice.unshift(convertSeriesObj[i][1]["1. open"]);
    }
    
    for (i = 0; i < 30; i++) {
      stockRealPriceBucket.unshift(convertSeriesObj[i][1]["1. open"]);
      stockLabels.unshift(convertSeriesObj[i][0]);
    }
    
    for (i = 0; i > -30; i--) {
      var currentInt = 50 + i;
      var ArrStartNum = currentInt - 21;
      var divider = 1;
      var total = 0;
      var divideIt = 0;
      
      while (ArrStartNum < currentInt) {
        total += parseFloat(stockRealPrice[ArrStartNum]);
        divideIt = total / divider;
        ArrStartNum++;
        divider++;
      }
      
      stockPrices21.unshift(divideIt.toFixed(2));
    }

    for (i = 0; i > -30; i--) {
      var currentInt = 50 + i;
      var ArrStartNum = currentInt - 8;
      var divider = 1;
      var total = 0;
      var divideIt = 0;
      while (ArrStartNum < currentInt) {
        total += parseFloat(stockRealPrice[ArrStartNum]);
        divideIt = total / divider;
        ArrStartNum++;
        divider++;
      }
      
      stockPrices8.unshift(divideIt.toFixed(2));
    }

    let trend
    
    function checkUptrend() {
      for (var i = 23; i < 31; i++) {
        if (stockPrices8[i] < stockPrices21[i]) {
          checkdownTrend();
          break;
        } else {
          uptrendLoaded();
        }
      }
    }

    function uptrendLoaded() {
      trend = {trend: "Uptrend Detected"}
    }

      function checkdownTrend() {
        for (var i = 23; i < 31; i++) {
          if (stockPrices8[i] > stockPrices21[i]) {
            trend = {trend: "No Trend Detected"}
            break;
          } else {
            downtrendLoaded();
          }
        }
      }

      function downtrendLoaded() {
        trend = {trend: "Downtrend Detected"}
      }

      checkUptrend();

      res.json(trend)
  })
})

})
}
