export class Player {
    constructor() {
        this.x = 600;
        this.y = 200;
        this.angle = 0;
        this.speed = 5;
        this.turnSpeed = 0.08;
        this.trail = [];
        this.maxTrailLength = 200;
        this.trailFadeSteps = 50;
    }

    draw(ctx) {
        for (let i = 0; i < this.trail.length - 1; i++) {
            const opacity = (i / this.trail.length); // Opacity 
            ctx.beginPath();
            ctx.moveTo(this.trail[i].x, this.trail[i].y);
            ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
            ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
            ctx.lineWidth = 7;
            ctx.stroke();
        }


        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - Math.cos(this.angle) * 10,
            this.y - Math.sin(this.angle) * 10
        );
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    update(keys) {
        if (keys["KeyA"]) this.angle += this.turnSpeed;
        if (keys["KeyS"]) this.angle -= this.turnSpeed;

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.trail.push({
            x: this.x,
            y: this.y,
            timestamp: Date.now()
        });

        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    reset() {
        this.x = 600;
        this.y = 500;
        this.angle = 0;
        this.trail = [];
    }
}