// filepath: /speedway-game/src/js/game.js
import Track from './track.js';
import Motorcycle from './motorcycle.js';
import Player from './player.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.track = new Track(this.canvas);
        this.players = [];
        this.totalLaps = 3; // Number of laps to complete
        this.running = false;
        // UI
        this.startScreen = document.getElementById('start-screen');
        this.startButton = document.getElementById('start-button');
        this.alertDiv = document.getElementById('alert');
        this.startButton.addEventListener('click', this.handleStart.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleStart() {
        this.initPlayers();
        this.startScreen.style.display = 'none';
        this.canvas.style.display = 'block';
        this.running = true;
        this.start();
    }

    initPlayers() {
        const color = 'red';
        const turnKey = ' '; // space key
        const x = this.track.startLineX - 10;
        const y = this.track.centerY;
        const angle = -Math.PI / 2; // facing upwards
        this.players.push(new Player(x, y, angle, color, turnKey, this.track));
    }

    handleKeyDown(event) {
        this.players.forEach(player => player.handleKeyDown(event));
    }

    handleKeyUp(event) {
        this.players.forEach(player => player.handleKeyUp(event));
    }

    update() {
        if (!this.running) return;
        this.players.forEach(player => {
            const prevX = player.x;
            const prevY = player.y;
            player.update();
            if (player.alive && this.track.crossedStartLine(player.prevX, player.prevY, player.x, player.y)) {
                player.lap++;
                if (player.lap >= this.totalLaps) {
                    this.endGame(player);
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.track.draw();
        this.players.forEach(player => player.draw(this.ctx));
        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';
        this.players.forEach((player, index) => {
            this.ctx.fillText(`Player ${index + 1} (${player.color}): Lap ${player.lap}/${this.totalLaps}`, 10, 20 + index * 20);
        });
    }

    endGame(winner) {
        this.running = false;
        this.alertDiv.textContent = `Winner: Player with color ${winner.color} completed ${winner.lap} laps!`;
        this.alertDiv.style.display = 'block';
    }

    start() {
        const loop = () => {
            if (this.running) {
                this.update();
                this.draw();
                requestAnimationFrame(loop);
            }
        };
        requestAnimationFrame(loop);
    }
}

const game = new Game();