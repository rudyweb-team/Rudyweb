const game = document.querySelector("#game");
const ctx = game.getContext("2d");
const scoreText = document.querySelector("#score");
const resetBtn = document.querySelector("#reset");

const gameWidth = game.width;
const gameHeight = game.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let gameTimer;

let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    clearTimeout(gameTimer);
    running = true;
    scoreText.textContent = score;
    createFood();
    clearBoard();
    drawFood();
    drawSnake();
    nextTick();
}

function nextTick() {
    if (!running) {
        displayGameOver();
        return;
    }

    gameTimer = setTimeout(() => {
        clearBoard();
        moveSnake();

        if (running) {
            drawFood();
            drawSnake();
            checkGameOver();
        }

        nextTick();
    }, 100);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    do {
        foodX = Math.floor(Math.random() * (gameWidth / unitSize)) * unitSize;
        foodY = Math.floor(Math.random() * (gameHeight / unitSize)) * unitSize;
    } while (snake.some(part => part.x === foodX && part.y === foodY));
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;

    snake.forEach(snakePart => {
        ctx.fillRect(
            snakePart.x,
            snakePart.y,
            unitSize,
            unitSize
        );

        ctx.strokeRect(
            snakePart.x,
            snakePart.y,
            unitSize,
            unitSize
        );
    });
}

function changeDirection(event) {
    const keyPressed = event.key;

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    if (
        keyPressed === "ArrowLeft" ||
        keyPressed === "ArrowUp" ||
        keyPressed === "ArrowRight" ||
        keyPressed === "ArrowDown"
    ) {
        event.preventDefault();
    }

    switch (keyPressed) {
        case "ArrowLeft":
            if (!goingRight) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;

        case "ArrowUp":
            if (!goingDown) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;

        case "ArrowRight":
            if (!goingLeft) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;

        case "ArrowDown":
            if (!goingUp) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
    }
}

function checkGameOver() {
    const head = snake[0];

    if (
        head.x < 0 ||
        head.x >= gameWidth ||
        head.y < 0 ||
        head.y >= gameHeight
    ) {
        running = false;
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (
            snake[i].x === head.x &&
            snake[i].y === head.y
        ) {
            running = false;
            return;
        }
    }
}

function displayGameOver() {
    clearTimeout(gameTimer);

    ctx.font = "50px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(
        "GAME OVER!",
        gameWidth / 2,
        gameHeight / 2
    );
}

function resetGame() {
    clearTimeout(gameTimer);

    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];

    gameStart();
}