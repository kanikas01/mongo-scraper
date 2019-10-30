const db = require('../models')
const { Router } = require('express')
const router = Router()

// @remove-article

// Remove a single saved article

router.put("/:id", function(req, res) {
  db.Article.updateOne({ _id: req.params.id }, { $set: { isSaved: false } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Remove all saved articles
router.put("/", function(req, res) {
  db.Article.updateMany({ isSaved: true }, { $set: { isSaved: false } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});


module.exports = router