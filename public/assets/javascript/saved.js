/* global bootbox */
$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  var articleContainer = $(".article-container");
  
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.notes-delete", handleNoteDelete);
  // $(".clear").on("click", handleArticleClear);
  initPage();
  function initPage() {
    articleContainer.empty();
    // Run an AJAX request for any unsaved headlines
    $.get("/api/headlines?saved=true")
      .then(function(data) {
      
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articlePanels = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var panel = 
      $(["<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h3>",
          article.headline,
          "<a class ='btn btn-success save'>",
          "Save Article",
          "</a>",
          "</div>",
          "<div class = 'panel-body'>",
          article.summary,
          "</div>",
          "</div>"
  ].join(""));
   panel.data("_id", article._id);
   return panel;
}

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would You Like To browse available articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Article</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }
function renderNotesList(data){
  var notesToRender =[];
  var currentNotes;
  if(!data.notes.length){
    currentNotes = [
      "<li class = 'list-group-item'>",
      "No notes for this article yet.",
      "</li>"
    ].join("");
    notesToRender.push(currentNotes);
  }
  else{
    for(var i = 0; i < data.notes.length; i++){
      currentNotes = $([
        "<li class='list-group-itme note'>",
        data.notes[i].noteText,
        "<button class= 'btn btn-danger note-delete'>X</button>",
        "<li>"
      ].join(""));
      currentNotes.children("button").data("_id", data.notes[i]._id);
      notesToRender.push(currentNotes);
    }
  }
  $(".note-container").append(notesToRender);
}
function handleNoteSave(){
  var noteData;
  var newNote = $(".bootbox-body textarea").val().trim();
  if(newNote){
    noteData = {
      _id: $(this).data("article")._id,
    noteText: newNote
  };
  $.post("/api/notes", noteData).then(function(){
    //when complete, close the modal
    bootbox.hideAll();
    });
  }
}
function handleArticleDelete()  {
  var noteToDelete = $(this).data("_id");
  $.ajax({
    url: "/api/notes/" + noteToDelete,
    method: "DELETE"
  }).then(function(){
    bootbox.hideAll();
  });
}
});


  function handleArticleNotes() {
    // This function handles open the notes model and display our notes 
    var currentArticle = $(this).parents(".panel").data();
    $.get("/api/notes" + currentArticle._id).then(function(data){
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article:",
        currentArticle._id,
        "</h4>",
        "<hr/>",
        "<ul class= 'list-group note-container'>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "</div>"
      ].join("");
      bootbox.dialog({
        message: modalText,
        closeButton: true

      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      //adding some information about the article
      $(".btn.save").data("article", noteData);
      renderNotesList(noteData);
    });
  }


  


