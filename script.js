// what messages need to be passed?

// a guessed letter gets sent and checked
// either yes or no
// a guessed word, gets sent and checked, eithe ryes or no.
// number of guesses decreases by one with each guess
// game beginning/ending functionality to be encapsulated in Board
// so I guess Board should check the guesses?

// need functionality to be able to create new games..... put this in HangmanController


var phrase1 = new Game("rhythm", ["think music", "feel it"]);
var phrase2 = new Game("borborygmus", ["digestion related", "somewhat onomatopoeic"]);
var phrase3 = new Game("system of a down", ["band from Glendale, CA", "members are all of armenian descent"]);
var gamesArray = [phrase1, phrase2, phrase3]; 

var hangman = new HangmanController(gamesArray);


function Game(phraseStr, hintArray) {
	this.phrase = phraseStr.toUpperCase();
	this.hints = hintArray;

}

function HangmanController(gamesArray) {
	this.startRandGame = startRandGame;

	var gamesArray = gamesArray;

	var phraseDisplay = document.getElementsByClassName("phrase-display")[0];
	var guessLetterInput = document.getElementsByClassName("guess-letter")[0];


	var solvedIndices = [];
	var curPhrase = "";
	var curHints = [];
	var curGameIndex = 0;
	initializeGame(curGameIndex);

	function initializeGame(gameIndex) {
		curGameIndex = gameIndex;

		var curGame = gamesArray[gameIndex];
		curPhrase = curGame.phrase;
		curHints = curGame.hints;

		var solvedIndices = [];
		displayPhrase(curPhrase);

		guessLetterInput.focus();

	}

	function startRandGame() {
		do {
			var randInt = Math.floor(Math.random() * gamesArray.length);		
		} 
		while (randInt === curGameIndex);
		initializeGame(randInt);
	}

	function displayPhrase(phrase) {
		console.log(phrase);
		phraseDisplay.innerHTML = "";

		for (var k = 0; k < phrase.length; k++) {
	
			var letterDiv = document.createElement("DIV");
			
			if (phrase[k] === " ") {
				letterDiv.className = "phrase-display__space";

			} else if (solvedIndices.indexOf(k) > 0) {
				var letter = document.createTextNode(phrase[k]);
				letterDiv.classList.add("phrase-display__letter--solved");
				letterDiv.appendChild(letter);
			} else {
				letterDiv.className = "phrase-display__letter";
			}

			phraseDisplay.appendChild(letterDiv);

		}

	}

}