// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expresHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();

// Require our routes
var router = express.Router();

//static
app.use(express.static(__dirname + "public"));

// Connect Handlebars to our Express app
app.engine("handlebars", expresHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// use bodyParser in our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Have every request go through our route middleware
app.use(router);

//require routes
require("./config/routes")(router);

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Connect to the Mongo DB
mongoose.connect(db, { useNewUrlParser: true }); 
// mongoose.set('useFindAndModify', false);
  // function(error){
  // if (error){
  //   console.log(error);
  // }
  // else{
  //   console.log("mongoose connection is successful");
  // }


// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
