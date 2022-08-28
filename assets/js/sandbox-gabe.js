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
