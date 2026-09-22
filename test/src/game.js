let score = 0;
let timeLeft = 30;
let lives = 3;

let gameRunning = false;
let gameTimer;
let spawnTimer;

const board = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const livesElement = document.getElementById("lives");
const message = document.getElementById("game-message");
const comboElement = document.getElementById("combo");


// -----------------------------
// START GAME
// -----------------------------

function startGame() {

    if (gameRunning) return;

    gameRunning = true;

    score = 0;
    timeLeft = 30;
    lives = 3;

    updateHUD();

    message.classList.add("hidden");

    // First coconut appears quickly
    spawnCoconut();

    // Keep spawning coconuts
    spawnTimer = setInterval(() => {

        if (gameRunning) {
            spawnCoconut();
        }

    }, 900);


    // Timer
    gameTimer = setInterval(() => {

        timeLeft--;

        updateHUD();

        if (timeLeft <= 0) {
            endGame();
        }

    }, 1000);
}


// -----------------------------
// CREATE COCONUT
// -----------------------------

function spawnCoconut() {

    if (!gameRunning) return;

    const coconut = document.createElement("img");

    coconut.src = "./coconut.png";
    coconut.className = "falling-coconut";

    // Random horizontal position
    const maxLeft = board.clientWidth - 80;

    coconut.style.left =
        Math.max(10, Math.random() * maxLeft) + "px";

    // Start above arena
    coconut.style.top = "-90px";

    board.appendChild(coconut);


    // Random fall duration
    const duration =
        5000 + Math.random() * 2000;

    const startTime = performance.now();


    function fall(currentTime) {

        if (!gameRunning) {
            coconut.remove();
            return;
        }

        const elapsed = currentTime - startTime;

        const progress = elapsed / duration;


        if (progress < 1) {

            const distance =
                board.clientHeight + 100;

            const y = progress * distance;

            const rotation =
                progress * 360;

            coconut.style.transform =
                `translateY(${y}px) rotate(${rotation}deg)`;

            requestAnimationFrame(fall);

        } else {

            // Coconut escaped
            coconut.remove();

            loseLife();
        }
    }


    requestAnimationFrame(fall);


    // IMPORTANT:
    // Single click/tap
    coconut.addEventListener("pointerdown", hitCoconut);
}


// -----------------------------
// HIT COCONUT
// -----------------------------

function hitCoconut(event) {

    if (!gameRunning) return;

    event.preventDefault();
    event.stopPropagation();

    const coconut = event.currentTarget;

    // Prevent same coconut from being hit twice
    if (coconut.dataset.hit === "true") return;

    coconut.dataset.hit = "true";

    // Score
    score += 10;

    updateHUD();

    // Hit animation
    coconut.classList.add("coconut-hit");

    createHitEffect(
        event.clientX,
        event.clientY
    );

    // Remove after animation
    setTimeout(() => {

        coconut.remove();

    }, 180);
}


// -----------------------------
// HIT EFFECT
// -----------------------------

function createHitEffect(x, y) {

    const effect = document.createElement("div");

    effect.className = "hit-pop";

    effect.innerHTML = "+10 💥";

    effect.style.left = x + "px";
    effect.style.top = y + "px";

    document.body.appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 600);
}


// -----------------------------
// LOSE LIFE
// -----------------------------

function loseLife() {

    if (!gameRunning) return;

    lives--;

    updateHUD();

    board.classList.add("damage");

    setTimeout(() => {
        board.classList.remove("damage");
    }, 180);


    if (lives <= 0) {
        endGame();
    }
}


// -----------------------------
// HUD
// -----------------------------

function updateHUD() {

    scoreElement.textContent = score;

    timerElement.textContent = timeLeft;

    livesElement.textContent =
        "❤️ ".repeat(lives) +
        "🖤 ".repeat(3 - lives);
}


// -----------------------------
// GAME OVER
// -----------------------------

function endGame() {

    gameRunning = false;

    clearInterval(gameTimer);
    clearInterval(spawnTimer);

    document
        .querySelectorAll(".falling-coconut")
        .forEach(coconut => coconut.remove());


    message.innerHTML = `
        <span>GAME OVER!</span>
        <small>Final Score: ${score}</small>
        <button onclick="restartGame()" class="play-again-btn">
            🎯 PLAY AGAIN
        </button>
    `;

    message.classList.remove("hidden");
}


// -----------------------------
// RESTART
// -----------------------------

function restartGame() {

    clearInterval(gameTimer);
    clearInterval(spawnTimer);

    document
        .querySelectorAll(".falling-coconut")
        .forEach(coconut => coconut.remove());

    message.innerHTML = `
        <span>GET READY!</span>
        <small>Click the coconuts before they escape!</small>
    `;

    message.classList.remove("hidden");

    setTimeout(() => {
        startGame();
    }, 800);
}


// -----------------------------
// HOME
// -----------------------------

function goHome() {

    window.location.href = "index.html";
}


// -----------------------------
// START
// -----------------------------

startGame();