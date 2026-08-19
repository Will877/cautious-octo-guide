let crosswordSize = 30;
let crossword;
let words;

start();

function start(){
    words = ["rabbit", "goose", "hamster", "eagle", "bear", "elephant", "hedgehog","monkey","badger","dear","horse"];
    let counter = 0;
    while(counter<1000){
        if(words.length == 0){
            console.log(words);
            addToCanvas();
            break;
        } else{
            words = ["rabbit", "goose", "hamster", "eagle", "bear", "elephant", "hedgehog","monkey","badger","dear","horse"];
            makeGrid();
        }
    }
    counter++;
}


function makeGrid(){
    crossword = [];
    for (i = 0; i < crosswordSize; i++) {
        crossword[i] = [];
        for (j = 0; j < crosswordSize; j++) {
            crossword[i][j] = null;
        }
    }
    addWords();
}



/*Chooses a random word to add to the crossword and
removes from the array if successfull*/
function addWords(){
    let counter = 0;
    let wordNumber = 0;
    while (counter < 1000 && words.length != 0) {
        let random = Math.floor(Math.random() * (words.length - 1));
        if (setWord((words[random]), wordNumber)) {
            console.log(words[random]);
            logCrossword();
            words.splice(random, 1);
        }
        counter++;
        wordNumber++;
    }
}    

function logCrossword(){
    let crosswordT = structuredClone(crossword);
    for(i=0;i<crosswordT.length;i++){
        for(j=0;j<crosswordT[i].length;j++){
            if(crosswordT[i][j] == null){
                crosswordT[i][j] = " ";
            } else{
                crosswordT[i][j] = crosswordT[i][j].letter;
            }
        }
        console.log(crosswordT[i].join());
    }
}





function addToCanvas(){
    let rowNull = true;
    for(i=0;i<crossword.length;i++){
        for(j=0;j<crossword[i].length;j++){
            if(crossword[i][j] != null){
                rowNull = false;
            }
        }
        if(!rowNull){
            let crossword1 = crossword.toSpliced(0,i);
            console.log(crossword1)
            makeCrossword(crossword1);
            break;
        }
    }
    


    /*Draws the completed grid on the canvas*/
    function makeCrossword(grid){
        const canvas = document.querySelector("canvas");
        const canvasSize = canvas.getBoundingClientRect().width;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = canvasSize;
        canvas.width = canvasSize;
        let font = getFont();
        ctx.font = font.letter;
        const s = {x:font.startX,y:font.startY};
        let c = {x:s.x,y:s.y};
        let drawWord = [];
        let letters = [];
        for(j=0;j<grid.length;j++){
            for(i=0;i<grid[j].length;i++){
                if(grid[j][i] == null){
                    letters.push([" ",c.x,c.y]);
                } else{
                    letters.push([grid[j][i].letter,c.x,c.y]);
                }
                c.x += font.gap;
            }
            c.x = s.x;
            c.y += font.gap;
        }
    
        letters.forEach((value) => {
            ctx.fillText(value[0],value[1],value[2]);
        })
    
        function getFont(){
            let size = canvasSize/30;
            let font = Math.floor(size).toString();
            return {letter: font += "px Courier",gap: size,startX: (1/7)*size,startY:(6/7)*size,size:size};
        }
    }
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
                if (outOfRange(c) || letterSpaceTaken(c) || letterBeforeFirstLetter(c,across) || letterAfterLastLetter(c,across) || cannotMatchLetters(c,across)) {
                    return false;
                }
                c = changeValues(c, across);
            }
        return true;
        function outOfRange(c){
            if(c.x>crossword.size || c.x<0 || c.y>crossword.size || c.y<0){
                return true;
            } else{
                return false;
            }
        }
        function letterSpaceTaken(c,across) {
            return (crossword[c.y][c.x] != null && (crossword[c.y][c.x].letter != wordArray[c.i] || crossword[c.y][c.x].partOfMatch == true)) ? true : false;
        }
        function letterBeforeFirstLetter(c,across){
            if(c.i!=0 || (c.y == 0 && across == false) || (c.x == 0 && across == true)){
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
























