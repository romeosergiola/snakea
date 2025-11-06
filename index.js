const gameBoard = document.querySelector("#gameBoard"); //nehmen Canvas aus HTML datei
const ctx = gameBoard.getContext("2d"); // nehmen Context des Canvas
const scoreText = document.querySelector("#scoreText"); // nehmen den Zähler
const resetBtn = document.querySelector("#resetBtn"); // nehmen Resetbutton
const gameWidth = gameBoard.width; //nehmen die Spielbreite
const gameHeight = gameBoard.height; // nehmen die Spielhöhe
const boardBackground = "white"; // nehmen Hintergrundsfarbe
const snakeColor = "green"; //nehmen schlangefarbe
const snakeBorder = "black"; // nehmen Farbe der Schlangerahmen
const foodColor = "red"; //nehmen Essenfarbe
const unitSize = 25; //nehmen einzelne Zelle des Spielfelds
let running = false;
let xVelocity = unitSize; //jeder Schritt = 25px
let yVelocity = 0; //keine Bewegung hinunten bzw. hinauf
let foodX; //X-Koordinate des Essens
let foodY; //Y-Koordinate des Essens
let score = 0; //Default Score - 0
let snake = [ //die Schlange an sich
    {x:unitSize * 4, y:0}, //jeweils 2 Eigenschaften: X, Y; //Kopf der Schlange
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0} //Tail of snake
]

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();


function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};
function nextTick() { //hauptschleife
    if(running) {
        setTimeout(()=> {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 95);
    }
    else {
        displayGameOver();
    }
};
function clearBoard() { //Macht das Spielfeld leer
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood() { //Wählt zufällig eine neue Position für das Essen.
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize); //X-Koordinate
    foodY = randomFood(0, gameHeight - unitSize); //Y-Koordinate des Essens
    
};
function drawFood() { //Zeichnet das Essen
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){ 
    const head = {x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity}
    
        snake.unshift(head);
        //if food is eaten
        if(snake[0].x == foodX && snake[0].y == foodY) {
            score += 1;
            scoreText.textContent = score;
            createFood();
        }

        else {
            snake.pop();
        }
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    
    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true) {
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};
function checkGameOver() {
    switch(true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i++) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
            break;
        }
    }
};
function displayGameOver() {
    ctx.font = "50px cursive";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};
function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ]
    gameStart();
};
running = false;