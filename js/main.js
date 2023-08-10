
// define constance
const boardEl = document.querySelector('#board')
const cardEls = [...document.querySelectorAll('.card')]
const cardFrontEls = [...document.querySelectorAll('.cardFront')]
const cardBackEls = [...document.querySelectorAll('.cardBack')]
const resetGameBtn = document.querySelector('#resetGame')
const messageEl = document.querySelector('h2');
const wrongGuessesMsgEl = document.getElementById('wrongGuessesMsg')
const wrongGuessesEl = document.getElementById('wrongGuesses')
const maxWrongGuessesEl = document.getElementById('maxWrongGuesses')
const animals = ['cat', 'dog', 'mouse', 'goat', 'owl', 'elephant', 'eagle', 'rabbit']
//console.log(boardEl)

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
    // board = [
    //     0, 0, 0, 0,
    //     0, 0, 0, 0, 
    //     0, 0, 0, 0, 
    //     0, 0, 0, 0 
    // ]
    // reset text color & board
    messageEl.classList.remove('wrongGuessesMax')
    wrongGuessesMsgEl.classList.remove('wrongGuessesMax')
    messageEl.classList.remove('foundAll')
    cardEls.forEach(card => card.classList.remove('flipped'))
    
    // assigning cards with random animal options in the initial board
    shuffleCards(totalAnimals)
    // countdown before the cards are hidden
    startCountdown()
    // render message
    render()
}
// shuffle and assign cards
function shuffleCards(arr) {
    for (let i = 0; i < cardEls.length; i++) {
        // pick a random index in the totalAnimals array to assign to a card
        const randomIdx = Math.floor(Math.random()*arr.length)
        const animal = arr[randomIdx]

        cardEls[i].setAttribute('data-animal', animal)
        cardFrontEls[i].style.backgroundImage = `url(./imgs/${animal}.png)`

        //take out the random index once picked
        arr.splice(randomIdx, 1)
    }
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

            e.classList.add('flipped')
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
    const currentCard = evt.target
    const currentCardP = currentCard.parentElement
    if (activeTimer || 
        // or clicked outside of the cards
        currentCard.tagName !== 'DIV' ||
        // or clicked on the same card
        currentCard === activeCard ||
        // when max wrong guesses reached
        wrongGuesses === Number(maxWrongGuessesEl.innerText) ||
        // if win
        winner === true
        ) return

        //const choiceIdx = cardBackEls.findIndex(evt.target.innerHTML)
        console.log('handleChoice, evt parent el: ', currentCardP)
        

    // grab attribute of the current and active card
    const currentCardAtt = currentCardP.getAttribute('data-animal')
    
    console.log(currentCardAtt)
    currentCardP.classList.remove('flipped');

    // if this if the first card click, set as active card then return to proceed with second click
    if (!activeCard) {
        activeCard = currentCard;
        return
    }
    // if the second card doesn't match with the active card
    if (currentCardAtt !== activeCard.parentElement.getAttribute('data-animal')) {
        // set to true so the player cannot click on more cards before the current cards are covered
        activeTimer = true;
        wrongGuesses += 1

        // setTimeout to reset cards after the second click not matched with the first to end current round
        setTimeout(() => {
            currentCardP.classList.add('flipped')
            activeCard.parentElement.classList.add('flipped')
            // after clearing out the revealed cards
            activeTimer = false
            activeCard = null
    }, 1000)
    } else {
        // if the second card match with the first card
        activeTimer = false
        activeCard = null
        revealCount += 2

        messageEl.innerText = `You found the ${currentCardAtt}s!`
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