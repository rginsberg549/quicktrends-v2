
var stockChartSectionElement = $("#stock-chart-section");

var countdown = 0

    $("button").click(function (e) {
        e.preventDefault()
    
            if (countdown < 4) {
            
            var stockInput = $("#stockInput").val()
            var userInput = stockInput
           
            bigFunction(userInput)
            
            

             setTimeout(function() {
                return countdown--
                }, 18000)
    
            return countdown++
            
            } else {
                $("button").prop("disabled", true)
                $("#stockInput").prop("disabled", true)
                count()
            }
         
      })
        
      function count() {
      var count = 20
      timer = setInterval(function () {
          $("#time-remaining").html("slow down... please wait: " + count).slice(-2)
          count--;
          if (count < 0) {
              clearInterval(timer);
              $("#time-remaining").text(" ")
              $("button").prop("disabled", false) 
              $("#stockInput").prop("disabled", false)
          }
      }, 1000)
      }

function bigFunction(userInput) {

apiKey = "ZY0GHO5HP0KA7RXS"
queryUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${userInput}&apikey=${apiKey}`

    

        var stockLabels = []
        var stockPrices8 = []
        var stockPrices21 = []
        var stockRealPriceBucket = []

        var stockRealPrice = []
        
        
            function measureMe(){
                    
                    setTimeout (function(){
                    
                        checkUptrend()

                            function checkUptrend (){
                                    for (var i = 23; i < 31; i++) {
                                        
                                        if (stockPrices8[i] < stockPrices21[i]) {
                                            checkdownTrend()
                                            break;
                                        } else {
                                            uptrendLoaded()
                                            
                                        }
                                    }    
                            }
                            function uptrendLoaded() {
                                $("#trend-text").attr("class", "uk-badge uptrend");
                                $("#trend-text").text("Uptrend Detected")
                            }

                            function checkdownTrend (){
                                    for (var i = 23; i < 31; i++) {
                                        if (stockPrices8[i] > stockPrices21[i]) {
                                            $("#trend-text").attr("class", "uk-badge no-trend");
                                            $("#trend-text").text("No Trend Detected")
                                            break;
                                        } else {
                                            downtrendLoaded()
                                            } 
                                    }
                            }    

                                function downtrendLoaded() {
                                    $("#trend-text").attr("class", "uk-badge downtrend");
                                    $("#trend-text").text("Downtrend Detected")
                                }

                    }, 3000)
            }


             

        function otherData() {
            $.ajax({
                url: queryUrl,
                method: "GET",
                success: function(response){
                    var convertSeriesObj = Object.entries(response["Time Series (Daily)"])
                    for (i = 0; i < 50; i++) {
                         stockRealPrice.unshift(convertSeriesObj[i][1]["1. open"])
                         
                             }
                    for (i = 0; i < 30; i++) {
                        stockRealPriceBucket.unshift(convertSeriesObj[i][1]["1. open"])
                
                        stockLabels.unshift(convertSeriesObj[i][0])
                                    }         
                },
            })
            
            setTimeout(function() {
            
            
            for (i = 0; i > -30; i--) {
            var currentInt = 50 + i
            var ArrStartNum = currentInt - 21
            var divider = 1
            var total = 0
            var divideIt = 0
            while (ArrStartNum < currentInt) {
                total += parseFloat(stockRealPrice[ArrStartNum]);
                    divideIt = total / divider
                    ArrStartNum++;
                    divider++
                    
                }
                
                stockPrices21.unshift(divideIt.toFixed(2))
            }
            
            for (i = 0; i > -30; i--) {
            var currentInt = 50 + i
            var ArrStartNum = currentInt - 8
            var divider = 1
            var total = 0
            var divideIt = 0
            while (ArrStartNum < currentInt) {
                
                    total += parseFloat(stockRealPrice[ArrStartNum]);
                    divideIt = total / divider
                    ArrStartNum++;
                    divider++
                    
                }
                
                stockPrices8.unshift(divideIt.toFixed(2))
            }
            
            
            
            }, 2000)

            measureMe(stockPrices8, stockPrices21)
            makeChart(stockLabels, stockPrices8, stockPrices21 , stockRealPriceBucket)
        }

function makeChart(stockLabels, stockPrices8, stockPrices21, stockRealPriceBucket) {

    setTimeout (function() {
        
       
            var ctx = document.getElementById('stock-chart').getContext('2d');    
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: stockLabels,
                    datasets: [{
                        label: "8 MA",
                        data: stockPrices8,
                        borderColor: 'blue',
                        borderWidth: 1
                    },{
                        label: "21 MA",
                        data: stockPrices21,
                        borderColor: "green",
                        borderWidth: 1,
                        
                    }, {
                        label: "Stock Price",
                        data: stockRealPriceBucket,
                        borderColor: "yellow",
                        borderWidth: 1,
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: userInput,
                        fontSize: 32,
                    },
                    legend: {
                        position: "bottom",
                    },
                    
                    scales: {
                        yAxes: [{
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                },
            });
          
    }, 3000)
    

}

    function makeChart(stockLabels, stockPrices8, stockPrices21, stockRealPriceBucket) {

        stockChartSectionElement.empty();
        var canvasElement = $("<canvas>");
        canvasElement.attr("id", "myChart");
        stockChartSectionElement.append(canvasElement);

        
        setTimeout (function() {

                var ctx = document.getElementById('myChart').getContext('2d');    
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: stockLabels,
                        datasets: [{
                            label: "8 MA",
                            data: stockPrices8,
                            borderColor: 'blue',
                            borderWidth: 1
                        },{
                            label: "21 MA",
                            data: stockPrices21,
                            borderColor: "green",
                            borderWidth: 1,
                            
                        }, {
                            label: "Stock Price",
                            data: stockRealPriceBucket,
                            borderColor: "yellow",
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: userInput.toUpperCase(),
                            fontSize: 32,
                        },
                        legend: {
                            position: "bottom",
                        },
                        
                        scales: {
                            yAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }]
                        },
                        maintainAspectRatio: false
                    },
                });
            
        }, 3000)
        
    }

otherData();

}