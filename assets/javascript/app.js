$(document).ready(function(){
	//Trivia Array of Question Objects.  Questions from http://www.triviaplaying.com/, https://chartcons.com/100-free-trivia-questions-answers/, http://www.thepubquizsite.50webs.com/
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

	var displayResult = function(message){
		var correctAnswer = questionArray[it].rightAnswer;
		body.html(message);
		choices.html("The answer is: " + questionArray[it].answerArray[correctAnswer]);
		it++;
	};

	var displayFailure = function(){
		displayResult("Oh Shoot, that's Incorrect.")
		incorrect++;
		moveToNext();
	};

	var displaySuccess = function(){
		displayResult("Great, you're correct!");
		correct++
		moveToNext();
	};

	var displayTimeOut = function(){
		displayResult("Oh Shoot, Time ran out.")
		skipped++;
		moveToNext();
	}

	var isCorrectAnswer = function(choice){
		var correctAnswer = questionArray[it].rightAnswer;
		if(choice == correctAnswer){
			displaySuccess();
		}
		else{
			displayFailure();
		}
	};

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


	startBtn.click(function(){
		startBtn.hide();
		displayQuestion();
	});

	$("body").on("mouseenter", ".choiceDiv", function(){
		var selection = $(this);
		selection.addClass("hover");
	});

	$("body").on("mouseleave", ".choiceDiv", function(){
		var selection = $(this);
		selection.removeClass("hover");
	});

	$("body").on("click", ".choiceDiv", function(){
		var selection = $(this).attr("id");
		clock.stop();
		isCorrectAnswer(selection);
	});

});