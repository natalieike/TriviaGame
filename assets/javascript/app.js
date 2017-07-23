$(document).ready(function(){
	//Trivia Array of Question Objects.  Default questions from http://www.triviaplaying.com/, https://chartcons.com/100-free-trivia-questions-answers/, http://www.thepubquizsite.50webs.com/
	var questionArray = [
		{question: "What current branch of the U.S. military was a corps of only 50 soldiers when World War I broke out?",
			rightAnswer: 1,
			answerArray: ["Army","Air Force","Marines","Navy"]},
		{question: "What was a gladiator armed with, in addition to a dagger and spear?",
			rightAnswer: 0,
			answerArray: ["Net","Gun","Slingshot","Shield"]},
		{question: "Who was the last president of the Soviet Union?",
			rightAnswer: 2,
			answerArray: ["Putin","Stalin","Gorbachev","Yeltsin"]},		
		{question: "In which film did Roger Moore first play James Bond?",
			rightAnswer: 1,
			answerArray: ["Dr. No","Live and Let Die","Octopussy","The Spy Who Loved Me"]},			
		{question: "The llama belongs to the family of animals commonly called what?",
			rightAnswer: 3,
			answerArray: ["Cows","Horses","Giraffes","Camels"]},	
		{question: "In Roman mythology, Neptune is the equivalent to which Greek god?",
			rightAnswer: 2,
			answerArray: ["Zeus","Apollo","Poseidon","Hades"]},
		{question: "What is Canada’s national animal?",
			rightAnswer: 2,
			answerArray: ["Moose","Loon","Beaver","Horse"]},
		{question: "Which car name translates as 'people's car'?",
			rightAnswer: 1,
			answerArray: ["Honda","Volkswagen","Chevrolet","Jeep"]},		
		{question: "In which city did gangster Al Capone operate?",
			rightAnswer: 0,
			answerArray: ["Chicago","Los Angeles","New York","Detroit"]},		
		{question: "Which popular spirit can be made from potatoes?",
			rightAnswer: 1,
			answerArray: ["Gin","Vodka","Whiskey","Tequilla"]}];

	//Score Keepers
	var correct = 0;
	var incorrect = 0;
	var skipped = 0;

	//Div Variables
	var heading = $("#heading");
	var timer = $("#timer");
	var body = $("#body");
	var choices = $("#choices");
	var startBtn = $("#startBtn");

	//Variable that will hold the setInterval that runs the clock
	var intervalId;

	//Iterator to pull the next question
	var it = 0;

	//Stopwatch object. Adapted from Class Activity.  Counts down from 00:30
	var clock = {
  	time: 30,
		clockRunning: false,
  	//Reset Function
  	reset: function() {
    	clock.time = 30;
    	timer.text("Time Remaining: 00:30");
  	},
  	//Function to start the clock
  	start: function() {
      if (!clock.clockRunning) {
        clock.clockRunning = true;
        intervalId = setInterval(clock.count, 1000);
      }
	  },
	  //Function to stop the clock
  	stop: function() {
    	clearInterval(intervalId);
    	clock.clockRunning = false;
	  },
	  //Function to count the seconds
  	count: function() {
  		if(clock.time > 0){
		    clock.time--;
  	  	var currentTime = clock.timeConverter(clock.time);
		    timer.html("Time Remaining: " + currentTime);
  		}
  		else{
  			clock.stop();
  			displayTimeOut();
  		}
		},
		//Function to display time in minutes:seconds
  	timeConverter: function(t) {
    	//  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
    	var minutes = Math.floor(t / 60);
    	var seconds = t - (minutes * 60);

    	if (seconds < 10) {
     		seconds = "0" + seconds;
    	}
    	if (minutes === 0) {
      	minutes = "00";
    	}
    	else if (minutes < 10) {
      	minutes = "0" + minutes;
    	}
    	return minutes + ":" + seconds;
  	}
	};

	//Function to initialize gameplay and retrieve questions from API at https://opentdb.com/api_config.php
	// API call https://opentdb.com/api.php?amount=10&type=multiple - for 10 multiple-choice questions
	var initialize = function(){
		it = 0;
		correct = 0;
		incorrect = 0;
		skipped = 0;
		//AJAX call to API
		var queryURL = "https://opentdb.com/api.php?amount=10&type=multiple";
      $.ajax({
      url: queryURL,
      method: "GET"
      }).done(function(response) {
      	console.log("in done funciton");
      	//Parse response into questionArray
      	for(var i=0; i<response.results.length; i++){
      		questionArray[i].question = response.results[i].question;
      		questionArray[i].answerArray = response.results[i].incorrect_answers;
      		var x = Math.round(Math.random()*questionArray[i].answerArray.length);
      		questionArray[i].answerArray.splice(x, 0, response.results[i].correct_answer);
      		questionArray[i].rightAnswer = x;
      	}
      	console.log(questionArray);
      	console.log(response.results);
				displayQuestion();
      });
	}

	//Function to display question
	var displayQuestion = function(){
		heading.html("Question # " + (it+1));
		body.html(questionArray[it].question);
		choices.empty();
		for (i=0; i<questionArray[it].answerArray.length; i++){
			var answerBuilder = $("<div>");
			answerBuilder.addClass("choiceDiv")
			answerBuilder.attr("id", i);
			answerBuilder.html(questionArray[it].answerArray[i]);
			choices.append(answerBuilder);
		}
		clock.reset();
		clock.start();
	};

	//Displays the correct answer and tells the user whether they got the answer right or wrong
	var displayResult = function(message){
		var correctAnswer = questionArray[it].rightAnswer;
		body.html(message);
		choices.html("The answer is: " + questionArray[it].answerArray[correctAnswer]);
		it++;
	};

	//Calls displayResult with the failure message
	var displayFailure = function(){
		displayResult("Oh Shoot, that's Incorrect.")
		incorrect++;
		moveToNext();
	};

	//Calls displayResult with the success message
	var displaySuccess = function(){
		displayResult("Great, you're Correct!");
		correct++
		moveToNext();
	};

	//Calls displayResult with the timeout message
	var displayTimeOut = function(){
		displayResult("Oh Shoot, Time ran out.")
		skipped++;
		moveToNext();
	}

	//Decides if the answer given by the user is correct and calls the proper display function
	var isCorrectAnswer = function(choice){
		var correctAnswer = questionArray[it].rightAnswer;
		if(choice == correctAnswer){
			displaySuccess();
		}
		else{
			displayFailure();
		}
	};

	//Decides whether to show next question or end the game
	var moveToNext = function(){
		setTimeout(function(){
			if(it<questionArray.length){
				displayQuestion();
			}
			else{
				displayEnd();
			}
		}, 10000);
	};

	//Displays end of game messaging
	var displayEnd = function(){
		heading.html("That's the End!");
		timer.empty();
		body.html("Here are your results. To play again, click Start.")
		choices.html("<div>Correct: " + correct + "</div><div>Incorrect: " + incorrect + "</div><div>Skipped: " + skipped +"</div>");
		startBtn.show();
	};

	//Event Handler for Start button - initialize game
	startBtn.click(function(){
		startBtn.hide();
		initialize();
	});

	//Styling of choices for mouse hover - mouse enters
	$("body").on("mouseenter", ".choiceDiv", function(){
		var selection = $(this);
		selection.addClass("hover");
	});

	//Styling of choices for mouse hover - mouse exits
	$("body").on("mouseleave", ".choiceDiv", function(){
		var selection = $(this);
		selection.removeClass("hover");
	});

	//Event Handler for selecting an answer to a question
	$("body").on("click", ".choiceDiv", function(){
		var selection = $(this).attr("id");
		clock.stop();
		isCorrectAnswer(selection);
	});

});