import { Board } from './board.js';
import { Player } from './player.js';

// Elementy DOM
// const startScreen = document.getElementById("start-screen");
// const startButton = document.getElementById("start-button");

// Zmienne globalne
let board;
let player;
let keys = {};
let gameRunning = false;

function startGame() {
    // startScreen.style.display = "none";
    board = new Board(1200, 800);
    board.initialize();
    player = new Player();
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    console.log("Game Over - Collision!");

    // Optional: Add a delay before reset
    setTimeout(() => {
        player.reset();
        startGame();
    }, 2000);
}

function gameLoop() {
    if (!gameRunning) return;

    // Refresh board
    board.update();

    // Update and draw player with board reference
    player.update(keys, board);
    player.draw(board.context);

    // Check for collision and end game if player collides
    if (player.isColliding) {
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Obsługa wydarzeń
document.addEventListener("DOMContentLoaded", () => {
    startGame();
});

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

// Opcjonalne: włącz przycisk start
// startButton.addEventListener("click", startGame);