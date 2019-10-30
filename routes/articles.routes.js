const db = require('../models')
const { Router } = require('express')
const router = Router()

// @articles

// Get a specific Article by id, populate it with its note(s)
router.get("/:id", function(req, res) {
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
router.post("/:id", function(req, res) {
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
router.delete("/", function(req, res) {
  db.Article.deleteMany({ isSaved: false })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});


module.exports = router