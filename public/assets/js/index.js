let rapidAPIkey = "c08946528f1aa8ab38e951cb961b2d08";
var globalDataObj = [];
var companyProfileObj = {};

let input = $("#stockInput");
let submit = $("#submit");

let companyCardElement = $("#company-card");
let companyProfileElement = $("valuation");
let companyImageElement = $(".company-image");
let companyNameElement = $(".company-name");
let ceoNameElement = $(".ceo-name");
let industryElement = $(".industry");
let currentPriceElement = $(".current-price");
let dateElement = $(".date");
let epsElement = $(".eps");
let dividendElement = $(".dividends");
let grossProfitRatioElement = $(".gross-profit-ratio");
let netIncomeRatioElement = $(".net-income-ratio");
let totalAssetsElement = $(".total-assets");
let totalDebtElement = $(".total-debt");

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

function getIncomeStatementSettings() {
    var incomeStatementSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://financial-modeling-prep.p.rapidapi.com/income-statement/" + getStockSymbol() + "?apikey=" + rapidAPIkey,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
            "x-rapidapi-key": "c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b"
        }
    }
    return incomeStatementSettings
}

function getIncomeStatement() {
    $.ajax(getIncomeStatementSettings()).done(function (response) {
        for (let index = 0; index < response.length; index++) {
            globalDataObj[response[index].date] = {
                ...globalDataObj[response[index].date],
                "eps" : response[index].eps,
                "grossProfitRatio" : response[index].grossProfitRatio,
                "netIncomeRatio" : response[index].netIncomeRatio
            }
        }
    });
}

function getCashFlowSettings() {
    var cashFlowSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://financial-modeling-prep.p.rapidapi.com/cash-flow-statement/" + getStockSymbol() + "?apikey=" + rapidAPIkey,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
            "x-rapidapi-key": "c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b"
        }
    }
    return cashFlowSettings;
}

function getCashFlow() {
    $.ajax(getCashFlowSettings()).done(function (response) {
        for (let index = 0; index < response.length; index++) {
            globalDataObj[response[index].date] = {
                ...globalDataObj[response[index].date],
                "netCashProvidedByOperatingActivities" : response[index].netCashProvidedByOperatingActivities,
                "operatingCashFlow" : response[index].operatingCashFlow,
                "freeCashFlow" : response[index].freeCashFlow
            }
        }
    });
}

function getBalanceSheetSettings() {
    var balanceSheetSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://financial-modeling-prep.p.rapidapi.com/balance-sheet-statement/" + getStockSymbol() + "?apikey=" + rapidAPIkey,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
            "x-rapidapi-key": "c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b"
        }
    }
    return balanceSheetSettings
}

function getBalanceSheet() {
    $.ajax(getBalanceSheetSettings()).done(function (response) {
        for (let index = 0; index < response.length; index++) {

            globalDataObj[response[index].date] = {
                ...globalDataObj[response[index].date],
                "totalAssets" : response[index].totalAssets,
                "totalDebt" : response[index].totalDebt
            }
        }
    }); 
}

function getCompanyProfileSettings() {
    var companyProfileSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://financial-modeling-prep.p.rapidapi.com/profile/" + getStockSymbol()  + "?apikey=" + rapidAPIkey,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "financial-modeling-prep.p.rapidapi.com",
            "x-rapidapi-key": "c23481d564msh4d48ca2d97c6375p1be85ejsna769421f074b"
        }
    }
    return companyProfileSettings
}

function getCompanyProfile() {
    $.ajax(getCompanyProfileSettings()).done(function (response) {

        for (let index = 0; index < response.length; index++) {
            companyProfileObj = {
                ...companyProfileObj[response[index]],
                "companyName" : response[index].companyName,
                "ceo" : response[index].ceo,
                "image" : response[index].image,
                "industry" : response[index].industry,
                "price" : response[index].price,
                "dividend" : response[index].lastDiv
            }
        }
    });
}


function renderCompanyValuation() {
    getIncomeStatement();
    getBalanceSheet();
    getCashFlow();
    getCompanyProfile();
    


    setTimeout(function() { 
        var tempDate = Object.keys(globalDataObj)[0];
        companyImageElement.attr("src", companyProfileObj.image);
        companyNameElement.text(companyProfileObj.companyName);
        //getCompanyArticles(companyProfileObj.companyName);
        ceoNameElement.text("CEO: " + companyProfileObj.ceo);
        industryElement.text("Industry: " + companyProfileObj.industry);
        currentPriceElement.text("Stock Price: " + companyProfileObj.price);
        dateElement.text("Last Filing Date: " + tempDate);
        epsElement.text("EPS: " + (globalDataObj[tempDate].eps).toFixed(2));
        dividendElement.text("Last Dividend: " + (companyProfileObj.dividend).toFixed(2));
        grossProfitRatioElement.text("Gross Profit: " + (globalDataObj[tempDate].grossProfitRatio * 100).toFixed(2) + "%");
        netIncomeRatioElement.text("Net Income: " + (globalDataObj[tempDate].netIncomeRatio *100).toFixed(2) + "%");
        companyCardElement.removeClass("hide");
    }, 2000);
}

function getStockSymbol() {
    var input = $("#stockInput").val();
    return input;
}

submit.on("click", renderCompanyValuation);