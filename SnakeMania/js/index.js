//Game Constants

let speed=5;
let lastPaintTime=0;
let food={x:10,y:11};
let inputDir={x:0,y:0};
let score=0;
let lastScore=0;
let hiscoreval=0;
let snakeArr=[{x:13,y:15}];
const body=document.getElementById('body');
const cscore=document.getElementById('cscore');
const hscore=document.getElementById('hscore');
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');

//Game functions
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime=ctime;
    gameEngine()
}

// 1) Collide function- if snake collides with itself
function isCollide(sarr){
    for (let i=1;i<sarr.length;i++){
        if(sarr[0].x===sarr[i].x && sarr[0].y===sarr[i].y){
            return true;
        }
    }
}

// 2) checkSnakeForFood function- checks if food new position and snake doesn't coincide
function checkSnakeForFood(sarr){
    for(let i=1;i<sarr.length;i++){
        if(sarr[i].x==food.x && sarr[i].y==food.y){
            return true;
        }
    }
    return false;
}

// 3) Game Engine
function gameEngine(){

    //1) checking if snake collided
    if(isCollide(snakeArr)){
        gameOverSound.play();
        inputDir={x:0,y:0};
        alert("Game Over!!");
        document.location.reload()
        snakeArr=[{x:13,y:15}];
        score=0;
    }

    //2) checking if snake ate food
    if(snakeArr[0].x==food.x && snakeArr[0].y==food.y){
        foodSound.play();
        snakeArr.unshift({x:snakeArr[0].x+inputDir.x,y:snakeArr[0].y+inputDir.y})
        let a=2;
        let b=16;
        while(checkSnakeForFood(snakeArr)){
            food={x: Math.round(a+(b-a)*Math.random()),y: Math.round(a+(b-a)*Math.random())}
        }

        // increment score and display it
        score+=1;
        cscore.innerHTML="Score: "+score;

        // set and display high score
        if(score>hiscoreval){
            hiscoreval=score;
            localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
            hscore.innerHTML="HighScore: "+hiscoreval;
        }

        // increase difficulty
        if((score-lastScore)>5){
            speed+=5;
            lastScore=score;
        }
    }

    //3) moving the snake
    for (let i=snakeArr.length-1;i>0;i--){
        snakeArr[i]={...snakeArr[i-1]} ;
    }
    
    snakeArr[0].x +=inputDir.x;
    snakeArr[0].y +=inputDir.y;

    if (snakeArr[0].x>18){
        snakeArr[0].x=1;
    }
    if(snakeArr[0].x<1){
        snakeArr[0].x=18;
    }
    if (snakeArr[0].y>18){
        snakeArr[0].y=1;
    }
    if(snakeArr[0].y<1){
        snakeArr[0].y=18;
    }

    //4) displaying snake
    board.innerHTML="";
    snakeArr.forEach((e,index)=>{
        snakeElement=document.createElement('div');
        snakeElement.style.gridRowStart=e.y;
        snakeElement.style.gridColumnStart=e.x;
        if (index===0){
            snakeElement.classList.add('head') 
        }
        else{
            snakeElement.classList.add('snake')
        }
        board.appendChild(snakeElement);
    })

    //5) displaying food
    foodElement=document.createElement('div');
    foodElement.style.gridRowStart=food.y;
    foodElement.style.gridColumnStart=food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);
}

//main logic

//1) start game loop
window.requestAnimationFrame(main);

//2) addEventListener to interpret user's input
window.addEventListener('keydown',e=>{
    inputDir={x:0,y:1};
    moveSound.play();
    switch(e.key){
        case 'ArrowUp':
            inputDir.x=0;
            inputDir.y=-1;
            break;
        case 'ArrowDown':
            inputDir.x=0;
            inputDir.y=1;
            break;
        case 'ArrowRight':
            inputDir.x=1;
            inputDir.y=0;
            break;
        case 'ArrowLeft':
            inputDir.x=-1;
            inputDir.y=0;
            break;
        default:
            break;
    }
});

//3) display high score
let hiscore=localStorage.getItem("hiscore");
if(hiscore==null){
    hiscoreval=0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hscore.innerHTML = "HighScore: " + hiscore;
}