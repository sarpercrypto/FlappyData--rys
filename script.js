let nickname = "";
let gameStarted = false;
let isGameOver = false;
let packet, obstacles, frame, score, canvas, ctx, bgImg, packetImg, obstacleImg;

function startGame() {
  nickname = document.getElementById("nickname").value.trim();
  if (!nickname) return alert("Please enter a nickname!");

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  init();
  draw();
}

function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  bgImg = new Image();
  bgImg.src = "assets/bg.png";

  packetImg = new Image();
  packetImg.src = "assets/data-packet.png";

  obstacleImg = new Image();
  obstacleImg.src = "assets/obstacle.png";

  packet = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    gravity: 0.4,
    lift: -8.5,
    velocity: 0
  };

  obstacles = [];
  frame = 0;
  score = 0;
  isGameOver = false;

  document.getElementById("overlay").style.display = "none";

  document.addEventListener("keydown", jump);
  document.addEventListener("click", jump);
}

function jump() {
  if (!isGameOver) {
    packet.velocity = packet.lift;
  }
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
    const gap = 220;
    const top = Math.random() * (canvas.height - gap - 100) + 50;
    obstacles.push({
      x: canvas.width,
      width: 60,
      top: top,
      bottom: canvas.height - top - gap
    });
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 1.5;
    drawObstacle(obstacles[i]);

    if (
      packet.x + packet.width > obstacles[i].x &&
      packet.x < obstacles[i].x + obstacles[i].width &&
      (packet.y < obstacles[i].top || packet.y + packet.height > canvas.height - obstacles[i].bottom)
    ) {
      isGameOver = true;
      setTimeout(showGameOver, 500);
    }

    if (
      obstacles[i].x + obstacles[i].width < packet.x &&
      !obstacles[i].counted
    ) {
      score++;
      obstacles[i].counted = true;
    }
  }

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}

function showGameOver() {
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = `
    <div class="game-over-box">
      <h1>💥 GAME OVER 💥</h1>
      <h2>${nickname}, you secured</h2>
      <div class="final-score-big">${score} Data Blocks</div>
      <button onclick="restartGame()">🔁 Restart</button>
      <button onclick="shareOnX()">📤 Share on X</button>
      <p style="margin-top: 10px; font-size: 14px;">Designed by <a href="https://x.com/sarpercrypto" target="_blank" style="color:#00ffaa;">@sarpercrypto</a></p>
    </div>
  `;
  overlay.style.display = "flex";
}

function restartGame() {
  init();
  draw();
}

function shareOnX() {
  const text = encodeURIComponent(nickname + " secured " + score + " data blocks on @irys_xyz!");
  const url = "https://x.com/intent/tweet?text=" + text;
  window.open(url, "_blank");
}

function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  packet.velocity += packet.gravity;
  packet.y += packet.velocity;

  if (packet.y + packet.height > canvas.height || packet.y < 0) {
    isGameOver = true;
    setTimeout(showGameOver, 500);
    return;
  }

  drawPacket();
  updateObstacles();

  ctx.fillStyle = "#00ffaa";
  ctx.font = "24px monospace";
  ctx.fillText("Data Blocks: " + score, 20, 40);

  if (!isGameOver) {
    frame++;
    requestAnimationFrame(draw);
  }
}
