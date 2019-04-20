/* eslint-disable no-undef */

$(document).ready(function() {
  // ---------- Event Listeners --------- //

  $(document).on("click", ".btn.scrape-new", scrapeArticles);
  $(document).on("click", ".btn.clear", deleteUnsavedArticles);
  $(document).on("click", ".btn.save", saveArticles);
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.add-note", handleAddNote);

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
  function saveArticles() {
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
  function handleArticleDelete() {
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
  function handleAddNote(event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    var note = {
      body: $("#body").val()
    };

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: note
    }).then(function() {
      $(".toast").toast({ delay: 1000 });
      $(".toast").toast("show");
    });
  }
});
