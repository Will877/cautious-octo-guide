let crosswordSize = 20;
let crossword;
const wordsbox = document.querySelector("textarea");
const printButton = document.querySelector('button[name="print"]');
const title = document.querySelector("#title");
printButton.addEventListener("click",makePrint);

start();

function start(){
    let words = ["rabbit", "goose", "hamster", "eagle", "bear", "elephant", "hedgehog","monkey","badger","dear","horse"];
    if(addWords(words)){
        addToCanvas(false);
    } else{
        console.log("Cannot make crossword");
    }
}
function addWords(words){
    for(k=0;k<100;k++){
        if(addWordLoop(words)){
            return true;
        }
        console.log("Changing starting word");
    }
    return false;
    function makeGrid(){
        crossword = [];
        for (i = 0; i < crosswordSize; i++) {
            crossword[i] = [];
            for (j = 0; j < crosswordSize; j++) {
                crossword[i][j] = null;
            }
        }
    }
    function addWordLoop(words){
        let wordsCopy = structuredClone(words);
        makeGrid();
        let firstWord = true;
        for(z=0;z<100;z++) {
            let random = Math.floor(Math.random() * (wordsCopy.length - 1));
            if (setWord((wordsCopy[random]), firstWord)) {
                wordsCopy.splice(random, 1);
                firstWord = false;
            }
            if(wordsCopy.length == 0){
                return true;
            }
        }
        return false;
    }    
}  

let header;
function makePrint(){
    /*header = document.createElement("h2");
    header.innerText = title.value;
    header.innerText = "Test";
    t.insertBefore(header,wordsearch);
    div = document.createElement("div");
    t.appendChild(div);
    div.classList.add("wordsPrint")
    let words = document.createElement("p");
    words.innerText = printWords;
    console.log(printWords);
    div.appendChild(words);*/
    addToCanvas(true);
    window.print();
}

addEventListener("afterprint",() => {
    header.remove();
    addToCanvas(false);
    div.remove();
})







function addToCanvas(print){
    removeNullRows();
    /*Removes rows that do not contain any letters from the start of the crossword*/
    function removeNullRows(){
        let rowNull = true;
        for(i=0;i<crossword.length;i++){
            for(j=0;j<crossword[i].length;j++){
                if(crossword[i][j] != null){
                    rowNull = false;
                }
            }
            if(!rowNull){
                makeCrossword(crossword.toSpliced(0,i));
                break;
            }
        }
    }    
    /*Draws the completed crossword on the canvas*/
    function makeCrossword(grid){
        const canvas = document.querySelector("canvas");
        const canvasSize = canvas.getBoundingClientRect().width;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = canvasSize;
        canvas.width = canvasSize;
        let font = getFont();
        let c = {x:font.startX,y:font.startY};
        let letters = [];
        let counter = 1;
        console.log(grid.length);
        for(j=0;j<grid.length;j++){
            for(i=0;i<crosswordSize;i++){
                if(grid[j][i] == null){
                    letters.push([" ",c.x,c.y]);
                } else{
                    if(grid[j][i].startOfWord == true){
                        /*createClues(grid[j][i].word,grid[j][i].across,counter);*/
                        letters.push([grid[j][i].letter,c.x,c.y,counter]);
                        counter++;
                    } else{
                        letters.push([grid[j][i].letter,c.x,c.y]);
                    }
                }
                c.x += font.gap;
            }
            c.x = font.startX;
            c.y += font.gap;
        }
    
        letters.forEach((value) => {
            if(!print){
                ctx.font = font.letter;
                ctx.fillText(value[0],value[1],value[2]);
            }
            if(value[0]!=" "){
                drawBox(value[1],value[2],font.size);
            }
            if(value[3]){
                drawNumber(value[1],value[2],font.size,value[3]);
            }
        })
        function getFont(){
            let size = canvasSize/crosswordSize;
            let font = Math.floor(size).toString();
            return {letter: font += "px Courier",gap: size,startX: (1/7)*size,startY:(6/7)*size,size:size};
        }
        function drawBox(x,y,size){
            ctx.beginPath();
            ctx.moveTo(x-(3/14)*size, y+(3/14)*size);
            ctx.lineTo(x-(3/14)*size, y-(11/14)*size);
            ctx.lineTo(x+(11/14)*size, y-(11/14)*size);
            ctx.lineTo(x+(11/14)*size, y+(3/14)*size);
            ctx.lineTo(x-(3/14)*size, y+(3/14)*size);
            ctx.stroke();
        }
        function drawNumber(x,y,size,number){
            let numberFont = Math.floor((1/2)*size).toString();
            ctx.font = numberFont += "px Courier";
            ctx.fillText(number,x-(3/14)*size,y-(7/14)*size);
        }
    }
}

/*Returns true and adds the word to the crossword if possible.
Otherwise returns false*/
function setWord(wordString, firstWord) {
    /*Class for letters in the crossword*/
    class crosswordLetter {
        constructor(letter, across, partOfMatch = false, startOfWord = false, word) {
            this.letter = letter;
            this.across = across;
            this.partOfMatch = partOfMatch;
            this.startOfWord = startOfWord;
            this.word = word;
        }
    }
    let wordArray = wordString.split("");
    const directions = [true, false];
    let across = directions[Math.floor(Math.random() * 2)];
    /*Add the first word at the beginning of the crossword*/
    if (firstWord) {
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
                if (outOfRange(c) || startOfWord(c) || letterSpaceTaken(c) || letterBeforeFirstLetter(c,across) || letterAfterLastLetter(c,across) || cannotMatchLetters(c,across)) {
                    return false;
                }
                c = changeValues(c, across);
            }
        return true;
        function startOfWord(c){
            if(c.i == 0 && crossword[c.y][c.x]!=null && crossword[c.y][c.x].startOfWord == true){
                return true;
            } else{
                return false;
            }
        }
        function outOfRange(c){
            if(c.x>=crosswordSize || c.x<0 || c.y>=crosswordSize || c.y<0){
                return true;
            } else{
                return false;
            }
        }
        function letterSpaceTaken(c) {
            if(typeof crossword[c.y] != "undefined" && crossword[c.y][c.x] != null && (crossword[c.y][c.x].letter != wordArray[c.i] || crossword[c.y][c.x].partOfMatch == true)){
                return true;
            }
            else{
                return false;
            }
            /*return (crossword[c.y][c.x] != null && (crossword[c.y][c.x].letter != wordArray[c.i] || crossword[c.y][c.x].partOfMatch == true)) ? true : false;*/
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
            } else if(across == true && typeof crossword[c.y][c.x+1]!="undefined" && crossword[c.y][c.x+1]!=null){
                return true;
            } else if(across == false && typeof crossword[c.y+1]!="undefined" && crossword[c.y+1][c.x]!=null){
                return true;
            } else{
                return false;
            }
        }
        /*Checks that there are no words running in parallel when placing a word in the matrix.*/
        function cannotMatchLetters(c,across){
            if(crossword[c.y][c.x]!=null && crossword[c.y][c.x].letter == wordArray[c.i]){
                return false;
            } else if(across == true && ((typeof crossword[c.y+1]!="undefined" && crossword[c.y+1][c.x]!=null) || (typeof crossword[c.y-1]!="undefined" && crossword[c.y-1][c.x]!=null))){
                return true;
            } else if(across == false && ((typeof crossword[c.y][c.x+1]!="undefined" && crossword[c.y][c.x+1]!=null) || (typeof crossword[c.y][c.x-1]!="undefined" && crossword[c.y][c.x-1]!=null))){
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
            } else{
                crossword[c.y][c.x] = new crosswordLetter(wordArray[c.i], across);
            }
            if(c.i == 0){
                crossword[c.y][c.x].startOfWord = true;
                crossword[c.y][c.x].word = wordString;
            }
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
/*Testing function for logging the crossword to the console.
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
    */
























