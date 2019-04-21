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

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  axios.get("http://www.theonion.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h1").each(function() {
      var result = {};
      result.title = $(this)
        .children("a")
        .text()
        .trim();
      result.link = $(this)
        .children("a")
        .attr("href")
        .trim();
      result.summary = $(this)
        .parent()
        .siblings()
        .find("p")
        .text()
        .trim();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Get all unsaved Articles from the db
app.get("/", function(req, res) {
  db.Article.find({ isSaved: false })
    .then(function(dbArticle) {
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get all saved Articles from the db
app.get("/saved", function(req, res) {
  db.Article.find({ isSaved: true })
    .then(function(dbArticle) {
      res.render("saved", {
        articles: dbArticle
      });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Save a specific Article by id
app.put("/save-article/:id", function(req, res) {
  db.Article.updateOne({ _id: req.params.id }, { $set: { isSaved: true } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Remove a single saved article
app.put("/remove-article/:id", function(req, res) {
  db.Article.updateOne({ _id: req.params.id }, { $set: { isSaved: false } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Remove all saved articles
app.put("/remove-article", function(req, res) {
  db.Article.updateMany({ isSaved: true }, { $set: { isSaved: false } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get a specific Article by id, populate it with its note(s)
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function(dbArticle) {
      res.render("note", {
        article: dbArticle
      });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Save or update an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      // { new: true } tells query to return the updated Article, not the original
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { notes: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Delete all non-saved articles from the DB
app.delete("/articles", function(req, res) {
  db.Article.deleteMany({ isSaved: false })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Delete note
app.delete("/notes/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id })
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// ---------- END ROUTES ---------- //

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
