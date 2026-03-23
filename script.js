const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScoreText');

const gridSize = 20;
const tileCount = 20;

let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let newDirection = 'RIGHT';
let food = { x: 15, y: 10 };
let score = 0;
let gameSpeed = 140; 
let loopId; 

const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("gameover.mp3");

let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerText = "High: " + highScore; 

document.addEventListener('keydown', () => {
  eatSound.play().then(() => {
    eatSound.pause();
    eatSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });

function draw() {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#2a2a2a';
  for (let i = 0; i < tileCount; i++) {
    for (let j = 0; j < tileCount; j++) {
      ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#00ffcc' : '#0ed5ecff';
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  ctx.fillStyle = '#ff0000';
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
}

function move() {
  direction = newDirection;

  let head = { ...snake[0] };

  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.innerText = "Score: " + score; 
    eatSound.currentTime = 0;
    eatSound.play();

    if (score % 5 === 0 && gameSpeed > 80) {
      gameSpeed -= 5;
    }

    placeFood();
  } else {
    snake.pop();
  }
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') newDirection = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') newDirection = 'DOWN';
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') newDirection = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') newDirection = 'RIGHT';
}

function checkCollision() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ) return true;

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y)
      return true;
  }

  return false;
}

function placeFood() {
  let valid = false;

  while (!valid) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
  }
}

function resetGame() {
    clearTimeout(loopId); 
    snake = [{ x: 10, y: 10 }];
    direction = 'RIGHT';
    newDirection = 'RIGHT';
    score = 0;
    scoreElement.innerText = "Score: " + score; 
    gameSpeed = 140;
    placeFood();
    gameLoop();
}

function gameLoop() {
  move();

  if (checkCollision()) {
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreElement.innerText = "High: " + highScore; 
    }
    setTimeout(() => {
      alert('Game Over! Score: ' + score);
      resetGame(); 
    }, 100);

    return;
  }

  draw();
  loopId = setTimeout(gameLoop, gameSpeed); 
}

placeFood();
gameLoop();