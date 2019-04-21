/* eslint-disable no-undef */

$(document).ready(function() {
  // ---------- Event Listeners --------- //

  $(document).on("click", ".btn.scrape-new", scrapeArticles);
  $(document).on("click", ".btn.clear", deleteUnsavedArticles);
  $(document).on("click", ".btn.save", saveArticle);
  $(document).on("click", ".btn.delete", deleteArticle);
  $(document).on("click", ".btn.add-note", addNote);
  $(document).on("click", ".btn.delete-note", deleteNote);

  // ---------- Event Handlers ---------- //

  // Scrape articles
  function scrapeArticles() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function() {
      location.assign("/");
    });
  }

  // Delete unsaved articles
  function deleteUnsavedArticles() {
    $.ajax({
      method: "DELETE",
      url: "/articles"
    }).then(function() {
      location.reload();
    });
  }

  // Save articles
  function saveArticle() {
    let thisCard = $(this).parents(".card");
    let thisId = $(this)
      .parents(".card")
      .attr("data-id");

    $.ajax({
      method: "PUT",
      url: "/save-article/" + thisId
    }).then(function() {
      thisCard.remove();
    });
  }

  // Remove article from saved articles
  function deleteArticle() {
    let thisCard = $(this).parents(".card");
    let thisId = $(this)
      .parents(".card")
      .attr("data-id");

    $.ajax({
      method: "PUT",
      url: "/remove-article/" + thisId
    }).then(function() {
      thisCard.remove();
    });
  }

  // Add note to article
  function addNote(event) {
    event.preventDefault();
    let thisId = $(this).attr("data-id");
    let note = {
      body: $("#body").val()
    };

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: note
    }).then(function() {
      location.reload();
    });
  }

  // Delete note
  function deleteNote() {
    let thisCard = $(this).parents(".card");
    let thisId = $(this).attr("data-id");
    $.ajax({
      method: "DELETE",
      url: "/notes/" + thisId
    }).then(function() {
      thisCard.remove();
    });
  }
});
