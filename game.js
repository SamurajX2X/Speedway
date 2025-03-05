class Track {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.radiusX = 380; // Duży tor w poziomie
        this.radiusY = 280; // Mniejszy tor w pionie
        this.innerRadiusX = 280;
        this.innerRadiusY = 180;
        this.startLineX = this.centerX + this.radiusX - 20;
    }

    draw() {
        // Zielone tło (trawa)
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Tor między dwiema elipsami (szary)
        this.ctx.beginPath();
        this.ctx.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
        this.ctx.ellipse(this.centerX, this.centerY, this.innerRadiusX, this.innerRadiusY, 0, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'gray';
        this.ctx.fill('evenodd');

        // Linia startu/mety (czerwona)
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startLineX, this.centerY - 50);
        this.ctx.lineTo(this.startLineX, this.centerY + 50);
        this.ctx.stroke();
    }

    isPointInside(x, y) {
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const insideOuter = (dx / this.radiusX) ** 2 + (dy / this.radiusY) ** 2 <= 1;
        const outsideInner = (dx / this.innerRadiusX) ** 2 + (dy / this.innerRadiusY) ** 2 > 1;
        return insideOuter && outsideInner;
    }

    crossedStartLine(prevX, prevY, x, y) {
        const crossedX = prevX <= this.startLineX && x > this.startLineX;
        const withinY = prevY >= this.centerY - 50 && prevY <= this.centerY + 50;
        return crossedX && withinY;
    }
}

class Motorcycle {
    constructor(x, y, angle, color, turnKey, track) {
        this.x = x;
        this.y = y;
        this.angle = angle; // używamy przekazanego kąta, np. -Math.PI/2
        this.speed = 3; // Stała prędkość w pikselach na klatkę
        this.turnSpeed = 0.05; // Szybkość skrętu w radianach
        this.color = color;
        this.turnKey = turnKey;
        this.turning = false;
        this.trail = []; // Ślad jako lista punktów
        this.lap = 0;
        this.alive = true;
        this.track = track; // Referencja do toru, dzięki której możemy sprawdzać kolizje
    }

    update() {
        if (!this.alive) return;

        // Skręcanie (np. skręt w lewo) – zmiana kąta
        if (this.turning) {
            this.angle += this.turnSpeed;
        }

        // Zachowujemy poprzednią pozycję (przydatne do wykrywania przebicia linii startu)
        const prevX = this.x;
        const prevY = this.y;

        // Aktualizacja pozycji
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        // Aktualizacja śladu – punkty zanikają po 2 sekundach
        const currentTime = Date.now();
        this.trail.push({ x: this.x, y: this.y, time: currentTime });
        const maxAge = 2000; // 2 sekundy
        this.trail = this.trail.filter(point => currentTime - point.time < maxAge);

        // Sprawdzenie, czy motocykl nadal znajduje się na torze
        if (!this.track.isPointInside(this.x, this.y)) {
            this.alive = false;
            this.speed = 0;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        // Rysowanie zanikającego śladu
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const currentTime = Date.now();
        const maxAge = 2000;
        this.trail.forEach((point, index) => {
            const age = currentTime - point.time;
            if (age < maxAge) {
                const opacity = 1 - age / maxAge;
                ctx.globalAlpha = opacity;
                if (index === 0) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
        ctx.globalAlpha = 1; // Resetowanie przeźroczystości

        // Rysowanie motocykla jako mała kropka
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    handleKeyDown(event) {
        if (event.key === this.turnKey) this.turning = true;
    }

    handleKeyUp(event) {
        if (event.key === this.turnKey) this.turning = false;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.track = new Track(this.canvas);
        this.players = [];
        this.totalLaps = 5;
        this.running = false;

        // UI
        this.startScreen = document.getElementById('start-screen');
        this.modeRadios = document.querySelectorAll('input[name="mode"]');
        this.startButton = document.getElementById('start-button');
        this.alertDiv = document.getElementById('alert');
        this.multiplayerOptions = document.getElementById('multiplayer-options');

        this.startButton.addEventListener('click', this.handleStart.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));

        // Ukrywanie/wyświetlanie opcji multiplayer
        this.modeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'multiplayer') {
                    this.multiplayerOptions.style.display = 'block';
                } else {
                    this.multiplayerOptions.style.display = 'none';
                }
            });
        });
    }

    handleStart() {
        const mode = Array.from(this.modeRadios).find(radio => radio.checked).value;
        let numPlayers = 1;
        if (mode === 'multiplayer') {
            numPlayers = parseInt(document.getElementById('num-players').value);
        }
        this.initPlayers(numPlayers);
        this.startScreen.style.display = 'none';
        this.canvas.style.display = 'block';
        this.running = true;
        this.start();
    }

    initPlayers(numPlayers) {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const turnKeys = ['a', 's', 'd', 'f'];
        const yOffsets = [-30, -10, 10, 30];
        this.players = [];
        for (let i = 0; i < numPlayers; i++) {
            const x = this.track.startLineX - 10;
            const y = this.track.centerY + yOffsets[i];
            const angle = -Math.PI / 2; // Motocykl startuje idąc w górę (od strony startowej na prawo), co pozwala na okrążenie toru przeciwnie do ruchu wskazówek zegara
            const color = colors[i];
            const turnKey = turnKeys[i];
            // Przekazujemy referencję do toru, aby ruch i kolizje były zgodne z rysowanym torem
            this.players.push(new Motorcycle(x, y, angle, color, turnKey, this.track));
        }
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
            if (!player.alive) {
                player.speed = 0;
            }
            // Sprawdzanie przebicia linii startu/mety
            if (player.alive && this.track.crossedStartLine(prevX, prevY, player.x, player.y)) {
                player.lap++;
                if (player.lap >= this.totalLaps) {
                    this.endGame(player);
                }
            }
        });

        const alivePlayers = this.players.filter(p => p.alive);
        if (alivePlayers.length === 1 && this.players.length > 1) {
            this.endGame(alivePlayers[0]);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.track.draw();
        this.players.forEach(player => player.draw(this.ctx));

        this.ctx.fillStyle = 'black';
        this.ctx.font = '16px Arial';
        this.players.forEach((player, index) => {
            this.ctx.fillText(`Gracz ${index + 1} (${player.color}): Okrążenie ${player.lap}/${this.totalLaps}`, 10, 20 + index * 20);
        });
    }

    endGame(winner) {
        this.running = false;
        this.alertDiv.textContent = `Zwycięzca: Gracz koloru ${winner.color} ukończył ${winner.lap} okrążeń!`;
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
