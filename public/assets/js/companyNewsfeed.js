var nytAPIKey = "&api-key=iabwIkv6ykHl3BTclLtwozsw8QZXDrxl";
var companyArticlesElement = $("#first-slide");
var sectionTitle = $(".newsfeed-section-title");
var newsfeedSectionElement = $("#newsfeed");


function getArticleSearchSettings(q) {
    var query = "&q=" + q
     
    var articleSearchSettings = {
        "url": "https://api.nytimes.com/svc/search/v2/articlesearch.json?" + query + nytAPIKey,
        "method": "GET",
    }  
    return articleSearchSettings
}

function clearCompanyArticles() {
    companyArticlesElement.empty();
}

function getCompanyArticles(q) {
    companyArticlesElement.empty();
    $.ajax(getArticleSearchSettings(q)).done(function(response) {
        var articleData = (response.response.docs)
        setTimeout(function() {
            for (let index = 0; index < articleData.length -1; index++) {
                var articleListStyling = $("<div>").attr({
                    class: "col-md-3",
                    style: "float:left"
                });
                var articleListItem = $("<div>").addClass("card mb-2");

                var articleListImage = $("<img>").attr({
                    class: "card-img-top",
                });

                var articleListCardBody = $("<div>").addClass("card-body")
                var articleListAbstract = $("<p>");
                articleListAbstract.text(articleData[index].abstract);

                if (articleData[index].multimedia[7] != null) {
                    articleListImage.attr("src", "https://www.nytimes.com/" + articleData[index].multimedia[7].url);
                    articleListStyling.append(articleListItem);
                    articleListItem.append([articleListImage, articleListCardBody]);
                    articleListCardBody.append(articleListAbstract);
                    sectionTitle.text("Recent News");
                    companyArticlesElement.append(articleListItem)
                } else {
                    continue
                }
            }
        }, 3000)
    });
}