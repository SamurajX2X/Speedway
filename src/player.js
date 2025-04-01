export class Player {
    // wartosci poczatkowe gracza
    constructor() {
        this.x = 600;
        this.y = 200;
        this.angle = 0;
        this.speed = 5;
        this.turnSpeed = 0.05;
        this.trail = [];
        this.maxTrailLength = 200;
        this.trailFadeSteps = 50;
        this.isColliding = false;
        this.radius = 5;  // Match with the arc radius
        this.motoImage = new Image();
        this.motoImage.src = 'public/gfx/motorcycle.png';
        this.imageWidth = 50;
        this.imageHeight = 30;
    }

    // rysowanie gracza na ekranie
    draw(ctx) {
        // rysowanie sladu za graczem
        for (let i = 0; i < this.trail.length - 1; i++) {
            const opacity = (i / this.trail.length);
            ctx.beginPath();
            ctx.moveTo(this.trail[i].x, this.trail[i].y);
            ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
            ctx.strokeStyle = `rgba(${this.isColliding ? '255, 165, 0' : '255, 0, 0'}, ${opacity})`;
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // rysowanie motocykla gracza
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle - Math.PI / 2 + Math.PI); // Added + Math.PI to invert the image

        // Draw the motorcycle image if loaded
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

        // rysowanie wskaznika kierunku
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * 10,
            this.y - Math.sin(this.angle) * 10
        );
        ctx.strokeStyle = this.isColliding ? "orange" : "red";
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    // aktualizacja pozycji gracza
    update(keys, board) {
        // obliczanie nastepnej pozycji
        const nextX = this.x + Math.cos(this.angle) * this.speed;
        const nextY = this.y + Math.sin(this.angle) * this.speed;

        // sprawdzenie kolizji z torem
        if (board.isInsideTrack(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;

            // dodawanie nowego punktu sladu
            this.trail.push({
                x: this.x,
                y: this.y,
                timestamp: Date.now()
            });

            // usuwanie starych punktow sladu
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }

            // obrot gracza na podstawie klawiszy
            if (keys["KeyS"]) this.angle += this.turnSpeed;
            if (keys["KeyA"]) this.angle -= this.turnSpeed;
        } else {
            this.isColliding = true;
        }
    }

    // reset pozycji gracza
    reset() {
        this.x = 600;
        this.y = 500;
        this.angle = 0;
        this.trail = [];
        this.isColliding = false;
    }
}