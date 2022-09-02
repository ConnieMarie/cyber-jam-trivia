var questionData; //need global for click event
var score = 0;
var highScoreList = [];
var gameQuestionCountLimit = 10;
var gameQuestionCount = 0;
var gameCategoryId = "";
var giphyImgUrl = ""; //function nested and not returning to original call
var giphyRandomRange = 20;
var giphyApiKey = "IqouWAvchaDj6oy5b7niRntKCW50BpKB";
var giphyApiUrl =
  "http://api.giphy.com/v1/gifs/search?q=<searchTerm>&api_key=<giphyApiKey>&limit=20&offset=<randomNum>";
var triviaApiUrl =
  "https://opentdb.com/api.php?amount=1&category=<catId>&type=multiple";
var triviaCatListApiUrl = "https://opentdb.com/api_category.php";

// var motivationalApiUrl = "https://nodejs-quoteapp.herokuapp.com/quote"

// is-primary

// dummy high score list
var highScoreList = [
  {
    name: "Rockin Connie",
    score: 8,
  },
  {
    name: "Mark the Destroyer",
    score: 9,
  },
  {
    name: "The Gabinator",
    score: 4,
  },
];

// giphy search terms
var giphyKeyword = [
  {
    category: "New High Score",
    keywords: [
      "high+score",
      "winner",
      "champion",
      "gold+medal",
      "winner+winner+chicken+dinner",
    ],
  },
  {
    category: "Good Score",
    keywords: [
      "success",
      "amazing",
      "brainiac",
      "smarty+pants",
      "you+are+a+genius",
    ],
  },
  {
    category: "Bad Score",
    keywords: [
      "better+luck+next+time",
      "keep+trying",
      "not+your+jam",
      "you+got+this",
    ],
  },
];

//navbar menu active toggle
$("header").on("click", ".navbar-burger", function () {
  $(".navbar-burger").toggleClass("is-active");
  $(".navbar-menu").toggleClass("is-active");
});

// *** HOME PAGE ***
//runs event listeners specific to the main page
if ($("body").hasClass("homepage")) {
  //populates the dropdown menu with all available trivia
  var triviaCatListAPI = function () {
    var fetchUrl = triviaCatListApiUrl;
    // make a request to the url
    fetch(fetchUrl)
      .then(function (response) {
        // request was successful
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);

            var catListHtml = "";
            for (var i = 0; i < data.trivia_categories.length; i++) {
              catListHtml =
                catListHtml +
                "<a class='dropdown-item is-primary is-size-6 is-fullwidth' data-catId='" +
                data.trivia_categories[i].id +
                "'>" +
                data.trivia_categories[i].name.replace("Entertainment: ", "") +
                "</a>";
            }
            console.log(catListHtml);
            $("#dropdownCatList").html(catListHtml);
          });
        } else {
          var alertTitle = "Oops...";
          var alertMessage =
            "The trivia game experienced an error. Please refresh the browser. If the issue persists, try playing again later or contact the owner of this application.";
          var alertButtonMessage = "Got it!";
          openModal(alertTitle, alertMessage, alertButtonMessage);
          console.log("Trivia API Error: Unable to retreive a question");
        }
      })
      .catch(function (error) {
        var alertTitle = "Oops...";
        var alertMessage =
          "The trivia game experienced an error. Please refresh the browser. If the issue persists, try playing again later or contact the owner of this application.";
        var alertButtonMessage = "Got it!";
        openModal(alertTitle, alertMessage, alertButtonMessage);
        console.log("Trivia API Error: Unable to connect to trivia database");
      });
  };

  triviaCatListAPI();

  //toggles the bulma dropdown button reveal
  var dropdown = document.querySelector(".dropdown");
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.classList.toggle("is-active");
  });

  //when category is selected, stores the category in variable for API
  $(".dropdown-content").click(function (event) {
    var topic = event.target.innerText;
    console.log(topic);

    //stores the data-catId from the dropdown to add to the API search
    gameCategoryId = $(event.target).attr("data-catId");

    if (gameCategoryId) {
      // when page changes, the javascript variables lose the data
      // added category to sessionStorage for the trivia page to use in api
      sessionStorage.setItem("triviaCategory", gameCategoryId);
      console.log(gameCategoryId);
      $("#dropdownText").text(topic);
    }
  });

  //Prevents moving forward to play game without a category selected
  $("#playButton").click(function (event) {
    //checks to ensure a category was selected and no undefined
    if (gameCategoryId && gameCategoryId != "") {
      console.log(gameCategoryId);
      //if a category was select, redirects to the game page
      document.location.href = "game-page.html";
    } else {
      var alertTitle = "In Order To Play...";
      var alertMessage =
        "Please select a topic! You can't answer questions about nothing!";
      var alertButtonMessage = "Got it!";
      openModal(alertTitle, alertMessage, alertButtonMessage);
    }
  });
}

// *** GAME PAGE ***
//runs event listeners specific to the gamePage
if ($("body").hasClass("triviaPage")) {
  //loading sessionStorage
  if (sessionStorage.getItem("triviaCategory")) {
    // Restore the contents of the text field
    gameCategoryId = sessionStorage.getItem("triviaCategory");
    console.log(gameCategoryId);
  }

  $("#startButton").click(function (event) {
    //checks to ensure a category was selected and no undefined
    if (gameCategoryId && gameCategoryId != "") {
      //if category variable has a value, calls question
      gameQuestionCount = 0;
      score = 0;
      getQuestion();
    } else {
      //if category variable is empty (user directly access game page bypassing category question), redirects to the home page to have user select the trivia category
      document.location.href = "index.html";
    }
  });
}

// *** HIGH SCORE PAGE ***
//runs event listeners specific to the gamePage
if ($("body").hasClass("highScorePage")) {
  // get local storage high score
  highScoreList = JSON.parse(localStorage.getItem("triviahighscore"));
  console.log(highScoreList);
  //if no high score list, user obtained a new high score
  var tableData = "";
  if (highScoreList === null) {
    tableData =
      "<tr><td></td><td>No high scores, easy mode enabled!</td><td></td></tr>";
  } else {
    // else check all scores in array to determine if high score achieved
    console.log(highScoreList.length);
    for (var i = 0; i < highScoreList.length; i++) {
      tableData =
        tableData +
        "<tr><td>" +
        (i + 1) +
        "</td><td>" +
        highScoreList[i].name +
        "</td><td>" +
        highScoreList[i].score +
        "</td></tr>";
    }

    console.log(tableData);
  }
  $("#tableListBody").append(tableData);
}

function openModal(modalTitle, modalMessage, modalButtonText) {
  $("body").append(
    "<div class='modal is-clipped is-active' id='modal-select-topic'><div class='modal-background'></div><div class='modal-card'><header class='modal-card-head'><p class='modal-card-title'>" +
      modalTitle +
      "</p></header><section class='modal-card-body is-size-4'><h1></h1><p>" +
      modalMessage +
      "</p></section><footer class='modal-card-foot'><button class='button has-background-primary-dark has-text-white is-large' id='modalButton'>" +
      modalButtonText +
      "</button></footer></div></div>"
  );

  $("body").on("click", "#modalButton", function () {
    $("body").off("click", "#modalButton");
    console.log("clicked return home");
    $("#modal-select-topic").remove();
  });
}

var getQuestion = function () {
  // end with endGame check (if that was the last question to ask)
  //if total questions asked match the total variable, run the endGame function
  //else clear screen and run getQuestion again
  if (gameQuestionCount >= gameQuestionCountLimit) {
    endGame();
  } else {
    gameQuestionCount++;
    // clearing question area
    $("#gameArea").html("");

    var fetchUrl = triviaApiUrl.replace("<catId>", gameCategoryId);
    // make a request to the url
    fetch(fetchUrl)
      .then(function (response) {
        // request was successful
        if (response.ok) {
          response.json().then(function (data) {
            // bulma loading icon class
            // $(":button").toggleClass("is-loading");
            console.log(data);

            // create question and answer array in consistent format for a random answer list
            console.log(data.results[0].question);

            // global object to hold question data
            questionData = {
              question: data.results[0].question,
              answer: data.results[0].correct_answer,
              choices: [],
            };

            // temporary array to combine incorrect and correct answers
            var choiceList = [];
            // loop to fill array with incorrect answers
            for (var i = 0; i < data.results[0].incorrect_answers.length; i++) {
              choiceList.push(data.results[0].incorrect_answers[i]);
            }
            // final array push to add correct answer to the end
            choiceList.push(data.results[0].correct_answer);

            //adding all choices to the questionData object array in random order
            while (choiceList.length > 0) {
              // get random number for position in choice array
              var indexNum = Math.floor(Math.random() * choiceList.length);

              // push matching value in choice array into question object
              questionData.choices.push(choiceList[indexNum]);

              // set value that was pushed to null in choice array
              choiceList[indexNum] = null;

              // console.log(indexNum);
              // console.log(choiceList);

              var lessChoiceArray = [];
              lessChoiceArray.length = 0;
              // create a new array but only push values that are not null
              for (var k = 0; k < choiceList.length; k++) {
                if (choiceList[k]) {
                  lessChoiceArray.push(choiceList[k]);
                }
              }

              // clearing old array data
              choiceList.length = 0;

              // adding remaining choices to the choice list
              choiceList = lessChoiceArray;

              // console.log(choiceList);
              // console.log(lessChoiceArray);
            }
            // questionData.choices = choiceList;

            // console.log(questionData);

            displayQuestion(questionData);
          });
        } else {
          // bulma loading icon class
          // $(":button").toggleClass("is-loading");
          alert("Trivia API Error: Unable to retreive a question");
        }
      })
      .catch(function (error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        // bulma loading icon class
        // $(":button").toggleClass("is-loading");
        alert("Trivia API Error: Unable to connect to trivia database");
      });
  }
};

function displayQuestion(triviaData) {
  // console.log(triviaData);

  //creating array with all the html with all choice buttons
  var choiceButtonAppender = [];
  for (var i = 0; i < 4; i++) {
    choiceButtonAppender.push(
      "<button class='button my-5 has-background-primary-dark has-text-white is-size-6 is-fullwidth has-text-weight-bold choiceButton'>" +
        triviaData.choices[i] +
        "</button>"
    );
  }

  //add progress bar upon clicking start
  $("#progressBar").html(
    "<div class='columns'><div class='column is-1'></div><progress class='progress 'value='" +
      gameQuestionCount +
      "' max='" +
      gameQuestionCountLimit +
      "'></progress><div class='column is-1'></div>"
  );

  // combining array without delimiters into one html string
  var choiceButtonEl = choiceButtonAppender.join("");

  // clears and adds in divs for the game area
  $("#gameArea").html(
    "<div class='columns'><div id='questionArea' class='column is-8'></div><div id='choiceButtons' class='column is-4'></div></div>"
  );

  // creates question area elements and slides in from left
  $("#questionArea")
    .html(
      "<article class='message is-primary my-5'><div class='message-header has-background-primary-dark has-text-white'><p id='questionTitle' class='title is-4 has-text-white'>Question " +
        gameQuestionCount +
        "</p></div><div id='questionBody' class='message-body is-size-4 has-text-left'>" +
        triviaData.question +
        "</div></article>"
    )
    .effect("slide", { direction: "left" }, 400, function () {
      $("#choiceButtons")
        .html(choiceButtonEl)
        .effect("slide", { direction: "right" }, 1000);
    });

  $("#gameArea").on("click", ".choiceButton", function () {
    $("#gameArea").off("click", ".choiceButton");
    var chosenAnswer = $(this).text();
    // console.log(chosenAnswer);
    // console.log(questionData.answer);
    if (chosenAnswer === questionData.answer) {
      console.log("Correct");
      score++;
      $(this).removeClass("has-background-primary-dark");
      $(this).addClass("is-success");
      //provide user response
    } else {
      console.log("Incorrect");
      $(this).removeClass("has-background-primary-dark");
      $(this).addClass("is-danger");
      //provide user response
    }

    // add next question button or finish button if last question
    //click event will look for .nextQuestion class and call getQuestion();
    if (gameQuestionCount >= gameQuestionCountLimit) {
      var nextButtonText = "Finish";
    } else {
      var nextButtonText = "Next";
    }

    $("#questionBody").append(
      "<div class='has-text-centered mt-6'><button class='button has-background-primary-dark has-text-white is-large px-6' id='nextQuestion'>" +
        nextButtonText +
        "</button></div>"
    );

    $("#gameArea").on("click", "#nextQuestion", function () {
      $("#gameArea").off("click", "#nextQuestion");
      getQuestion();
    });
  });
}

function giphyFetchImg(searchType) {
  // searchType = category of words seeded at top of script page in giphyKeyword object array
  //replacing the giphy search based on the category requested when function was called

  // for loop first runs through the array looking for matching category provided when function was called
  for (var i = 0; i < giphyKeyword.length; i++) {
    if (searchType === giphyKeyword[i].category) {
      // once category is found, returns a random keyword seeded in the same object for the category
      var randomKeyword =
        giphyKeyword[i].keywords[
          Math.floor(Math.random() * giphyKeyword[i].keywords.length)
        ];
      console.log(randomKeyword);
    }
  }
  var giphyFetchUrl = giphyApiUrl.replace("<searchTerm>", randomKeyword);

  console.log(giphyFetchUrl);

  // add api key to the url
  giphyFetchUrl = giphyFetchUrl.replace("<giphyApiKey>", giphyApiKey);

  // adding a parameter that will obtain an image randomly from zero to the giphy limit (e.g. 0-4999)
  giphyFetchUrl = giphyFetchUrl.replace(
    "<randomNum>",
    Math.floor(Math.random() * giphyRandomRange)
  );
  console.log(giphyFetchUrl);

  // make a request to the url
  fetch(giphyFetchUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data.data[0].images.downsized.url);

          giphyImgUrl = data.data[0].images.downsized.url;
          console.log(giphyImgUrl);

          if (giphyImgUrl && giphyImgUrl != "") {
            console.log(true);
            $("#giphyImgContainer").append(
              "<figure class='image is-max256w mb-4'><img src='" +
                giphyImgUrl +
                "'></figure>"
            );
          }
        });
      } else {
        console.log("Giphy API Error: Unable to retreive a GIF");
        return null;
      }
    })
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      console.log("Giphy API Error: Unable to connect to giphy database");
      return null;
    });
}

function endGame() {
  // Determine high score
  // get local storage high score
  highScoreList = JSON.parse(localStorage.getItem("triviahighscore"));

  //if no high score list, user obtained a new high score
  var newHighScore = false;
  if (highScoreList === null) {
    newHighScore = true;
  } else {
    // else check all scores in array to determine if high score achieved
    console.log(highScoreList.length);
    for (var i = 0; i < highScoreList.length; i++) {
      if (score > highScoreList[i].score) {
        newHighScore = true;
      }
    }
  }

  //if user achieved high score, prompt asking for input of name
  if (newHighScore) {
    // end message
    // update message unique to getting a high score and ask for name input
    var endMessage =
      "A new high score of <strong>" +
      score +
      "</strong> correct answers! Congratulations! Please enter a name to remember you by below and join the ranks amongst the greatest trivia masters of all time!";

    $("#gameArea").html(
      "<article class='message my-5'><div class='message-header has-background-primary-dark'><p class='title is-4 has-text-white'>Game Over!</p></div><div class='message-body is-size-3 has-text-left'>" +
        endMessage +
        "</div class='container'><div id='giphyImgContainer'class='container columns is-centered mx-auto my-0'></div><div class='field mx-6 my-3'><div class='control has-icons-right'><form id='submitForm'><input id='highScoreInput' class='input is-medium is-primary' type='text' placeholder='By what name shall we remember you by?'/><span class='icon is-small is-left'><i class='fa-solid fa-person-pinball'></i></span><div class='control my-4'><input id='nameSubmitBtn' class='button has-background-primary-dark has-text-white is-medium mb-4' type='submit' value='Etch into Stone'></div></div></div></article>"
    );

    // get image and apply only if successful. layout not impacted if unsuccessful.
    giphyFetchImg("New High Score");

    //wait fo ruser to click submit
    $("#gameArea").on("submit", "#submitForm", function (event) {
      event.preventDefault();
      $("#gameArea").off("click", "#nameSubmitBtn");

      var newEntry = {
        name: $("#highScoreInput").val(),
        score: score,
        date: Date.now(),
      };

      $("#highScoreInput").attr("placeholder", newEntry.name);
      $("#highScoreInput").prop("disabled", true);
      $("#nameSubmitBtn").prop("disabled", true);
      console.log(newEntry);
      console.log(newEntry.name);
      console.log(newEntry.score);
      console.log(newEntry.date);

      if (highScoreList === null) {
        highScoreList = [newEntry];
      } else if (highScoreList.length < 10) {
        highScoreList.push(newEntry);
      } else {
        for (var i = 0; i < highScoreList.length; i++) {
          if (score > highScoreList[i].score) {
            console.log(score);
            console.log(highScoreList[i].score);
            highScoreList.splice(i, 0, newEntry);
          }
        }

        // limiting array to 10
        highScoreList.length = 10;
      }

      localStorage.setItem("triviahighscore", JSON.stringify(highScoreList));

      // add after submit
      $(".message").append(
        "<button class='button has-background-primary-dark has-text-white is-large px-6 mb-5 mx-2' id='returnHome'>Return Home</button><button class='button has-background-primary-dark has-text-white is-large px-6 mx-2 mb-5' id='viewHighScore'>View High Scores</button>"
      );

      $("#gameArea").on("click", "#returnHome", function () {
        $("#gameArea").off("click", "#returnHome");
        $("#gameArea").off("click", "#viewHighScore");
        console.log("clicked return home");
        document.location.href = "index.html";
      });
      $("#gameArea").on("click", "#viewHighScore", function () {
        $("#gameArea").off("click", "#viewHighScore");
        $("#gameArea").off("click", "#returnHome");
        console.log("clicked View High Score");
        document.location.href = "high-score.html";
      });
    });
  } else {
    // no new high score messages
    // creates end message based on score %
    if ((score / gameQuestionCountLimit) * 100 >= 85) {
      var endMessage =
        "Great job! You really know your stuff. You answered <strong>" +
        score +
        "</strong> questions correctly!";
      var imgCategory = "Good Score";
    } else if ((score / gameQuestionCountLimit) * 100 >= 70) {
      var endMessage =
        "You answered <strong>" +
        score +
        "</strong> of <strong>" +
        gameQuestionCountLimit +
        "</strong> questions correctly. Not too bad! Give it another try!";
      var imgCategory = "Good Score";
    } else {
      var endMessage =
        "You answered <strong>" +
        score +
        "</strong> of <strong>" +
        gameQuestionCountLimit +
        "</strong> questions correctly. Maybe trivia is not your jam. How about you try again and find out!";
      var imgCategory = "Bad Score";
    }

    // clears game area and provides the user a results
    $("#gameArea").html(
      "<div id='gameArea' class='column has-text-centered is-10'><article class='message is-primary my-5'><div class='message-header has-background-primary-dark has-text white'><p class='title is-4 has-text-white'>Game Over!</p></div><div class='message-body is-size-3 has-text-left'>" +
        endMessage +
        "</div><div id='giphyImgContainer'class='container columns is-centered mx-auto my-0'></div><button class='button has-background-primary-dark has-text-white is-large px-6 mb-5 mx-2' id='returnHome'>Return Home</button><button class='button has-background-primary-dark has-text-white is-large px-6 mx-2 mb-5' id='viewHighScore'>View High Scores</button></article></div>"
    );

    giphyFetchImg(imgCategory);

    $("#gameArea").on("click", "#returnHome", function () {
      $("#gameArea").off("click", "#returnHome");
      $("#gameArea").off("click", "#viewHighScore");
      console.log("clicked return home");
      document.location.href = "index.html";
    });
    $("#gameArea").on("click", "#viewHighScore", function () {
      $("#gameArea").off("click", "#viewHighScore");
      $("#gameArea").off("click", "#returnHome");
      console.log("clicked View High Score");
      document.location.href = "high-score.html";
    });
  }
}
