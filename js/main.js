
// define constance
const boardEl = document.querySelector('#board')
const messageEl = document.querySelector('h2');
const cardEls = [...document.querySelectorAll('#board>div')]
const resetGameBtn = document.querySelector('#resetGame')
const wrongGuessesMsgEl = document.getElementById('wrongGuessesMsg')
const wrongGuessesEl = document.getElementById('wrongGuesses')
const maxWrongGuessesEl = document.getElementById('maxWrongGuesses')
const animals = ['cat', 'dog', 'mouse', 'goat', 'owl', 'elephant', 'eagle', 'rabbit']

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
    //setTomeout show all the images before covered
    const totalAnimals = [...animals, ...animals]
    winner = null
    revealCount = 0
    wrongGuesses = 0
    // console.log('init wrongGuesses', wrongGuesses)
    activeCard = null // set to the first event click in each round to compare with the second click
    activeTimer = true // wait for the countdown to complete before click
    board = [
        0, 0, 0, 0,
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0 
    ]
    // reset text color & board
    messageEl.style.color = 'black'
    wrongGuessesMsgEl.style.color = 'black'
    
    // assigning cards with random animal options in the initial board
    for (i = 0; i < board.length; i++) {
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
    render()
}

// countdown in the beginning
function startCountdown () {
    let count = 5;
    messageEl.innerText = count;
    const timerId = setInterval(() => {
        count--
        if(count > 0) {
            // console.log('interval running', count)
            messageEl.innerText = count
            // disable click during countdown
            // cardEls.forEach((card) => {

            // })
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
    if (wrongGuesses === Number(maxWrongGuessesEl.innerText)) {
    wrongGuessesMsgEl.style.color = 'red'
    messageEl.style.color = 'red'
    messageEl.innerText = 'Game Over'
    return
    }
}


function handleChoice(evt) {
    // return if any timer is active
    if (activeTimer || 
        // or clicked outside of the cards
        evt.target.tagName !== 'DIV' ||
        // or clicked on the same card
        evt.target === activeCard ||
        // when max wrong guesses reached
        wrongGuesses === Number(maxWrongGuessesEl.innerText)
        ) {
        return
    }
    // grab attribute of the card clicked
    const animal = evt.target.getAttribute('data-animal')
    evt.target.style.backgroundImage = `url(/imgs/${animal}.png)`
    evt.target.style.backgroundColor = 'white'
    // set for the first click of each round and return ro proceed with second click
    if (!activeCard) {
        activeCard = evt.target;
        return
    }
    // if the second card match with the first
    if (animal === activeCard.getAttribute('data-animal')) {
        activeTimer = false
        activeCard = null
        revealCount += 2
        // console.log('revealCount', revealCount)

        messageEl.innerText = `You found the ${animal}s!`
        messageEl.style.color = 'green'
        // win if all animals are found
        if (revealCount === (animals.length)*2) {
            messageEl.innerText = `You found all of the animals!`
            return
        }
        return
    }

    // set to true so the player cannot click on more cards before the current cards are covered
    activeTimer = true;
    wrongGuesses += 1
    console.log('wrongGuesses: ', wrongGuesses, ', maxWrongGuessesEl', maxWrongGuessesEl.innerText)

    // setTimeout to reset cards after the second click not matched with the first to end current round
    setTimeout(() => {
        evt.target.style.backgroundImage = null
        evt.target.style.backgroundColor = 'lightgrey'
        activeCard.style.backgroundImage = null
        activeCard.style.backgroundColor = 'lightgrey'
        // after clearing out the revealed cards
        activeTimer = false
        activeCard = null
    }, 1000)

    render()
}
// uncover the first card selected
// uncover the second card selected and check if matched
    // if matched, update text in messageEl and
//show gameover message once wrong guesses reached 3


// eventListeners
//console.log(boardEl)
//card clicked
boardEl.addEventListener('click', handleChoice)

//reset game click
// not working, when clicked all data-animal attributes show undefine
resetGameBtn.addEventListener('click', init)