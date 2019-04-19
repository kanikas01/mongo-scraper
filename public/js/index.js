/* eslint-disable no-undef */

$(document).ready(function() {
  // ---------- Event Listeners --------- //

  $(document).on("click", ".btn.save", saveArticles);

  // ---------- Event Handlers ---------- //

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
});
