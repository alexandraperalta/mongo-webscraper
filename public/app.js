// Get articles
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display
    $("#articles").append("<p class='articleCard' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#articles").append("<p><button data-id='" + data[i]._id + "' data-toggle='modal' data-target='#commentsModal' id='getComments'>Make a Comment</button></p>");
  }
});

$(document).on("click", "#getComments", function () {
  var thisId = $(this).attr("data-id");
  $("#commentsModalBody").empty();
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function (data) {
    $("#commentsTitle").text(data.title);
    $("#commentsModalBody").append("<textarea id='bodyinput' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    $("#commentsModalBody").append("<button data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save Note</button>");    
  });
  
});
// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      getCommentsById(data._id);      
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// Whenever someone clicks a p tag
$(document).on("click", ".articleCard", function () {  
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  getCommentsById(thisId);
});

$(document).on("click", "#deleteComment", function () {
  var commentId = $(this).attr("comment-id");
  var dataId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/remove/"+dataId+"/"+commentId
  }).then(function(data){
    console.log(data);
    getCommentsById(dataId);
  })
});

function getCommentsById(thisId){
  $("#notes").empty();
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<h4>Comments</h4>");
      for (var i = 0; i < data.comments.length; i++) {
        var currentComment = data.comments[i];
        $("#notes").append(currentComment.body);
        $("#notes").append("<button data-id='"+ data._id + "' comment-id='" + data.comments[i]._id + "' id='deleteComment'>Delete</button>");
        $("#notes").append("<br/>");
      }
    });
}

