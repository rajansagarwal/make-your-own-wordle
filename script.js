// hello, i'm just implementing some local storage stuff

import { words } from './guess.js';
import { dictionary } from 'https://file.heyrajan.com/dictionary.js'


let completed = false;
let correctWord = words[Math.floor(Math.random() * words.length)];
let currentGuess = [];
let guessesList = [];
let next = 0;

const guesses = 6;
let remaining = guesses;
let puzzle = guesses - remaining;

const correct = '#628b55'
const wrong = '#1a1a1a'
const wrongLocation = '#fcba03'


function wordle () {
    let board = document.getElementById('game-board');

    for (let i = 0; i < guesses; i++) {
        let row = document.createElement('div');
        row.className = 'letter-row';
        
        for (let j = 0; j < correctWord.length; j++) {
            let box = document.createElement('div');
            box.className = 'letter-box';
            
            row.appendChild(box);
        }
        
        board.appendChild(row);
    }

    if (guessesList.length > 0) {
        
        for (let i = 0; i < guessesList.length; i++) {
            let row = document.getElementsByClassName('letter-row')[i];
            
    
    let guessString = guessesList[i];
    let rightGuess = Array.from(correctWord);
            for (let j = 0; j < guessesList[i].length; j++) {

                let box = row.children[j];
                box.textContent = guessesList[i][j];


        let coloring = '';
        let letter = guessString[j];

        let letterPosition = rightGuess.indexOf(guessString[j]);
        if (letterPosition === -1) {
            coloring = wrong;
        }
        else if (guessString[j] === rightGuess[j]) coloring = correct;
        else coloring = '#fcba03';

        rightGuess[letterPosition] = '#';

        setTimeout(() => {
            box.style.backgroundColor = coloring;
        }, 150 * j + i * 150);
        
            keyboard(letter, coloring); 
            }
            remaining--;
        }
        if (guessesList.includes(correctWord)) {
            completed = true;
            document.getElementById('button-container').classList.add('show');
            document.getElementById('emoji').innerText = correctWord;
            document.getElementById('emoji-image').src = 'https://e.benjaminsmith.dev/' + correctWord;
        }
    }
}

function keyboard (letter, color) {
    for (const element of document.getElementsByClassName('key')) {
        if (element.textContent === letter) {
            let scheme = element.style.backgroundColor;
            if (scheme === 'green') return;

            if (scheme === 'yellow' && color !== 'green') return;

            element.style.backgroundColor = color;
            break;
        }
    }
}

function deleting () {
    let row = document.getElementsByClassName('letter-row')[guesses - remaining];
    let box = row.children[next - 1];
    box.textContent = '';
    currentGuess.pop();
    next--;
}

function insertLetter (clicked) {
    if (completed) return;
    if (next === correctWord.length) return;
    clicked = clicked.toLowerCase();

    let row = document.getElementsByClassName('letter-row')[guesses - remaining];
    let box = row.children[next];
    box.textContent = clicked;
    box.classList.add('filled-box');

    currentGuess.push(clicked);
    next++;
}

document.addEventListener('keyup', e => {
    if (remaining === 0) return;

    let clicked = String(e.key);
    if (clicked === 'Backspace' && next !== 0) return deleting();
    if (clicked === 'Enter') return check();

    let found = clicked.match(/[a-z0-9\-\_]/gi);
    if (!found || found.length > 1) return;

    insertLetter(clicked);

});

document.getElementById('keyboard').addEventListener('click', e => {
    const target = e.target;

    if (!target.classList.contains('key')) return;

    let key = target.textContent;

    if (key === 'Del') key = 'Backspace';

    document.dispatchEvent(new KeyboardEvent('keyup', { key }));
    
});

function check () {
    if (completed) return;
    let row = document.getElementsByClassName('letter-row')[guesses - remaining];
    let guessString = '';
    let rightGuess = Array.from(correctWord);

    for (const value of currentGuess) {
        guessString += value;
    }
    guessesList.push(guessString);
    if (guessString.length !== correctWord.length) return toastr.error('Not enough letters');

 //   if (!dictionary.includes(guessString) && !words.includes(guessString)) return console.log('word is not in list');

    for (let i = 0; i < correctWord.length; i++) {
        let coloring = '';
        let box = row.children [i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(currentGuess[i]);
        if (letterPosition === -1) {
            coloring = wrong;
        }
        else if (currentGuess[i] === rightGuess[i]) coloring = correct;
        else coloring = wrongLocation;

        rightGuess[letterPosition] = '#';

				let delay = 150 * i;
        setTimeout(() => {
						animateCSS(box, 'flipInY')
            box.classList.add('complete');
            box.style.backgroundColor = coloring;
        }, delay);
        
        setTimeout(() => {
            keyboard(letter, coloring);
        }, delay);
    }
        
    setTimeout(() => {
        if (guessString === correctWord) {
            toastr.success('Splendid!');
            completed = true;
            document.getElementById('button-container').classList.add('show');
            document.getElementById('emoji').innerText = correctWord;
            document.getElementById('emoji-image').src = 'https://e.benjaminsmith.dev/' + correctWord;
        } else {
            remaining--;
            currentGuess = [];
            next = 0;
            if (remaining === 0) {
                toastr.error('You lost. The word was ' + correctWord);
            completed = true;
                document.getElementById('button-container').classList.add('show');
                document.getElementById('emoji').innerText = correctWord;
                document.getElementById('emoji-image').src = 'https://e.benjaminsmith.dev/' + correctWord;
            }
        }
    }, correctWord.length * 150);

}

const animateCSS = (element, animation, prefix = 'animate__') =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element
    node.style.setProperty('--animate-duration', '1s');
    node.classList.add(`${prefix}animated`, animationName);
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

wordle();

function generateScore () {
    let output = `haha your mom ${guessesList.length > guesses ? 'X' : guessesList.length}/${guesses}\n`
    output += guessesList.map(g => {
        return `${g.split('').map((char, i) => {
            if (correctWord[i] == char) return '🌲';
            if (correctWord.split('').includes(char)) return '🌤';
            return '☁️';
        }).join('')}`
    }).join('\n');
    output += `\nlinkylinkylinky`;
    return output;
}

function copy () {
    copyTextToClipboard(generateScore());
    
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
      toastr.success('Copied to clipboard!');
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
      toastr.error('Unable to copy text.');
  });
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  }

window.copy = copy;
