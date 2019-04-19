/* eslint-disable no-undef */

$(document).ready(function() {
  // ---------- Event Listeners --------- //

  $(document).on("click", ".btn.scrape-new", scrapeArticles);
  $(document).on("click", ".btn.clear", deleteUnsavedArticles);
  $(document).on("click", ".btn.save", saveArticles);
  $(document).on("click", ".btn.delete", handleArticleDelete);

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
});
