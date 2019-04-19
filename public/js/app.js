/* eslint-disable no-undef */

$(document).ready(function() {
  // ---------- Event Listeners --------- //

  $(document).on("click", ".btn.scrape-new", scrapeArticles);
  $(document).on("click", ".btn.clear", deleteUnsavedArticles);

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
});
