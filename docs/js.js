let banany = prompt("Wpisz ile chcesz bananów");
banany = parseInt(banany);
let wynik = 0;
let gameOver = false;
let czas = 0;
let startTime = Date.now();
let keys = {};

class FlyingObject {
  constructor(x, y, text, fontSize) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.fontSize = fontSize || 40;
    this.speed = 8;
    this.width = 0;
    this.height = 0;
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${this.fontSize}px Arial`;
    const metrics = context.measureText(this.text);
    this.width = metrics.width;
    this.height = this.fontSize; 
  }

  move() {
    if (keys['ArrowLeft']) this.x = Math.max(0, this.x - this.speed);
    if (keys['ArrowRight']) this.x = Math.min(canvas.width - this.width, this.x + this.speed);
    if (keys['ArrowUp']) this.y = Math.max(this.height, this.y - this.speed);
    if (keys['ArrowDown']) this.y = Math.min(canvas.height - this.height, this.y + this.speed);
  }

  draw(context) {
    context.font = `${this.fontSize}px Arial`;
    context.fillText(this.text, this.x, this.y);
  }
}

class AutonomousObject {
  constructor(x, y, text, fontSize, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.fontSize = fontSize;
    this.speedX = speedX;
    this.speedY = speedY;
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${this.fontSize}px Arial`;
    const metrics = context.measureText(this.text);
    this.width = metrics.width;
    this.height = this.fontSize;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x + this.width > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y + this.height > canvas.height || this.y < 0) this.speedY *= -1;
  }

  draw(context) {
    context.font = `${this.fontSize}px Arial`;
    context.fillText(this.text, this.x, this.y);
  }

  checkCollision(other) {
    return this.x < other.x + other.width &&
           this.x + this.width > other.x &&
           this.y < other.y + other.height &&
           this.y + this.height > other.y;
  }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const flyingObject = new FlyingObject(200, 200, '🐒', 60);

let autonomousObjects = [];

for (let i = 0; i < banany; i++) {
  const margin = 40;
  const x = Math.random() * (canvas.width - margin * 2) + margin;
  const y = Math.random() * (canvas.height - margin * 2) + margin;

  let speedX = Math.random() * 10 - 3;
  let speedY = Math.random() * 10 - 3;

  if (Math.abs(speedX) < 1) speedX = speedX < 0 ? -1 : 1;
  if (Math.abs(speedY) < 1) speedY = speedY < 0 ? -1 : 1;

  autonomousObjects.push(new AutonomousObject(x, y, '🍌', 40, speedX, speedY));
}

document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  czas = ((Date.now() - startTime) / 1000).toFixed(2);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Koniec gry!`, canvas.width / 2 - 200, canvas.height / 2 - 50);
    ctx.font = "50px Arial";
    ctx.fillText(`Wynik: ${wynik}`, canvas.width / 2 - 100, canvas.height / 2 + 20);
    ctx.fillText(`Czas: ${czas}s`, canvas.width / 2 - 100, canvas.height / 2 + 80);
    return;
  }

  flyingObject.move();
  flyingObject.draw(ctx);

  for (let i = 0; i < autonomousObjects.length; i++) {
    let banana = autonomousObjects[i];
    banana.move();
    banana.draw(ctx);

    if (banana.checkCollision(flyingObject)) {
      wynik += 1;
      autonomousObjects.splice(i, 1);
      i--;
    }
  }

  if (autonomousObjects.length === 0) gameOver = true;

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(0, 0, 300, 125);
  ctx.font = "40px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Wynik: ${wynik}`, 30, 50);
  ctx.fillText(`Czas: ${czas}s`, 30, 100);

  requestAnimationFrame(gameLoop);
}

gameLoop();
