var path = require("path");
const axios = require("axios");
const rapidAPIkey = "c08946528f1aa8ab38e951cb961b2d08";

module.exports = function(app) {

  app.get("/api/stocks/:stock", function(req, res) {
    let stockSymbol = req.params.stock;

    axios({
      "method":"GET",
      "url":"https://financial-modeling-prep.p.rapidapi.com/income-statement/" + stockSymbol,
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"financial-modeling-prep.p.rapidapi.com",
      "x-rapidapi-key":"c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b",
      "useQueryString":true
      },"params":{
      "apikey": rapidAPIkey
      }
      })
      .then((response)=>{
        console.log(response)
      })
      .catch((error)=>{
        console.log(error)
      })

    res.json(res, err);
  });
}