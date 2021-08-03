"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);


createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  for (let color of colors) {
    const card = document.createElement('div')
    card.classList.add('card')
    card.dataset.color = color;
    card.addEventListener('click', flipCard);
    gameBoard.append(card);
  }

}


/** Flip a card face-up. */
let gameRound = [];
let successfulPair = 0;

function flipCard(card) {

  if (!this.classList.contains('flipped')) {
    this.style.backgroundColor = this.dataset.color
    gameRound.push(this)
  }
  if (gameRound.length === 2) {
    document.body.addEventListener('click', handleCardClick, true)
    setTimeout(() => { document.body.removeEventListener('click', handleCardClick, true) }, 1000);
    checkPair();
  }
}

function checkPair() {
  if (gameRound[0].dataset.color === gameRound[1].dataset.color) {
    gameRound[0].classList.add("flipped")
    gameRound[1].classList.add("flipped")
    successfulPair += 1;
    if (successfulPair === 5) {
      congrats();
    }
  } else {
    unFlipCard(gameRound[0]);
    unFlipCard(gameRound[1]);
  }
  gameRound = [];
}

/** Flip a card face-down. */

function unFlipCard(card) {
  setTimeout(function () {
    card.style.backgroundColor = 'white';
  }, 1000)
}


/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}


// add in extra feature of restarting the game as well as congrats message on winning.

const button = document.querySelector('.button')
button.addEventListener('click', reset)

function reset() {
  successfulPair = 0;
  const gameBoard = document.getElementById("game");
  if (gameBoard.classList.contains('success')) {
    gameBoard.classList.remove('success')
  }
  gameBoard.innerHTML = '';
  const colors = shuffle(COLORS);
  createCards(colors);
}

function congrats() {
  const gameBoard = document.getElementById("game");
  const h2 = document.createElement('h2');
  h2.innerText = 'Congratulations! Click restart button to play again!!'
  h2.setAttribute('id', 'congrats')
  gameBoard.classList.add('success')
  gameBoard.append(h2)
}