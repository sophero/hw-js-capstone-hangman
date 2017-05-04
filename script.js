// what messages need to be passed?

// life counter,
// congratulations when you finish,
// show incorrect letters below,
// display hints
// begin game button
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

	var phraseDisplay = document.getElementsByClassName("phrase-display")[0];
	var guessLetterInput = document.getElementsByClassName("guess-letter")[0];
	var beginGameBtn = document.getElementsByClassName("begin-game-btn")[0];

	guessLetterInput.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			checkLetter(event.target.value);
			event.target.value = "";
		}
	});
	beginGameBtn.addEventListener("click", startRandGame);

	var solvedIndices = [];
	var curPhrase = "";
	var curHints = [];
	var curGameIndex = 0;

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
	}
}