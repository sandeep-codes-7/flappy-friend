let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdImg = new Image();

let birdWidth = 50;
let birdHeight = 50;
let birdX = boardWidth/8;
let birdY = boardHeight/2;

let bird = {
    height: birdHeight,
    width: birdWidth,
    x: birdX,
    y: birdY
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let toppipeimg;
let bottompipeimg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;

let score = 0;
let highScore = 0;

window.onload = () => {

    board = document.getElementById("board");
    context = board.getContext("2d");
    board.width = boardWidth;
    board.height = boardHeight;

    const selected = localStorage.getItem("character");
    const birdImgPath = selected || "./images/chakri.png";

   

    // context.fillStyle = "lightblue";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);
    // // context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    // context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    birdImg.src = birdImgPath;

    toppipeimg = new Image();
    toppipeimg.src = "./images/toppipe.png";

    bottompipeimg = new Image();
    bottompipeimg.src = "./images/bottompipe.png";



    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }


    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 5, 45);
    context.fillText("High Score: " + highScore, 5, 75);

    if(gameOver){
        context.fillStyle = "black";
        context.font = "40px Arial";
        context.fillText("Game Over", board.width/2 - 100, board.height/2);
    }
}

function placePipes(){
    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
    // pipeY = randomPipeY;
    let openspace = board.height/4;

    let toppipe = {
        img: toppipeimg,
        x: pipeX,
        y: randomPipeY,
        height: pipeHeight,
        width: pipeWidth,
        passed: false
    }
    pipeArray.push(toppipe);

    let bottompipe = {
        img: bottompipeimg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openspace,
        height: pipeHeight,
        width: pipeWidth,
        passed: false
    }
    pipeArray.push(bottompipe);

}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        velocityY = -6;
        if(gameOver){
            highScore = Math.max(score, highScore);
            score = 0;
            gameOver = false;
            bird.y = birdY;
            pipeArray = [];
        }
    }
}

function detectCollision(a,b){
    return (a.x < b.x + b.width &&
       a.x + a.width > b.x &&
       a.y < b.y + b.height &&
       a.y + a.height > b.y);
}