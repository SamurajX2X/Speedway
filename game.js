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
    board.canvas.style.display = "none";
    // startScreen.style.display = "block";
    player.reset();
}

function gameLoop() {
    if (!gameRunning) return;

    // Odświeżenie planszy
    board.update();

    // Aktualizacja i rysowanie gracza
    player.update(keys);
    player.draw(board.context);

    // Sprawdzanie kolizji z granicami toru
    if (!board.isInsideTrack(player.x, player.y)) {
        console.log("poza sigmom");

        // endGame();
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