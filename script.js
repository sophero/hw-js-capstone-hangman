
// welcome message
// Make it so that words don't split over multiple lines.
// life counter,
// guess phrase input
// create new game using input string
// add some color, sizing, positioning.

// extra: make it multiplayer
// incorporate external word libraries using some api
// add hangman image sequence


var phrase1 = new Game("rhythm", ["think music", "some people have it"]);
var phrase2 = new Game("borborygmus", ["digestion related", "somewhat onomatopoeic"]);
var phrase3 = new Game("system of a down", ["band from Glendale, CA", "all members are of armenian descent"]);
var phrase4 = new Game("meteorologist");
var gamesArray = [phrase1, phrase2, phrase3, phrase4]; 

var hangman = new HangmanController(gamesArray);


function Game(phraseStr, hintArray) {
	this.phrase = phraseStr.toUpperCase();
	if (hintArray && hintArray.length > 0) {
		this.hints = hintArray;
	} else {
		this.hints = [];
	}
}

function HangmanController(gamesArray) {
	this.startRandGame = startRandGame;

	var gamesArray = gamesArray;

	var phraseDisplayContainer = document.getElementsByClassName("phrase-display__container")[0];
	var phraseDisplay = document.getElementsByClassName("phrase-display")[0];
	var guessInterface = document.getElementsByClassName("guess")[0];
	var guessLetterInput = document.getElementsByClassName("guess-letter__input")[0];
	var guessLetterSubmitBtn = document.getElementsByClassName("guess-letter__submit-btn")[0];
	var beginGameBtn = document.getElementsByClassName("begin-game-btn")[0];
	var congratsMsg = document.getElementsByClassName("congratulations")[0];
	var numSpacesMsg = document.getElementsByClassName("guess__num-spaces-msg")[0];
	var incorrectLettersContainer = document.getElementsByClassName("incorrect-letters__container")[0];
	var incorrectLettersDisplay = document.getElementsByClassName("incorrect-letters__display")[0];
	var hintsToggleBtn = document.getElementsByClassName("hints__toggle-btn")[0];
	var hintsCycleBtn = document.getElementsByClassName("hints__cycle-btn")[0];
	var hintsContainer = document.getElementsByClassName("hints")[0];
	var hintsDisplay = document.getElementsByClassName("hints__display")[0];

	guessLetterSubmitBtn.addEventListener("click", function() {
		checkLetter();
		guessLetterInput.value = "";
	});
	guessLetterInput.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			checkLetter();
			event.target.value = "";
		}
	});
	beginGameBtn.addEventListener("click", startRandGame);
	hintsToggleBtn.addEventListener("click", toggleHints);
	hintsCycleBtn.addEventListener("click", cycleHints);

	var curPhrase = "";
	var curHints = [];
	var curHintIndex = 0;
	var curGameIndex = 0;
	var solvedIndices = [];
	var spaceIndices = [];
	var incorrectLetters = [];
	var inGame = false;
	

	function startRandGame() {
		do {
			var randInt = Math.floor(Math.random() * gamesArray.length);		
		} 
		while (randInt === curGameIndex);
		initializeGame(randInt);
	}

	function initializeGame(gameIndex) {
		incorrectLettersContainer.style.display = "block";
		curGameIndex = gameIndex;
		solvedIndices = [];
		spaceIndices = [];
		incorrectLetters = [];
		inGame = true;

		var curGame = gamesArray[gameIndex];
		curPhrase = curGame.phrase;
		curHints = curGame.hints;
		curHintIndex = 0;

		hideHints();
		if (curHints.length === 0) {
			hintsToggleBtn.innerHTML = "Sorry, no hints available."	
			hintsToggleBtn.classList.add("hints__toggle-btn--inactive");
		} else {
			hintsToggleBtn.innerHTML = "Show hints";	
			hintsToggleBtn.classList.remove("hints__toggle-btn--inactive");
		}
		congratsMsg.style.display = "none";
		hintsContainer.style.display = "block";
		guessInterface.style.display = "block";
		phraseDisplayContainer.style.display = "block";
		incorrectLettersDisplay.innerHTML = "";
		
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

	function checkLetter() {
		var guess = guessLetterInput.value.toUpperCase();

		if (guess.length === 0 || !/[A-Z]/.test(guess)) {
			return;
		}

		var match = false;
		for (var k = 0; k < curPhrase.length; k++) {
			if (guess === curPhrase[k]) {
				solvedIndices.push(k);
				match = true;
			}
		}
		if (!match && incorrectLetters.indexOf(guess) < 0) {
			incorrectLetters.push(guess);
		}
		displayPhrase();
		checkSolvedIndices();
		displayIncorrectLetters();
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
		hintsContainer.style.display = "none";
	}

	function displayIncorrectLetters() {
		incorrectLettersDisplay.innerHTML = "";
		for (var k = 0; k < incorrectLetters.length; k++) {
			var div = document.createElement("div");
			div.classList.add("incorrect-letters__letter");
			div.innerHTML = incorrectLetters[k];
			incorrectLettersDisplay.appendChild(div);
		}
	}

	function toggleHints() {
		if (curHints.length === 0) {
			return;
		}
		if (hintsDisplay.style.display === "block") {
			hideHints();
		} else {
			showHints();	
		}
	}

	function showHints() {
		hintsDisplay.style.display = "block";
		hintsCycleBtn.style.display = "block";
		hintsToggleBtn.innerHTML = "Hide hints";
		hintsDisplay.innerHTML = curHints[curHintIndex];
		guessLetterInput.focus();
	}

	function hideHints() {
		hintsDisplay.style.display = "none";
		hintsCycleBtn.style.display = "none";
		hintsToggleBtn.innerHTML = "Show hints";
		guessLetterInput.focus();
	}

	function cycleHints() {
		curHintIndex += 1;
		if (curHintIndex === curHints.length) {
			curHintIndex = 0;
		}
		hintsDisplay.innerHTML = curHints[curHintIndex];
		guessLetterInput.focus();
	}

}
