/*
 *  Variable
*/

// Timer
let myTimer = 0;
// number of matching pairs
let countSuccess = 0;
// List of open card
let openCards = [];
// counter of move during a game
let moveCounter = 0;
// count time spend to play
let timeAttack = 0;

/*
 *  DOM elements
*/
const counter = document.querySelector(".moves");
const container = document.querySelector(".containerC");
const restart = document.querySelector(".restart");
const displayTimer = document.querySelector(".timer");
let memoryDeck = document.querySelector("#memory-deck");

/*
 * List that holds all of your cards
 */
const deckList = [
	"fa-gem",
	"fa-paper-plane",
	"fa-anchor",
	"fa-bolt",
	"fa-cube",
	"fa-bomb",
	"fa-leaf",
	"fa-bicycle",
	"fa-gem",
	"fa-paper-plane",
	"fa-anchor",
	"fa-bolt",
	"fa-cube",
	"fa-bomb",
	"fa-leaf",
	"fa-bicycle"
];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/*
 *  Create a new shuffled deck and displayed it
*/
const displayCard = () => {
	const shuffledDeck = shuffle(deckList);

	memoryDeck.remove(memoryDeck);

	// create dom element to display the new deck
	const newMemoryDeck = document.createElement("ul");
	newMemoryDeck.className = "deckC";
	newMemoryDeck.id = "memory-deck";

	// loop through each card and create its HTML
	for (let index = 0; index < shuffledDeck.length; index++) {
		const card = document.createElement("li");
		card.className = "card";
		const symbol = document.createElement("i");
		symbol.classList.add("fa", shuffledDeck[index]);
		symbol.id = index;
		card.appendChild(symbol);
		newMemoryDeck.appendChild(card);
	}
	// add each card's HTML to the page
	container.appendChild(newMemoryDeck);

	// reassign the dom variable
	memoryDeck = document.querySelector("#memory-deck");

	// add listener to each card to flip it
	listenerForEachCard();
};

/*
 *  count move during a game & change the score panel
*/
const onMoveCounter = () => {
	++moveCounter;

	counter.textContent = moveCounter;
	let stars = document.querySelector(".full-star");
	switch (moveCounter) {
		case 15:
			stars.firstElementChild.className = "far fa-star";
			stars.className = "empty-star";
			break;
		case 20:
			stars.className = "empty-star";
			stars.firstElementChild.className = "far fa-star";
			break;
		default:
			break;
	}
};

/*
 *  display a card
*/
const showCard = card => {
	card.parentElement.className = "card open show";
};

/*
 *  reset open card list
*/
const resetOpenCards = () => {
	openCards.length = 0;
};

/*
 *  Flip card and test if its matching or not ( also star the timer)
*/
const flipCard = e => {
	const card = e.currentTarget.firstElementChild;
	if (openCards.length === 0) {
		// init timer
		if (moveCounter === 0) {
			let startTimer = new Date();
			timer(startTimer);
		}
		showCard(card);
		openCards.push(card);
	} else if (openCards.length < 2 && openCards[0] !== card) {
		onMoveCounter();
		showCard(card);
		openCards.push(card);
		if (openCards[0].className === openCards[1].className) {
			matchCards(openCards);
			win();
		} else {
			notMatchCards(openCards);
		}
	}
};

/*
 *  Animate matching cards & remove it from the open card list
*/
const matchCards = cards => {
	cards.forEach(card => {
		card.parentElement.className = "rubberBand animated card match";
		card.parentElement.removeEventListener("click", flipCard);
	});
	resetOpenCards();
};

/*
 *  Animate wrong cards & remove it from open card list & flip it
*/
const notMatchCards = cards => {
	cards.forEach(card => {
		card.parentElement.className = "card incorect shake animated";
	});
	const notMatch = [...cards];

	setTimeout(() => {
		notMatch.forEach(card => {
			card.parentElement.className = "card incorect";
		});
		setTimeout(() => {
			notMatch.forEach(card => {
				card.parentElement.className = "card";
				resetOpenCards();
			});
		}, 500);
	}, 500);
};

/*
 *  calculate & display time spend to play
*/
const timer = startTimer => {
	displayTimer.textContent = 0;
	myTimer = setInterval(() => {
		let currentTimer = new Date();
		timeAttack = (currentTimer - startTimer) / 1000;
		displayTimer.textContent = parseInt(timeAttack);
	}, 1000);
};

/*
 *  Open the winning modal with scores informations
*/
const win = () => {
	countSuccess++;
	let starResult = "";
	switch (true) {
		case moveCounter < 15:
			starResult = "three stars";
			break;
		case moveCounter < 20:
			starResult = "two stars";
			break;
		case moveCounter < 30:
			starResult = "one star";
			break;
		default:
			starResult = "0 star";
			break;
	}
	if (countSuccess === 8) {
		let modal = document.querySelector(".modal");
		document.querySelector(
			"#modal-text"
		).innerHTML = `With ${moveCounter} moves in ${parseInt(
			timeAttack
		)} sec!</br> you win with <strong>${starResult}</strong> </br> Wooooooooooooo ! `;
		let modalObject = M.Modal.getInstance(modal);
		modalObject.open();
		clearInterval(myTimer);
	}
};

/*
 *  reset a game
*/
const reset = () => {
	// reset variable
	countSuccess = 0;
	openCards.length = 0;
	moveCounter = 0;
	counter.textContent = 0;
	displayTimer.textContent = 0;

	// reset score panel
	let score = document.querySelector(".stars");
	for (let index = 0; index < 3; index++) {
		if (
			score.children[index].firstElementChild.className !== "fa fa-star"
		) {
			score.children[index].className = "full-star";
			score.children[index].firstElementChild.className = "fa fa-star";
		}
	}

	// create a new suffled deck
	displayCard();
	clearInterval(myTimer);
};

/*
 *  events listeners
*/

// Listener to Flip Cards
const listenerForEachCard = () => {
	for (let index = 0; index < memoryDeck.children.length; index++) {
		memoryDeck.children[index].addEventListener("click", flipCard);
	}
};

// reset the game
restart.addEventListener("click", reset);

// close succes modal
document.querySelector(".modal-close").addEventListener("click", reset);

// init modal & listener to flip card
document.addEventListener("DOMContentLoaded", function() {
	const successModal = document.querySelectorAll(".modal");
	const instances = M.Modal.init(successModal);
	// init listenerForEachCard
	listenerForEachCard();
});
