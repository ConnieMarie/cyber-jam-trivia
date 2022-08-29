// save button in modal was clicked
$(".inputBtnGroup #submitBtn").click(function () {
  console.log("Submit button clicked");

  var apiUrl = $("#apiUrlInput").val();

  if (apiUrl) {
    console.log("API Url has a value");

    $(".inputBtnGroup #submitBtn").last().addClass("is-loading");
    // createTask(taskText, taskDate, "toDo");

    fetchURLdata(apiUrl);
  }
});

var fetchURLdata = function (fetchUrl) {
  $(":button").removeClass("is-loading");
};

$(".inputBtnGroup #clearBtn").click(function () {
  console.log("Clear button clicked");
  $("#apiUrlInput").val("");
});

// Idea - dynamically populate trivia category

// function runs only on the home page.
// purpose of the function is to dynamically populate the trivia choices
$(function () {
  if ($("body").hasClass(".homepage")) {
    var triviaCategories = function (repo) {};
  }
});

var triviaAPIQuestion =
  "https://opentdb.com/api.php?amount=1&category=12&type=multiple";

var triviaCategoryUrl = "https://opentdb.com/api_category.php";

document.location.href = newUrl;



// CSS Ideas

.questionIndicators {
  display: flex;
  font-size: 1em;
  justify-content: space-around;
  padding-right: 10%;
  border-style: solid;
  border-color: white;
  color: white;
}

<footer class="footer">
      <div class="columns">
        <div class="column is-8">
          <ul class="questionIndicators">
            <li>X</li>
            <li>X</li>
            <li>X</li>
            <li>X</li>
            <li>X</li>
            <li>X</li>
            <li>X</li>
            <li>X</li>
            <li>X</li>
            <li>X</li>
          </ul>
        </div>
        <div class="columns is-4">
          <div class="is-italic title is-4 has-text-right has-text-white">
            Made by Team Awesome
          </div>
        </div>
      </div>
    </footer>