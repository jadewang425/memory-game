
// define constance
const gridEl = document.querySelector('#grid')
const messageEl = document.querySelector('h2');
const cardEls = [...document.querySelectorAll('#grid>div')]
const resetGameBtn = document.querySelector('#resetGame')

const animals = ['cat', 'dog', 'mouse', 'goat', 'owl', 'elephant', 'eagle', 'rabbit']
const totalAnimals = [...animals, ...animals]
// console.log(totalAnimals)

// set variables
let grid
let winner // true or false
let revealCount
let activeCard //lookup for the second card clicked
let awaitingEndOfRound // waiting 

init()
// initialize the game
function init () {
    //setTomeout show all the images before covered
    winner = null
    revealCount = 0
    activeCard = null // set to the first event click in each round to compare with the second click
    awaitingEndOfRound = false // wait the round to end before the next click/new round
    grid = [
        0, 0, 0, 0,
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0 
    ]
    // assigning cards with random animal options in the initial board
    for (i = 0; i < grid.length; i++) {
        const cardEl = cardEls[i]
        // pick a random index in the totalAnimals array to assign to a card
        const randomIdx = Math.floor(Math.random()*totalAnimals.length)
        const animal = totalAnimals[randomIdx]
        cardEl.setAttribute('data-animal', animal)

        //take out the random index once picked
        totalAnimals.splice(randomIdx, 1)
    }
    render()
}

function render() {
    // renderBoard()
    renderMessage()
}

function renderMessage() {

}
function handleChoice(evt) {
    // return if the round is not ended
    if (awaitingEndOfRound) {
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
    // set awaiting end of round to true
    awaitingEndOfRound = true;

    // setTimeout to reset cards after the second click not matched with the first to end current round
    setTimeout(() => {
        evt.target.backgroundImage = null
        evt.target.backgroundColor = 'lightgrey'
        activeCard.backgroundImage = null
        activeCard.backgroundColor = 'lightgrey'
    }, 1000)
    // console.log('activeCard', activeCard)
}
// uncover the first card selected
// uncover the second card selected and check if matched
    // if matched, update text in messageEl and
//show gameover message once wrong guesses reached 3


// eventListeners
//console.log(gridEl)
//card clicked
gridEl.addEventListener('click', handleChoice)

// console.log(totalAnimals)
//reset game click
// not working, when clicked all data-animal attributes show undefine
// resetGameBtn.addEventListener('click', init)