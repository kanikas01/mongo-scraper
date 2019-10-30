const db = require('../models')
const { Router } = require('express')
const router = Router()

// Get all unsaved Articles from the db

router.get('/', (req, res) => {
  db.Article.find({ isSaved: false })
    .then(function(dbArticle) {
      res.render("index", {
        articles: dbArticle
      });
    })
    .catch(function(err) {
      res.json(err);
    });
})

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
  axios.get("http://www.theonion.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h1").each(function() {
      var result = {};
      result.title = $(this)
        // .children("a")
        .text()
        .trim();
      result.link = $(this)
        .parent("a")
        .attr("href");
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

// Get all saved Articles from the db
router.get("/saved", function(req, res) {
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
router.put("/save-article/:id", function(req, res) {
  db.Article.updateOne({ _id: req.params.id }, { $set: { isSaved: true } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Delete note
router.delete("/notes/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id })
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});


module.exports = router