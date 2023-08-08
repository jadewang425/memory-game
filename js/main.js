
// define constance
const boardEl = document.querySelector('#board')
const messageEl = document.querySelector('h2');
const cardEls = [...document.querySelectorAll('#board>div')]
const resetGameBtn = document.querySelector('#resetGame')
const wrongGuessesEl = document.getElementById('wrongGuesses')
// console.log(wrongGuessesEl)
const animals = ['cat', 'dog', 'mouse', 'goat', 'owl', 'elephant', 'eagle', 'rabbit']
const totalAnimals = [...animals, ...animals]
const totalAnimalCount = totalAnimals.length

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
    winner = null
    revealCount = 0
    wrongGuesses = 0
    console.log('init wrongGuesses', wrongGuesses)
    activeCard = null // set to the first event click in each round to compare with the second click
    activeTimer = true // wait for the countdown to complete before click
    board = [
        0, 0, 0, 0,
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0 
    ]
    // assigning cards with random animal options in the initial board
    for (i = 0; i < board.length; i++) {
        const cardEl = cardEls[i]
        // pick a random index in the totalAnimals array to assign to a card
        const randomIdx = Math.floor(Math.random()*totalAnimals.length)
        // new animal array to modify for the game without changing the original array
        const animal = totalAnimals[randomIdx]
        cardEl.setAttribute('data-animal', animal)
        // reset game CSS if reset game button is clicked, is there a way to set it back to default
        cardEl.style.backgroundImage = `url(/imgs/${animal}.png)`
        cardEl.style.backgroundColor = 'white'
        messageEl.style.color = 'black'
        //take out the random index once picked
        totalAnimals.splice(randomIdx, 1)
    }
    // countdown before the cards are hidden
    startCountdown()
    // render()
}

console.log(totalAnimalCount)

// function render() {
//     renderBoard()
//     renderMessage()
// }

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

function renderMessage() {
    // update wrong guesses number
}

function handleChoice(evt) {
    //console.log('handleChoice, evt.target.id: ', evt.target.id)
    // return if the round is not ended
    if (activeTimer || 
        // or clicked outside of the cards
        evt.target.tagName !== 'DIV' ||
        // or clicked on the same card
        evt.target === activeCard
        ) {
        return
    }
    // grab attribute of the card clicked
    const animal = evt.target.getAttribute('data-animal')
    // console.log(animal)
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
        if (revealCount === totalAnimalCount) {
            messageEl.innerText = `You found all of the animals!`
            return
        }
        return
    }

    // set awaiting end of round to true
    activeTimer = true;

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
    // console.log('activeCard', activeCard)
    // render()
}
// uncover the first card selected
// uncover the second card selected and check if matched
    // if matched, update text in messageEl and
//show gameover message once wrong guesses reached 3


// eventListeners
//console.log(boardEl)
//card clicked
boardEl.addEventListener('click', handleChoice)

// console.log(totalAnimals)
//reset game click
// not working, when clicked all data-animal attributes show undefine
resetGameBtn.addEventListener('click', init)