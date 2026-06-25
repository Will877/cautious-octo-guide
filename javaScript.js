let grid = [];
main();

/*Sets up the grid and calls functions for adding words and painting the grid on the canvas*/
function main(){
    const gridSize = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = {
                letter: characters.charAt(Math.floor(Math.random()*characters.length)),
                n: null,
                partOfWord: false,
                s: false
            }
        }
    }
    let words = ["HELLO","GOODBYE","ATEST","ANOTHER"];
    let n = 0;
    words.forEach((value) => {
        addWord(value,[true,true,true,true,true,true,true,true],n);
        n++;
    })
    makeWordSearch();
}

/*Adds words to wordsearch*/
function addWord(word,directions,n){
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
        while(!checkWord(Math.floor(Math.random()*grid.length),Math.floor(Math.random()*grid.length),setDirection()) && counter < 50){
            counter++;
        }
    }
    /*Checks that the word will fit in the grid*/
    function checkWord(xStart,yStart,direction){
        let c = {x:xStart,y:yStart};
        let workOk = true;
        for(i=0;i<word.length;i++){
            if(c.x >= grid.length || c.x<0 || c.y >= grid.length || c.y<0 || grid[c.y][c.x].partOfWord == true || ((i!=(word.length-1)) && diagonalCross(c.x,c.y,direction))){
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
    /*Prevents diagonal words from crossing*/
    function diagonalCross(x,y,direction){
        switch(direction){ 
            default: return false;
            case 1: 
                if(x+1<grid.length && y-1>=0 && grid[y][x+1].partOfWord == true && grid[y-1][x].partOfWord == true && grid[y][x+1].n == grid[y-1][x].n){
                    return true;
                } else {
                    return false;
                }
            case 3: 
                if(x-1>=0 && y-1>=0 && grid[y][x-1].partOfWord == true && grid[y-1][x].partOfWord == true && grid[y][x-1].n == grid[y-1][x].n){
                    return true;
                } else {
                    return false;
                }    
            case 5: 
                if(x-1>=0 && y+1<grid.length && grid[y][x-1].partOfWord == true && grid[y+1][x].partOfWord == true && grid[y][x-1].n == grid[y+1][x].n){
                    return true;
                } else {
                    return false;
                }    
            case 7: 
                if(x+1<grid.length && y+1<grid.length && grid[y][x+1].partOfWord == true && grid[y+1][x].partOfWord == true && grid[y][x+1].n == grid[y+1][x].n){
                    return true;
                } else {
                    return false;
                }      
        }
    }
    /*Adds the word to the grid*/
    function makeWord(xStart,yStart,direction){
        let c = {x:xStart,y:yStart};
        grid[c.y][c.x].s = true
        for(i=0;i<word.length;i++){
            if(i == word.length-1){
                grid[c.y][c.x].s = true;
            }
            grid[c.y][c.x].letter = word.charAt(i);
            grid[c.y][c.x].partOfWord = true;
            grid[c.y][c.x].n = n;
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

/*Draws the completed grid on the canvas*/
function makeWordSearch(){
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "60px Arial";
    const start = 50;
    let c = {x:start,y:start};
    let drawWord = [];
    let letters = []
    for(j=0;j<grid.length;j++){
        for(i=0;i<grid[j].length;i++){
            letters.push([grid[j][i].letter,c.x,c.y]);
            if(grid[j][i].s){
                if(!drawWord[grid[j][i].n]){
                    drawWord[grid[j][i].n] = [c.x,c.y];
                } else{
                    drawWord[grid[j][i].n].push(c.x,c.y);
                }
            }
            c.x += 60;
        }
        c.x = start;
        c.y += 60;
    }
    drawWord.forEach((value) => {
        addColour(value[0],value[1],value[2],value[3]);
    })
    letters.forEach((value) => {
        ctx.fillText(value[0],value[1],value[2]);
    })
    function addColour(xStart,yStart,xEnd,yEnd){
        ctx.beginPath();
        ctx.strokeStyle = "DeepSkyBlue";
        ctx.lineCap = "round";
        ctx.moveTo(xStart+20, yStart-20);
        ctx.lineTo(xEnd+20, yEnd-20);
        ctx.lineWidth = 60;
        ctx.stroke();
    }
}






