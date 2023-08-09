
// define constance
const boardEl = document.querySelector('#board')
const messageEl = document.querySelector('h2');
const cardEls = [...document.querySelectorAll('#board>div')]
const resetGameBtn = document.querySelector('#resetGame')
const wrongGuessesMsgEl = document.getElementById('wrongGuessesMsg')
const wrongGuessesEl = document.getElementById('wrongGuesses')
const maxWrongGuessesEl = document.getElementById('maxWrongGuesses')
const animals = ['cat', 'dog', 'mouse', 'goat', 'owl', 'elephant', 'eagle', 'rabbit']

// test

// set variables
let board 
let winner // true or false
let revealCount // number os cards revealed to check win
let wrongGuesses // count of the wrong guesses
let activeCard //lookup for the second card clicked
let activeTimer // if any timer is active 

init()
// initialize the game
function init () {
    // 
    const totalAnimals = [...animals, ...animals]
    winner = false
    revealCount = 0
    wrongGuesses = 0
    activeCard = null // set to the first event click in each round to compare with the second click
    activeTimer = true // wait for the countdown to complete before click
    board = [
        0, 0, 0, 0,
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0 
    ]
    // reset text color & board
    messageEl.classList.remove('wrongGuessesMax')
    wrongGuessesMsgEl.classList.remove('wrongGuessesMax')
    
    // assigning cards with random animal options in the initial board
    for (i = 0; i < board.length; i++) {
        // console.log(board)
        const cardEl = cardEls[i]
        // pick a random index in the totalAnimals array to assign to a card
        const randomIdx = Math.floor(Math.random()*totalAnimals.length)
        // new animal array to modify for the game without changing the original array
        const animal = totalAnimals[randomIdx]
        cardEl.setAttribute('data-animal', animal)
        cardEl.style.backgroundImage = `url(/imgs/${animal}.png)`
        cardEl.style.backgroundColor = 'white'
        
        //take out the random index once picked
        totalAnimals.splice(randomIdx, 1)
    }
    // countdown before the cards are hidden
    startCountdown()
    //render()
}

// countdown in the beginning
function startCountdown () {
    let count = 5;
    messageEl.innerText = count;
    const timerId = setInterval(() => {
        count--
        if(count > 0) {
            messageEl.innerText = count
        } else {
            clearInterval(timerId)
            messageEl.innerText = "Let's begin!"
            cardEls.forEach((e) => {
            e.style.backgroundImage = null
            e.style.backgroundColor = 'lightgrey'
            activeTimer = false
            })
        }
    }, 1000)
}

function render() {
//     renderBoard()
    renderMessage()
}

function renderMessage() {
    // update wrong guesses number
    wrongGuessesEl.innerText = `${wrongGuesses}`
    // winning message
    if (winner) {
        messageEl.classList.add('foundAll')
        messageEl.innerText = `You found all of the animals!`
    }
    //if reaches max wrong guesses number, show game over message
    if (wrongGuesses === Number(maxWrongGuessesEl.innerText)) {
    wrongGuessesMsgEl.classList.add('wrongGuessesMax')
    messageEl.classList.add('wrongGuessesMax')
    messageEl.innerText = 'Game Over'
    }
}


function handleChoice(evt) {
    // return if any timer is active
    const animal = evt.target
    console.log(animal)
    if (activeTimer || 
        // or clicked outside of the cards
        animal.tagName !== 'DIV' ||
        // or clicked on the same card
        animal === activeCard ||
        // when max wrong guesses reached
        wrongGuesses === Number(maxWrongGuessesEl.innerText) ||
        // if win
        winner === true
        ) return

    // grab attribute of the card clicked
    const animalAtt = animal.getAttribute('data-animal')
    animal.style.backgroundImage = `url(./imgs/${animalAtt}.png)` // update image url with .
    animal.style.backgroundColor = 'white'
    // if this if the first card click, set as active card then return to proceed with second click
    if (!activeCard) {
        activeCard = animal;
        return
    }
    // if the second card doesn't match with the active card
    
    if (animalAtt !== activeCard.getAttribute('data-animal')) {
        // set to true so the player cannot click on more cards before the current cards are covered
    activeTimer = true;
    wrongGuesses += 1

    // setTimeout to reset cards after the second click not matched with the first to end current round
    setTimeout(() => {
        animal.style.backgroundImage = null
        animal.style.backgroundColor = 'lightgrey'
        activeCard.style.backgroundImage = null
        activeCard.style.backgroundColor = 'lightgrey'
        // after clearing out the revealed cards
        activeTimer = false
        activeCard = null
    }, 1000)
    } else {
        // if the second card match with the first card
        activeTimer = false
        activeCard = null
        revealCount += 2

        messageEl.innerText = `You found the ${animalAtt}s!`
    }
    // win if all animals are found
    if (revealCount === (animals.length)*2) {
        winner = true
    }
    render()
}


// eventListeners
//card clicked
boardEl.addEventListener('click', handleChoice)

//reset game button click
resetGameBtn.addEventListener('click', init)