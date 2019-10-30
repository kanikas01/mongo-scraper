// ---------- Imports ---------- //
const axios = require("axios");
const cheerio = require("cheerio");
const compression = require("compression");
const exphbs = require("express-handlebars");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// ---------- Configure middleware ---------- //

// Use compression to improve page load times
app.use(compression());

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir: __dirname + "/views/partials"
  })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// ---------- ROUTES ---------- //
app.use('/', require('./routes/index.routes'))
app.use('/articles', require('./routes/articles.routes'))
app.use('/remove-article', require('./routes/remove-article.routes'))

// ---------- END ROUTES ---------- //

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
