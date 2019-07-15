
// Require axios and cheerio, making our scrapes possible
var request = require("request");
var cheerio = require("cheerio");

var scrape = function(cb) {
  // Scrape the NYTimes website
  request("https://www.nytimes.com", function(err, res, html) {
    var $ = cheerio.load(html);
  
    // console.log("scraping");
  
    var articles = [];
    $(".theme-summary").each(function(i, element) {
      var head = $(this)
        .children(".story-heading")
        .text()
        .trim()
       
      // Grab the summary of the article
      var sum = $(this)
      .find(".summary")
      .text()
      .trim();

      // So long as our headline and sum and url aren't empty or undefined, do the following
      if (head && sum ) {
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // Initialize an object we will push to the articles array
        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
        };
        // Push new article into articles array
        articles.push(dataToAdd);
      }
    });
    cb(articles) ;
  });
};

// Export the function, so other files in our backend can use it
module.exports = scrape;
