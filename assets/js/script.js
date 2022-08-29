// var apiKey = "+UAPOEz8eS3RqXRJjvFjxA==jfNUZHAlHVThyjIt";

// var category = "music";
// $.ajax({
//   method: "GET",
//   url: "https://api.api-ninjas.com/v1/trivia?category=" + category,
//   headers: { "X-Api-Key": apiKey },
//   contentType: "application/json",
//   success: function (result) {
//     console.log(result);
//   },
//   error: function ajaxError(jqXHR) {
//     console.error("Error: ", jqXHR.responseText);
//   },
// });

var buttonContainer = document.querySelector("#choiceButtons");

var choiceButtonHandler = function (event) {
  console.log("button was clicked");
  //   event.preventDefault();
  // get value from input element
  var choiceSelected = event.target.getAttribute("value");

  console.log(choiceSelected);

  //   if (username) {
  //     getUserRepos(username);
  //     nameInputEl.value = "";
  //   } else {
  //     alert("Please enter a GitHub username");
  //   }
};

buttonContainer.addEventListener("click", choiceButtonHandler);
