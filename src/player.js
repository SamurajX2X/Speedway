// wszystko co dotyczy gracza
import { playerConfig, trackConfig, formConfig, playerColors } from './config.js';

export class Player {
    constructor(playerId) {
        // podstawowe dane gracza
        this.playerId = playerId;
        this.color = playerColors[`player${playerId}`];
        this.isAlive = true;
        this.hasWon = false;

        // gdzie startuje gracz
        const position = playerConfig.startPositions[`player${this.playerId}`];
        this.x = position.x;
        this.y = position.y;

        // jak sie porusza
        this.angle = 0;
        this.speed = playerConfig.speed;
        this.turnSpeed = playerConfig.turnSpeed;

        // zostawiany slad
        this.trail = [];
        this.maxTrailLength = playerConfig.trailMaxLength;
        this.trailFadeSteps = playerConfig.trailFadeSteps;

        // wyglad skibdii motocykla
        this.isColliding = false;
        this.radius = playerConfig.radius;
        this.motoImage = new Image();
        this.motoImage.src = 'public/gfx/motorcycle.png';
        this.imageWidth = playerConfig.imageWidth;
        this.imageHeight = playerConfig.imageHeight;

        // okrazenia
        this.lapsCompleted = 0;
        this.crossedFinishLine = false;
        this.finishLineY = trackConfig.finishLine.y;
        this.finishLineX = trackConfig.finishLine.x;
        this.controls = formConfig.playerControls[`player${this.playerId}`];
    }

    // rysowanie wszystkiego
    draw(ctx) {
        // rysowanie sladu
        for (let i = 0; i < this.trail.length - 1; i++) {
            const opacity = (i / this.trail.length);
            ctx.beginPath();
            ctx.moveTo(this.trail[i].x, this.trail[i].y);
            ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);

            // jak sie zderzyl to pomaranczowy slad
            if (this.isColliding) {
                ctx.strokeStyle = `rgba(255, 165, 0, ${opacity})`;
            } else {
                // normalny kolor sladu
                const colorBase = this.color.trail.split('(')[1].split(')')[0].split(',');
                ctx.strokeStyle = `rgba(${colorBase[0]}, ${colorBase[1]}, ${colorBase[2]}, ${opacity})`;
            }

            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // rysowanie motocykla
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle - Math.PI / 2 + Math.PI);

        // jak obrazek sie zaladowal to go rysujemy
        if (this.motoImage.complete) {
            ctx.drawImage(
                this.motoImage,
                -this.imageWidth / 2,
                -this.imageHeight / 2,
                this.imageWidth,
                this.imageHeight
            );
        }

        ctx.restore();

        // mala kreska pokazujaca kierunek
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * 10,
            this.y - Math.sin(this.angle) * 10
        );
        ctx.strokeStyle = this.isColliding ? "orange" : this.color.trail;
        ctx.lineWidth = 5;
        ctx.stroke();

        // tekst z liczba okrazen
        ctx.save();
        ctx.fillStyle = this.color.trail;
        ctx.font = '20px Arial';
        ctx.fillText(`Gracz ${this.playerId} - Okrazenia: ${this.lapsCompleted}/${this.totalLaps}`, 10, 30 + (this.playerId - 1) * 30);
        ctx.restore();
    }

    // reakcja na klawisze
    handleInput(leftKey, rightKey) {
        if (leftKey) this.angle -= this.turnSpeed;
        if (rightKey) this.angle += this.turnSpeed;
    }

    // aktualizacja pozycji
    update(keys, board) {
        if (!this.isAlive) return;

        // nowa pozycja
        const nextX = this.x + Math.cos(this.angle) * this.speed;
        const nextY = this.y + Math.sin(this.angle) * this.speed;

        // sprawdzamy czy mozna jechac dalej
        if (board.isInsideTrack(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;

            // dodajemy nowy punkt sladu
            this.trail.push({
                x: this.x,
                y: this.y,
                timestamp: Date.now()
            });

            // usuwamy najstarsze punkty jak za dlugi slad
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }

            this.checkFinishLine();
        } else {
            // jak kolizja to koniec
            this.isColliding = true;
            this.isAlive = false;
            console.log(`Gracz ${this.playerId} sie rozwalil`);
        }
    }

    // sprawdzanie czy minelismy mete
    checkFinishLine() {
        const finishLineWidth = trackConfig.finishLine.width;
        const finishLineHeight = trackConfig.finishLine.height;

        // czy przejezdzamy przez linie mety
        if (this.y >= this.finishLineY &&
            this.y <= (this.finishLineY + finishLineHeight) &&
            Math.abs(this.x - this.finishLineX) < finishLineWidth / 2) {

            if (!this.crossedFinishLine) {
                this.crossedFinishLine = true;
                this.lapsCompleted++;
                console.log(`Okrazenie ${this.lapsCompleted}`);
            }
        } else if (this.y > (this.finishLineY + finishLineHeight)) {
            this.crossedFinishLine = false;
        }

        // jak wystarczajaco okrazen to wygrana
        if (this.lapsCompleted >= this.totalLaps) {
            this.hasWon = true;
            this.isAlive = false;
        }
    }

    // reset do ustawien poczatkowych
    reset() {
        const position = playerConfig.startPositions[`player${this.playerId}`];
        this.x = position.x;
        this.y = position.y;
        this.angle = 0;
        this.trail = [];
        this.isColliding = false;
        this.lapsCompleted = 0;
        this.crossedFinishLine = false;
        this.isAlive = true;
        this.hasWon = false;
    }
}