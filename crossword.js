let crosswordX = 30;
let crosswordY = 30;

let crossword = [];
for (i = 0; i < crosswordY; i++) {
    crossword[i] = [];
    for (j = 0; j < crosswordX; j++) {
        crossword[i][j] = null;
    }
}




let words = ["rabbit", "goose", "hamster", "eagle", "bear", "elephant", "hedgehog"];


/*Chooses a random word to add to the crossword and
removes from the array if successfull*/
let counter = 0;
let wordNumber = 0;
while (counter < 1000 && words.length != 0) {
    let random = Math.floor(Math.random() * (words.length - 1));
    if (setWord((words[random]), wordNumber)) {
        words.splice(random, 1);
    }
    console.log(words);
    counter++;
    wordNumber++;
}



/*Returns true and adds the word to the crossword if possible.
Otherwise returns false*/
function setWord(wordString, number) {
    /*Class for letters in the crossword*/
    class crosswordLetter {
        constructor(letter, across, partOfMatch = false) {
            this.letter = letter;
            this.across = across;
            this.partOfMatch = partOfMatch;
        }
    }
    let wordArray = wordString.split("");
    const directions = [true, false];
    let across = directions[Math.floor(Math.random() * 2)];
    /*Add the first word at the beginning of the crossword*/
    if (number == 0) {
        addWord(10, 10, across, wordArray);
        return true;
    } else {
        let match = findLetterMatch();
        if (match) {
            let start = getStart(...match);
            if (checkWord(...start)) {
                addWord(...start);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    function checkWord(startX, startY, across) { /*letterSpaceTaken or letterBeforeFirstLetter or letterAfterLastLetter or letterAlreadyMatched*/
        let c = { x: startX, y: startY, i: 0 };
            while (c.i < wordArray.length) {
                if (letterSpaceTaken(c) || letterBeforeFirstLetter(c,across) || letterAfterLastLetter(c,across) || cannotMatchLetters(c,across)) {
                    return false;
                }
                c = changeValues(c, across);
            }
        return true;
        function letterSpaceTaken(c,across) {
            return (crossword[c.y][c.x] != null && (crossword[c.y][c.x].letter != wordArray[c.i] || crossword[c.y][c.x].partOfMatch == true)) ? true : false;
        }
        function letterBeforeFirstLetter(c,across){
            if(c.i!=0){
                return false;
            } else if(across == true && crossword[c.y][c.x-1]!=null){
                return true;
            } else if(across == false && crossword[c.y-1][c.x]!=null){
                return true;
            } else{
                return false;
            }
        }
        function letterAfterLastLetter(c,across){
            if(c.i!=wordArray.length-1){
                return false;
            } else if(across == true && crossword[c.y][c.x+1]!=null){
                return true;
            } else if(across == false && crossword[c.y+1][c.x]!=null){
                return true;
            } else{
                return false;
            }
        }
        function cannotMatchLetters(c,across){
            if(crossword[c.y][c.x]!=null && crossword[c.y][c.x].letter == wordArray[c.i]){
                return false;
            } else if(across == true && (crossword[c.y+1][c.x]!=null || crossword[c.y-1][c.x]!=null)){
                return true;
            } else if(across == false && (crossword[c.y][c.x+1]!=null || crossword[c.y][c.x-1]!=null)){
                return true;
            } else{
                return false;
            }
        }
    }
    /*Adds the word to the crossword*/
    function addWord(startX, startY, across) {
        let c = { x: startX, y: startY, i: 0 };
        while (c.i < wordArray.length) {
            if (crossword[c.y][c.x] != null && crossword[c.y][c.x].letter == wordArray[c.i]) {
                crossword[c.y][c.x].partOfMatch = true;
            }
            crossword[c.y][c.x] = new crosswordLetter(wordArray[c.i], across);
            c = changeValues(c, across);
        }
    }
    function changeValues(c, across) {
            return across ? { x: ++c.x, y: c.y, i: ++c.i } : { x: c.x, y: ++c.y, i: ++c.i };
        }
    /*Look for a letter in the current word that matches with a word already in the crossword.
    Returns the coordinates of the match if found. Otherwise returns false*/
    function findLetterMatch() {
        let matches = [];
        wordArray.forEach((letter, index) => {
            for (i = 0; i < crossword.length - 1; i++) {
                for (j = 0; j < crossword[i].length - 1; j++) {
                    if (crossword[i][j] != null && crossword[i][j].letter == letter && crossword[i][j].partOfMatch == false) {
                        matches.push([j, i, !crossword[i][j].across, index]);
                    }
                }
            }
        })
        return (matches.length != 0) ? matches[Math.floor(Math.random() * (matches.length - 1))] : false;
    }
    /*Finds the start point of the word based on the coordinates from the
    findLetterMatch function.*/
    function getStart(x, y, across, index) {
        if (across) {
            return [x - index, y, across];
        } else {
            return [x, y - index, across];
        }
    }
}

for (i = 0; i < crosswordY; i++) {
    for (j = 0; j < crosswordX; j++) {
        if (crossword[i][j] != null) {
            crossword[i][j] = crossword[i][j].letter;
        } else {
            crossword[i][j] = " "
        }
    }
}

crossword.forEach((value) => {
    console.log(value.join());
})

const canvasSize = "300px";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);
canvas.height = canvasSize;
canvas.width = canvasSize;






















