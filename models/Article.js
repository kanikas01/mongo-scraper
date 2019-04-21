const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  // `notes` is an array that stores objects containing Note ids
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with associated Notes
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ],
  isSaved: {
    type: Boolean,
    required: true,
    default: false
  }
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
