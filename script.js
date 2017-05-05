// what messages need to be passed?

// Make it so that words don't split over multiple lines.
// life counter,
// guess phrase input
// congratulations when you finish,
// show incorrect letters below,
// display hints
// create new game using input string

// extra: make it multiplayer


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

	var phraseDisplayContainer = document.getElementsByClassName("phrase-display__container")[0];
	var phraseDisplay = document.getElementsByClassName("phrase-display")[0];
	var guessInterface = document.getElementsByClassName("guess")[0];
	var guessLetterInput = document.getElementsByClassName("guess-letter__input")[0];
	var beginGameBtn = document.getElementsByClassName("begin-game-btn")[0];
	var congratsMsg = document.getElementsByClassName("congratulations")[0];
	var numSpacesMsg = document.getElementsByClassName("guess__num-spaces-msg")[0];

	guessLetterInput.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			checkLetter(event.target.value);
			event.target.value = "";
		}
	});
	beginGameBtn.addEventListener("click", startRandGame);

	var curPhrase = "";
	var curHints = [];
	var curGameIndex = 0;
	var solvedIndices = [];
	var spaceIndices = [];
	var inGame = false;

	function startRandGame() {
		do {
			var randInt = Math.floor(Math.random() * gamesArray.length);		
		} 
		while (randInt === curGameIndex);
		initializeGame(randInt);
	}

	function initializeGame(gameIndex) {
		curGameIndex = gameIndex;
		solvedIndices = [];
		spaceIndices = [];
		inGame = true;

		var curGame = gamesArray[gameIndex];
		curPhrase = curGame.phrase;
		curHints = curGame.hints;

		congratsMsg.style.display = "none";
		guessInterface.style.display = "block";
		phraseDisplayContainer.style.display = "block";
		countSpaces(curPhrase);
		displayPhrase();

		guessLetterInput.focus();
	}

	function countSpaces(curPhrase) {
		for (var k = 0; k < curPhrase.length; k++) {
			if (curPhrase[k] === " ") {
				spaceIndices.push(k);
			}
		}
		var numWords = 1 + spaceIndices.length;
		var wordsMsg = "Phrase consists of " + numWords;
		if (numWords === 1) {
			wordsMsg += " word.";
		} else {
			wordsMsg += " words.";
		}
		numSpacesMsg.innerHTML = wordsMsg;
	}

	function displayPhrase() {
		phraseDisplay.innerHTML = "";
		for (var k = 0; k < curPhrase.length; k++) {
			var letterDiv = document.createElement("DIV");
			
			if (curPhrase[k] === " ") {
				letterDiv.classList.add("phrase-display__space");
			} else {
				letterDiv.classList.add("phrase-display__letter");
			}

			if (solvedIndices.indexOf(k) > -1) {
				letterDiv.innerHTML = curPhrase[k];
				letterDiv.classList.add("phrase-display__letter--solved");
			}
			phraseDisplay.appendChild(letterDiv);
		}
	}

	function checkLetter(letter) {

		for (var k = 0; k < curPhrase.length; k++) {
			if (letter.toUpperCase() === curPhrase[k]) {
				solvedIndices.push(k);
			}
		}
		displayPhrase();
		checkSolvedIndices();
	}

	function checkSolvedIndices() {
		for (var k = 0; k < curPhrase.length; k++) {
			if (solvedIndices.indexOf(k) < 0 && spaceIndices.indexOf(k) < 0) {
				return;
			}
		}
		solvedGame();
	}

	function solvedGame() {
		inGame = false;
		congratsMsg.style.display = "block";
		guessInterface.style.display = "none";
	}
}