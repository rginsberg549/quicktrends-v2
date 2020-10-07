var searchElementBtn = $("#submit");
var inputElement = $("#stockInput");
var searchHistoryElement = $(".search-history");

searchElementBtn.on("click", function () {
    stockSymbol = inputElement.val()

    $.ajax({
        url: "/api/stocks/" + stockSymbol,
        method: "POST"
    }).then(function(err,res){
        console.log(err, res);
    })
});