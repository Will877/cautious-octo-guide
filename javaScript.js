const gridSize = 10;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let grid = [];

/*Generate matrix with random letters*/
for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
        grid[i][j] = {
            letter: characters.charAt(Math.floor(Math.random()*characters.length)),
            partOfWord: false,
            Wnumber: null,
            startOfWord: false,
            endOfWord: false
        }
    }
}

let words = ["HELLO","GOODBYE","ATEST","ANOTHER"];
let wordNumber = 0;
words.forEach((value) => {
    addWord(value,[true,true,true,true,true,true,true,true],wordNumber);
    wordNumber++;
})



/*Adds words to wordsearch*/
function addWord(word,directions,number){
    setupWord();
    function setDirection(){
        let array = [];
        directions.forEach((value,index) => {
            if(value == true){
                array.push(index);
            }
        })
        return array[Math.floor(Math.random()*(array.length))];
    }
    /*Calls function to check if the word will fit in the grid 50 times*/
    function setupWord(){
        let counter = 0;
        while(!checkWord(Math.floor(Math.random()*gridSize),Math.floor(Math.random()*gridSize),setDirection()) && counter < 50){
            counter++;
        }
    }
    /*Checks that the word will fit in the grid*/
    function checkWord(xStart,yStart,direction){
        let c = {x:xStart,y:yStart};
        let workOk = true;
        for(i=0;i<word.length;i++){
            if(c.x >= gridSize || c.x<0 || c.y >= gridSize || c.y<0 || grid[c.y][c.x].partOfWord == true || ((i!=(word.length-1)) && diagonalCross(c.x,c.y,direction))){
                workOk = false;
                break;
            }
            c = controlDirection(c.x,c.y,direction);
        }
        if(workOk){
            makeWord(xStart,yStart,direction);
            return true;
        } else {
            return false;
        }
    }
    function diagonalCross(x,y,direction){
        switch(direction){ 
            default: return false;
            case 1: 
                if(x+1<gridSize && y-1>=0 && grid[y][x+1].partOfWord == true && grid[y-1][x].partOfWord == true && grid[y][x+1].Wnumber == grid[y-1][x].Wnumber){
                    return true;
                } else {
                    return false;
                }
            case 3: 
                if(x-1>=0 && y-1>=0 && grid[y][x-1].partOfWord == true && grid[y-1][x].partOfWord == true && grid[y][x-1].Wnumber == grid[y-1][x].Wnumber){
                    return true;
                } else {
                    return false;
                }    
            case 5: 
                if(x-1>=0 && y+1<gridSize && grid[y][x-1].partOfWord == true && grid[y+1][x].partOfWord == true && grid[y][x-1].Wnumber == grid[y+1][x].Wnumber){
                    return true;
                } else {
                    return false;
                }    
            case 7: 
                if(x+1<gridSize && y+1<gridSize && grid[y][x+1].partOfWord == true && grid[y+1][x].partOfWord == true && grid[y][x+1].Wnumber == grid[y+1][x].Wnumber){
                    return true;
                } else {
                    return false;
                }      
        }
    }
    /*Adds the word to the grid*/
    function makeWord(xStart,yStart,direction){
        let c = {x:xStart,y:yStart};
        grid[c.y][c.x].startOfWord = true
        for(i=0;i<word.length;i++){
            if(i == word.length-1){
                grid[c.y][c.x].endOfWord = true;
            }
            grid[c.y][c.x].letter = word.charAt(i);
            grid[c.y][c.x].partOfWord = true;
            grid[c.y][c.x].Wnumber = number;
            c = controlDirection(c.x,c.y,direction);
        }
    }
    /*Adjusts x and y values according to the direction of the word*/
    function controlDirection(xO,yO,direction){
        switch(direction){
            case 0:
                return {x:++xO,y:yO};
            case 1:
                return {x:++xO,y:--yO};
            case 2:
                return {x:xO,y:--yO};
            case 3:
                return {x:--xO,y:--yO};
            case 4:
                return {x:--xO,y:yO};
            case 5:
                return {x:--xO,y:++yO};
            case 6:
                return {x:xO,y:++yO};
            case 7:
                return {x:++xO,y:++yO};              
        }
    }
}

makeWordSearch(grid,words.length);
function makeWordSearch(grid,numberOfWords){
    const canvas = document.querySelector("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "60px Arial";
    const start = 50;
    let x = start;
    let y = start;
    let drawWord = [];
    for(i=0;i<numberOfWords;i++){
        drawWord.push({
            start: {x:0, y:0},
            end: {x:0, y:0}
        })
    }
    for(j=0;j<grid.length;j++){
        for(i=0;i<grid[j].length;i++){
            if(grid[j][i].startOfWord){
                drawWord[grid[j][i].Wnumber].start = {x,y};
            } else if(grid[j][i].endOfWord){
                drawWord[grid[j][i].Wnumber].end = {x,y};
            }
            x = x+ 60;
        }
        x = start;
        y = y + 60;
    }     
    drawWord.forEach((value) => {
        addColour(value.start.x,value.start.y,value.end.x,value.end.y);
    })
    x = start;
    y = start;
    ctx.fillStyle = "black";
    for(j=0;j<grid.length;j++){
        for(i=0;i<grid[j].length;i++){
            ctx.fillText(grid[j][i].letter,x,y);
            x = x + 60;
        }
        x = start;
        y = y + 60;
    }
    function addColour(xStart,yStart,xEnd,yEnd){
        ctx.beginPath();
        ctx.arc(xStart+20, yStart-20, 30, 0, 2 * Math.PI);
        ctx.arc(xEnd+20, yEnd-20, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "DeepSkyBlue";
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "DeepSkyBlue";
        ctx.moveTo(xStart+20, yStart-20);
        ctx.lineTo(xEnd+20, yEnd-20);
        ctx.lineWidth = 60;
        ctx.stroke();
    }
}






