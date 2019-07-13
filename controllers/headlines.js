var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

var Headline = require("../models/Headline");

module.exports = {
  fetch: function(cb) {
    scrape(function(data) {
      var articles = data;
      // Make sure each article object has a date and is not saved by default
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      //filters the duplicate articles because the article model says the title must be unique
      Headline.collection.insertMany(articles, {ordered:false}, function(err, docs){
        cb(err, docs);
      });
      
    });
  },
  delete: function(query, cb){
    Headline.remove(query, cb);
  },


  get: function(query, cb) {
    //query is currently hardcoded to {saved: true}
    Headline.find(query)
      .sort({
        _id: -1
      })
      .exec(function(err, doc) {
        //send saved articles back to routes to be rendered
        cb(doc);
      });
  },

  update: function(query, cb) {
    // saves or unsaves an article depending on the user query comes from the patch request in app.js
    Headline.update({ _id: query._id }, {
      $set: {saved: query.saved}
    }, {}, cb);
  },

  addNote: function(query, cb) {
    Headline.findOneAndUpdate({_id: query.id }, {
      $push: {note: query.note}
    }, {}, cb);
  }
};