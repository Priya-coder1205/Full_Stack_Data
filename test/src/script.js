document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HOME PAGE
    ========================= */

    const startButton = document.getElementById("startGameBtn");

    if (startButton) {
        startButton.addEventListener("click", () => {
            window.location.href = "./game.html";
        });
    }


    /* =========================
       GAME PAGE
    ========================= */

    const gameBoard = document.getElementById("game-board");

    if (!gameBoard) {
        return;
    }

    const coconutsContainer =
        document.getElementById("coconuts");

    const scoreElement =
        document.getElementById("score");

    const timerElement =
        document.getElementById("timer");

    const livesElement =
        document.getElementById("lives");

    const gameMessage =
        document.getElementById("game-message");

    const gameStatus =
        document.getElementById("game-status");

    const crosshair =
        document.getElementById("crosshair");

    const hitMessage =
        document.getElementById("hit-message");

    const gameOver =
        document.getElementById("game-over");

    const finalScore =
        document.getElementById("final-score");

    const restartBtn =
        document.getElementById("restartBtn");

    const homeBtn =
        document.getElementById("homeBtn");

    const playAgainBtn =
        document.getElementById("playAgainBtn");

    const overHomeBtn =
        document.getElementById("overHomeBtn");


    /* =========================
       GAME VARIABLES
    ========================= */

    let score = 0;
    let lives = 3;
    let timeLeft = 30;

    let gameRunning = false;

    let timerInterval = null;
    let spawnInterval = null;

    let combo = 0;


    /* =========================
       MOUSE CROSSHAIR
    ========================= */

    gameBoard.addEventListener("mousemove", (event) => {

        const rect =
            gameBoard.getBoundingClientRect();

        crosshair.style.left =
            `${event.clientX - rect.left}px`;

        crosshair.style.top =
            `${event.clientY - rect.top}px`;

    });


    /* =========================
       START GAME
    ========================= */

    function startGame() {

        score = 0;
        lives = 3;
        timeLeft = 30;
        combo = 0;

        gameRunning = true;

        scoreElement.textContent = score;
        timerElement.textContent = timeLeft;

        updateLives();

        gameOver.classList.add("hidden");

        gameMessage.classList.remove("hidden");

        gameStatus.textContent =
            "🎯 CLICK THE COCONUTS!";

        setTimeout(() => {

            if (!gameRunning) return;

            gameMessage.classList.add("hidden");

        }, 1200);


        clearInterval(timerInterval);
        clearInterval(spawnInterval);

        timerInterval =
            setInterval(updateTimer, 1000);

        spawnInterval =
            setInterval(createCoconut, 650);

        /* Initial coconuts */
        createCoconut();
        setTimeout(createCoconut, 250);
        setTimeout(createCoconut, 500);
    }


    /* =========================
       TIMER
    ========================= */

    function updateTimer() {

        if (!gameRunning) return;

        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 10) {
            timerElement.classList.add("danger");
        }

        if (timeLeft <= 0) {
            endGame();
        }
    }


    /* =========================
       CREATE COCONUT
    ========================= */

    function createCoconut() {

        if (!gameRunning) return;

        const coconut =
            document.createElement("img");

        coconut.src = "./coconut.png";

        coconut.className = "falling-coconut";

        coconut.draggable = false;

        /*
         * Random position
         */
        const boardWidth =
            gameBoard.clientWidth;

        const size =
            55 + Math.random() * 30;

        const x =
            Math.random() *
            (boardWidth - size);

        coconut.style.width =
            `${size}px`;

        coconut.style.left =
            `${x}px`;

        coconut.style.top =
            `-${size}px`;


        /*
         * Random speed
         */
        const duration =
            2500 + Math.random() * 1800;


        /*
         * Random rotation
         */
        const rotation =
            Math.random() > 0.5
                ? 360
                : -360;


        coconut.animate(
            [
                {
                    transform:
                        "translateY(0) rotate(0deg)"
                },

                {
                    transform:
                        `translateY(${gameBoard.clientHeight + size + 30}px)
                         rotate(${rotation}deg)`
                }
            ],
            {
                duration: duration,
                easing: "linear",
                fill: "forwards"
            }
        );


        /*
         * CLICK COCONUT
         */

        coconut.addEventListener("click", (event) => {

            if (!gameRunning) return;

            event.stopPropagation();

            hitCoconut(coconut, event);

        });


        coconutsContainer.appendChild(coconut);


        /*
         * If coconut reaches bottom
         */

        setTimeout(() => {

            if (!coconut.isConnected) {
                return;
            }

            coconut.remove();

            if (gameRunning) {
                missCoconut();
            }

        }, duration + 100);

    }


    /* =========================
       HIT COCONUT
    ========================= */

    function hitCoconut(coconut, event) {

        coconut.style.pointerEvents = "none";

        coconut.classList.add("coconut-hit");

        combo++;

        const points =
            10 + Math.min(combo * 2, 20);

        score += points;

        scoreElement.textContent = score;

        showHitText(
            event,
            `+${points}`
        );

        createParticles(
            coconut
        );

        setTimeout(() => {
            coconut.remove();
        }, 180);


        /*
         * Gun effect
         */

        gameBoard.classList.add("shooting");

        setTimeout(() => {
            gameBoard.classList.remove("shooting");
        }, 120);


        /*
         * Combo feedback
         */

        if (combo >= 5) {

            gameStatus.textContent =
                `🔥 ${combo} COCONUT COMBO!`;

        } else {

            gameStatus.textContent =
                "💥 NICE SHOT!";
        }

    }


    /* =========================
       MISSED COCONUT
    ========================= */

    function missCoconut() {

        lives--;

        combo = 0;

        updateLives();

        gameStatus.textContent =
            "⚠️ COCONUT MISSED!";

        gameBoard.classList.add("missed");

        setTimeout(() => {
            gameBoard.classList.remove("missed");
        }, 150);


        if (lives <= 0) {
            endGame();
        }

    }


    /* =========================
       LIVES
    ========================= */

    function updateLives() {

        livesElement.textContent =
            "❤️ ".repeat(lives).trim();

        if (lives <= 0) {
            livesElement.textContent = "💀";
        }

    }


    /* =========================
       HIT TEXT
    ========================= */

    function showHitText(event, text) {

        const rect =
            gameBoard.getBoundingClientRect();

        const popup =
            document.createElement("div");

        popup.className =
            "score-popup";

        popup.textContent = text;

        popup.style.left =
            `${event.clientX - rect.left}px`;

        popup.style.top =
            `${event.clientY - rect.top}px`;

        gameBoard.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 700);

    }


    /* =========================
       PARTICLES
    ========================= */

    function createParticles(coconut) {

        const rect =
            coconut.getBoundingClientRect();

        const boardRect =
            gameBoard.getBoundingClientRect();

        for (let i = 0; i < 7; i++) {

            const particle =
                document.createElement("span");

            particle.className =
                "particle";

            particle.textContent =
                Math.random() > 0.5
                    ? "🥥"
                    : "💥";

            particle.style.left =
                `${rect.left - boardRect.left + rect.width / 2}px`;

            particle.style.top =
                `${rect.top - boardRect.top + rect.height / 2}px`;

            const angle =
                Math.random() * Math.PI * 2;

            const distance =
                40 + Math.random() * 70;

            particle.style.setProperty(
                "--x",
                `${Math.cos(angle) * distance}px`
            );

            particle.style.setProperty(
                "--y",
                `${Math.sin(angle) * distance}px`
            );

            gameBoard.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }


    /* =========================
       END GAME
    ========================= */

    function endGame() {

        if (!gameRunning) return;

        gameRunning = false;

        clearInterval(timerInterval);
        clearInterval(spawnInterval);

        gameStatus.textContent =
            "🏆 GAME FINISHED!";

        finalScore.textContent =
            score;

        gameOver.classList.remove("hidden");

    }


    /* =========================
       RESTART
    ========================= */

    function restartGame() {

        clearInterval(timerInterval);
        clearInterval(spawnInterval);

        coconutsContainer.innerHTML = "";

        timerElement.classList.remove("danger");

        startGame();

    }


    /* =========================
       NAVIGATION
    ========================= */

    function goHome() {
        window.location.href = "./index.html";
    }


    restartBtn.addEventListener(
        "click",
        restartGame
    );

    playAgainBtn.addEventListener(
        "click",
        restartGame
    );

    homeBtn.addEventListener(
        "click",
        goHome
    );

    overHomeBtn.addEventListener(
        "click",
        goHome
    );


    /* =========================
       BEGIN
    ========================= */

    startGame();

});