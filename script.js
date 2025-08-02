const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bgImg = new Image();
bgImg.src = "assets/bg.png";

const packetImg = new Image();
packetImg.src = "assets/data-packet.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

const packet = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

let obstacles = [];
let frame = 0;
let score = 0;

document.addEventListener("keydown", jump);
document.addEventListener("click", jump);

function jump() {
  packet.velocity = packet.lift;
}

function drawPacket() {
  ctx.drawImage(packetImg, packet.x, packet.y, packet.width, packet.height);
}

function drawObstacle(obs) {
  ctx.drawImage(obstacleImg, obs.x, 0, obs.width, obs.top);
  ctx.drawImage(obstacleImg, obs.x, canvas.height - obs.bottom, obs.width, obs.bottom);
}

function updateObstacles() {
  if (frame % 90 === 0) {
    const gap = 140;
    const top = Math.random() * (canvas.height - gap - 100) + 50;
    obstacles.push({
      x: canvas.width,
      width: 60,
      top: top,
      bottom: canvas.height - top - gap
    });
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 2;
    drawObstacle(obstacles[i]);

    if (
      packet.x + packet.width > obstacles[i].x &&
      packet.x < obstacles[i].x + obstacles[i].width &&
      (packet.y < obstacles[i].top || packet.y + packet.height > canvas.height - obstacles[i].bottom)
    ) {
      gameOver();
    }

    if (obstacles[i].x + obstacles[i].width === packet.x) {
      score++;
    }
  }

  obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);
}

function gameOver() {
  alert(`🧠 Game Over!\nYou secured ${score} data blocks onchain with Irys!`);
  obstacles = [];
  packet.y = 150;
  packet.velocity = 0;
  score = 0;
  frame = 0;
}

function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  packet.velocity += packet.gravity;
  packet.y += packet.velocity;

  if (packet.y + packet.height > canvas.height) {
    gameOver();
  }

  drawPacket();
  updateObstacles();

  ctx.fillStyle = "#00ffaa";
  ctx.font = "24px monospace";
  ctx.fillText("Data Blocks: " + score, 20, 40);

  frame++;
  requestAnimationFrame(draw);
}

draw();