var questionData; //need global for click event
var score = 0;
var gameQuestionCountLimit = 3;
var gameQuestionCount = 0;
var gameCategoryId = "";
var giphyApiKey = "IqouWAvchaDj6oy5b7niRntKCW50BpKB";
var giphyApiUrl =
  "http://api.giphy.com/v1/gifs/search?q=<searchTerm>&api_key=<giphyApiKey>&limit=1";
var triviaApiUrl =
  "https://opentdb.com/api.php?amount=1&category=<catId>&type=multiple";

var gameCategoryList = [
  {
    id: 12,
    name: "Music",
  },
  {
    id: 23,
    name: "History",
  },
];

//runs event listeners specific to the main page
if ($("body").hasClass("homepage")) {
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
      openModal(); 
    }
  });
}


// Function to open the modal
function openModal() {
    
    // Add is-active class on the modal
    document.getElementById("modal-select-topic").classList.add("is-active");
  }
   
  // Function to close the modal
  function closeModal() {
    document.getElementById("modal-select-topic").classList.remove("is-active");
  }
   
  // Add event listeners to close the modal
  // whenever user click outside modal
  document.querySelectorAll(
   ".modal-background",
   ".modal-close",
   ".modal-card-head",
   ".delete",
   ".modal-card-foot",
   ".button"
  ).forEach(($el) => {
            const $modal = $el.closest(".modal");
            $el.addEventListener("click", () => {
             
            // Remove the is-active class from the modal
            $modal.classList.remove("is-active");
          });
        });
         
        // Adding keyboard event listeners to close the modal
        document.addEventListener("keydown", (event) => {
        const e = event || window.event;
            if (e.keyCode === 27) {
             
             // Using escape key
              closeModal();
            }
         });


//JS logic for the modal
// document.addEventListener('DOMContentLoaded', () => {
//     // Functions to open and close a modal
//     function openModal($el) {
//       $el.classList.add('is-active');
//     }
  
//     function closeModal($el) {
//       $el.classList.remove('is-active');
//     }
  
//     function closeAllModals() {
//       (document.querySelectorAll('.modal') || []).forEach(($modal) => {
//         closeModal($modal);
//       });
//     }
  
//     // Add a click event on buttons to open a specific modal
//     (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
//       const modal = $trigger.dataset.target;
//       const $target = document.getElementById(modal);
  
//       $trigger.addEventListener('click', () => {
//         openModal($target);
//       });
//     });
  
//     // Add a click event on various child elements to close the parent modal
//     (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
//       const $target = $close.closest('.modal');
  
//       $close.addEventListener('click', () => {
//         closeModal($target);
//       });
//     });
  
//     // Add a keyboard event to close all modals
//     document.addEventListener('keydown', (event) => {
//       const e = event || window.event;
  
//       if (e.keyCode === 27) { // Escape key
//         closeAllModals();
//       }
//     });
//   });



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
      "<button class='button my-5 is-primary is-large is-fullwidth has-text-weight-bold choiceButton'>" +
        triviaData.choices[i] +
        "</button>"
    );
  }
  // combining array without delimiters into one html string
  var choiceButtonEl = choiceButtonAppender.join("");

  // clears and adds in divs for the game area
  $("#gameArea").html(
    "<div class='columns'><div id='questionArea' class='column is-8'></div><div id='choiceButtons' class='column is-4'></div></div>"
  );

  // creates question area elements and slides in from left
  $("#questionArea")
    .html(
      "<article class='message is-primary my-5'><div class='message-header'><p id='questionTitle' class='title is-4 has-text-white'>Question " +
        gameQuestionCount +
        "</p></div><div id='questionBody' class='message-body is-size-4 has-text-left'>" +
        triviaData.question +
        "</div></article>"
    )
    .effect("slide", { direction: "left" }, 400, function () {
      $("#choiceButtons")
        .html(choiceButtonEl)
        .effect("slide", { direction: "right" }, 800);
    });

  $("#gameArea").on("click", ".choiceButton", function () {
    $("#gameArea").off("click", ".choiceButton");
    var chosenAnswer = $(this).text();
    console.log(chosenAnswer);
    console.log(questionData.answer);
    if (chosenAnswer == questionData.answer) {
      console.log("Correct");
      score++;
      $(this).removeClass("is-primary");
      $(this).addClass("is-success");
      //provide user response
    } else {
      console.log("Incorrect");
      $(this).removeClass("is-primary");
      $(this).addClass("is-danger");
      //provide user response
    }

    // !!!!! still need to disable the answer buttons to prevent multiple clicks until next button is clicked

    // add next question button or finish button if last question
    //click event will look for .nextQuestion class and call getQuestion();
    if (gameQuestionCount >= gameQuestionCountLimit) {
      var nextButtonText = "Finish";
    } else {
      var nextButtonText = "Next";
    }

    $("#questionBody").append(
      "<div class='has-text-centered mt-6'><button class='button is-primary is-large px-6' id='nextQuestion'>" +
        nextButtonText +
        "</button></div>"
    );

    $("#gameArea").on("click", "#nextQuestion", function () {
      $("#gameArea").off("click", "#nextQuestion");
      getQuestion();
    });
  });
}

function endGame() {}

// getQuestion();
