// welcome message
// life counter,
// create new game using input string

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
	var curPhrase = "";
	var curHints = [];
	var curHintIndex = 0;
	var curGameIndex = 0;
	var solvedIndices = [];
	var spaceIndices = [];
	var incorrectLetters = [];
	var incorrectPhrases = [];
	
	var phraseDisplayContainer = document.getElementsByClassName("phrase-display__container")[0];
	var phraseDisplay = document.getElementsByClassName("phrase-display")[0];
	var beginGameBtn = document.getElementsByClassName("begin-game-btn")[0];
	var congratsMsg = document.getElementsByClassName("congratulations")[0];
	var numWordsMsg = document.getElementsByClassName("guess__num-words")[0];
	var noPunctuationMsg = document.getElementsByClassName("no-punctuation-msg")[0];
	var guessInterface = document.getElementsByClassName("guess")[0];
	var guessLetterInput = document.getElementsByClassName("guess-letter__input")[0];
	var guessLetterSubmitBtn = document.getElementsByClassName("guess-letter__submit-btn")[0];
	var guessPhraseInput = document.getElementsByClassName("guess-phrase__input")[0];
	var guessPhraseSubmitBtn = document.getElementsByClassName("guess-phrase__submit-btn")[0];
	var incorrectDisplay = document.getElementsByClassName("incorrect")[0];
	var incorrectLettersDisplay = document.getElementsByClassName("incorrect-letters__display")[0];	
	var incorrectPhrasesDisplay = document.getElementsByClassName("incorrect-phrases__display")[0];
	var hintsToggleBtn = document.getElementsByClassName("hints__toggle-btn")[0];
	var hintsCycleBtn = document.getElementsByClassName("hints__cycle-btn")[0];
	var hintsContainer = document.getElementsByClassName("hints")[0];
	var hintsDisplay = document.getElementsByClassName("hints__display")[0];

	beginGameBtn.addEventListener("click", startRandGame);
	guessLetterSubmitBtn.addEventListener("click", function() {
		checkLetter();
		guessLetterInput.value = "";
		guessLetterInput.focus();
	});
	guessLetterInput.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			checkLetter();
			event.target.value = "";
		}
	});
	guessPhraseSubmitBtn.addEventListener("click", function() {
		checkPhrase();
		guessPhraseInput.value = "";
		guessPhraseInput.focus();
	});
	guessPhraseInput.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			checkPhrase();
			event.target.value = "";
		}
	});
	hintsToggleBtn.addEventListener("click", toggleHints);
	hintsCycleBtn.addEventListener("click", cycleHints);


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
		incorrectLetters = [];
		incorrectPhrases = [];

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
		noPunctuationMsg.style.display = "none";
		hintsContainer.style.display = "block";
		guessInterface.style.display = "block";
		phraseDisplayContainer.style.display = "block";
		incorrectDisplay.style.display = "block";

		guessLetterInput.value = "";
		guessPhraseInput.value = "";
		incorrectLettersDisplay.innerHTML = "";
		incorrectPhrasesDisplay.innerHTML = "";
		
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
		if (numWords === 1) {
			numWords += " word";
		} else {
			numWords += " words";
		}
		numWordsMsg.innerHTML = numWords;
	}

	function displayPhrase() {
		phraseDisplay.innerHTML = "";
		var splitPhrase = curPhrase.split(" ");

		for (var j = 0; j < splitPhrase.length; j++) {
			var wordDiv = document.createElement("div");
			wordDiv.classList.add("phrase-display__word");

			for (var k = 0; k < splitPhrase[j].length; k++) {
				var letterDiv = document.createElement("div");				
				letterDiv.classList.add("phrase-display__letter");

				var letterIndex = 0;
				for (var l = 0; l < j; l++) {
					letterIndex += 1 + splitPhrase[l].length;
				}
				letterIndex += k;

				if (solvedIndices.indexOf(letterIndex) > -1) {
					letterDiv.innerHTML = splitPhrase[j][k];
					letterDiv.classList.add("phrase-display__letter--solved");
				}
				wordDiv.appendChild(letterDiv);
			}	
			phraseDisplay.appendChild(wordDiv);
		}
	}

	function checkLetter() {
		var guess = guessLetterInput.value.toUpperCase();

		if (guess.length !== 1 || !/[A-Z]/.test(guess)) {
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

	function checkPhrase() {
		noPunctuationMsg.style.display = "none";
		var guess = guessPhraseInput.value.toUpperCase();

		for (var k = 0; k < guess.length; k++) {
			if (!/[A-Z\s]/.test(guess[k])) {
				noPunctuationMsg.style.display = "block";
				return;
			}
		}			


		if (guess === curPhrase) {
			for (var k = 0; k < curPhrase.length; k++) {
				solvedIndices.push(k);
			}
			displayPhrase();
			solvedGame();

		} else {

			if (incorrectPhrases.indexOf(guess) < 0) {
				incorrectPhrases.push(guess);
			}
			displayIncorrectPhrases();
		}
	}

	function displayIncorrectPhrases() {
		incorrectPhrasesDisplay.innerHTML = "";
		for (var k = 0; k < incorrectPhrases.length; k++) {
			var div = document.createElement("div");
			div.classList.add("incorrect-phrases__phrase");
			div.innerHTML = incorrectPhrases[k];
			incorrectPhrasesDisplay.appendChild(div);
		}
	}

	function solvedGame() {
		congratsMsg.style.display = "block";
		guessInterface.style.display = "none";
		hintsContainer.style.display = "none";
	}

}
