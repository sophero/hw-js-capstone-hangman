// what messages need to be passed?

// a guessed letter gets sent and checked
// either yes or no
// a guessed word, gets sent and checked, eithe ryes or no.
// number of guesses decreases by one with each guess
// game beginning/ending functionality to be encapsulated in Board
// so I guess Board should check the guesses?

// need functionality to be able to create new games.....

var board = new Board();

var phrase1 = new Game("rhythm", ["think music", "feel it"]);
var phrase2 = new Game("borborygmus", ["digestion related", "somewhat onomatopoeic"]);

function Game(phraseStr, hintArray) {
	this.phrase = phraseStr.toUpperCase();
	this.hints = hintArray;



}

function Board() {

	var phraseDisplay = document.getElementsByClassName("phrase-display")[0];
	var guessLetterInput = document.getElementsByClassName("guess-letter")[0];

	guessLetterInput.focus();
}