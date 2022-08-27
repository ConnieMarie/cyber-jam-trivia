// save button in modal was clicked
$(".inputBtnGroup #submitBtn").click(function () {
  console.log("Submit button clicked");

  var apiURL = $("#apiUrlInput").val();

  if (apiURL) {
    console.log("API Url has a value");

    $(".inputBtnGroup #submitBtn").last().addClass("is-loading");
    // createTask(taskText, taskDate, "toDo");

    fetchURLdata();
  }
});

var fetchURLdata = function () {
  $(":button").removeClass("is-loading");
};

$(".inputBtnGroup #clearBtn").click(function () {
  console.log("Clear button clicked");
});
