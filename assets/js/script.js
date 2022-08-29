var dropdown = document.querySelector(".dropdown");
dropdown.addEventListener("click", function (event) {
  event.stopPropagation();
  dropdown.classList.toggle("is-active");
});

// var dropdownItem = document.querySelector(".dropdown-item");
// dropdownItem.addEventListener("mouseover", function (event) {
//   event.stopPropagation();
//   dropdownItem.classList.toggle("is-active");
// });

// $(function () {
//   $("#jquery-dropdown").selectmenu();
//   console.log($("#jquery-dropdown").selectmenu().val);
// });

$(".dropdown-content").click(function (event) {
  var topic = event.target.innerText;
  console.log(topic);

  // var apiUrl = $("#apiUrlInput").val();
  //   console.log(apiUrl);

  // if (apiUrl) {
  //   console.log("API Url has a value");

  //   $(".dropdown-content #submitBtn").last().addClass("is-loading");
  // createTask(taskText, taskDate, "toDo");

  // fetchURLdata(apiUrl);
  // }
});
