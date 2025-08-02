window.onload = () => {
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
    gravity: 0.5,
    lift: -9,
    velocity: 0
  };

  let obstacles = [];
  let frame = 0;
  let score = 0;
  let isGameOver = false;

  document.addEventListener("keydown", jump);
  document.addEventListener("click", jump);

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

      // Çarpışma kontrolü
      if (
        packet.x + packet.width > obstacles[i].x &&
        packet.x < obstacles[i].x + obstacles[i].width &&
        (packet.y < obstacles[i].top || packet.y + packet.height > canvas.height - obstacles[i].bottom)
      ) {
        isGameOver = true;
        setTimeout(resetGame, 500);
      }

      // Skor artır
      if (obstacles[i].x + obstacles[i].width === packet.x) {
        score++;
      }
    }

    // Görünmeyen engelleri temizle
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
  }

  function resetGame() {
    alert(`🧠 Game Over!\nYou secured ${score} data blocks on Irys!`);
    obstacles = [];
    packet.y = 150;
    packet.velocity = 0;
    score = 0;
    frame = 0;
    isGameOver = false;
    draw(); // yeniden başlat
  }

  function draw() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Paket fiziği
    packet.velocity += packet.gravity;
    packet.y += packet.velocity;

    if (packet.y + packet.height > canvas.height || packet.y < 0) {
      isGameOver = true;
      setTimeout(resetGame, 500);
    }

    drawPacket();
    updateObstacles();

    // Skor göster
    ctx.fillStyle = "#00ffaa";
    ctx.font = "24px monospace";
    ctx.fillText("Data Blocks: " + score, 20, 40);

    if (!isGameOver) {
      frame++;
      requestAnimationFrame(draw);
    }
  }

  draw();
};
