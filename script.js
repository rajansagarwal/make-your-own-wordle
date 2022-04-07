// importing WORDS as the correct guesses and dictionary as a list of every single word to check from

import { words } from "./guess.js";
import { dictionary } from 'https://file.heyrajan.com/dictionary.js'

let correctWord = words[Math.floor(Math.random() * words.length)]
let currentGuess = [];
let nextLetter = 0;
// you can change how many guesses they have available, or make it dynamic through `correctWord.length` for example 
const guesses = 6;
let remaining = guesses;

// this puts the correct word into the console. once you deploy to production, make sure to remove this!
console.log(correctWord)

// setting up the layout & canvas
function wordle() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < guesses; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < correctWord.length; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

// determining the colour of the keyboard after right or wrong
function keyboard(letter, color) {
    for (const elem of document.getElementsByClassName("key")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

// removing a letter from the input
function deleting () {
    let row = document.getElementsByClassName("letter-row")[6 - remaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter--;
}

// determining whether it matches our correctWord
function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - remaining]
    let guessString = ''
    let rightGuess = Array.from(correctWord)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != correctWord.length) {
        toastr.error("Not enough letters!")
        return
    }

    if (!dictionary.includes(guessString) && !words.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    // creating the layout of boxes
    for (let i = 0; i < correctWord.length; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = '#1a1a1a';
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = '#628b55';
            } else {
                letterColor = '#fcba03';
            }

            rightGuess[letterPosition] = "#"
        }

        setTimeout(()=> {
            box.style.backgroundColor = letterColor
            keyboard(letter, letterColor)
        })
    }

    if (guessString === correctWord) {
        toastr.success("Congratulations — You Win!")
        remaining = 0
        return
    } else {
        remaining--;
        currentGuess = [];
        nextLetter = 0;

        if (remaining === 0) {
            toastr.info(`Incorrect! The right word was: "${correctWord}"`)
        }
    }
}

// adding letters based on what letter is clicked / typed
function insertLetter (clicked) {
    if (nextLetter === correctWord.length) {
        return
    }
    clicked = clicked.toLowerCase()

		// the row that is being typed is determined by the number of guesses remaining
    let row = document.getElementsByClassName("letter-row")[guesses - remaining]
    let box = row.children[nextLetter]
    box.textContent = clicked
    box.classList.add("filled-box")
    currentGuess.push(clicked)
    nextLetter += 1
}

// determining what key is pressed bassed on its layout
document.addEventListener("keyup", (e) => {

    if (remaining === 0) {
        return
    }

    let clicked = String(e.key)
    if (clicked === "Backspace" && nextLetter !== 0) {
        deleting()
        return
    }

    if (clicked === "Enter") {
        checkGuess()
        return
    }
	// allowing any key from a-z or the '-' using regex'
	// if you want to allow numbers, then change it to (/[a-z\-\0-9]/gi)
    let found = clicked.match(/[a-z\-]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(clicked)
    }
})

// pushing everything to the keyboard in index.html
document.getElementById("keyboard").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("key")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

wordle();