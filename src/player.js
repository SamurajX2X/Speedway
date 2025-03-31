export class Player {
    constructor() {
        this.x = 600;
        this.y = 200;
        this.angle = 0;
        this.speed = 7;
        this.turnSpeed = 0.05;
        this.trail = [];
        this.maxTrailLength = 200;
        this.trailFadeSteps = 50;
        this.isColliding = false;
        this.radius = 5;  // Match with the arc radius
    }

    draw(ctx) {
        // Draw trail with collision-aware color
        for (let i = 0; i < this.trail.length - 1; i++) {
            const opacity = (i / this.trail.length);
            ctx.beginPath();
            ctx.moveTo(this.trail[i].x, this.trail[i].y);
            ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
            ctx.strokeStyle = `rgba(${this.isColliding ? '255, 165, 0' : '255, 0, 0'}, ${opacity})`;
            ctx.lineWidth = 7;
            ctx.stroke();
        }

        // Draw player with collision-aware color
        ctx.fillStyle = this.isColliding ? "orange" : "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw direction indicator
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

    update(keys, board) {
        // Calculate next position
        const nextX = this.x + Math.cos(this.angle) * this.speed;
        const nextY = this.y + Math.sin(this.angle) * this.speed;

        // Check if next position would be inside track
        if (board.isInsideTrack(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;

            this.trail.push({
                x: this.x,
                y: this.y,
                timestamp: Date.now()
            });

            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }

            // Update rotation only if not colliding
            if (keys["KeyS"]) this.angle += this.turnSpeed;
            if (keys["KeyA"]) this.angle -= this.turnSpeed;
        } else {
            this.isColliding = true;
        }
    }

    reset() {
        this.x = 600;
        this.y = 500;
        this.angle = 0;
        this.trail = [];
        this.isColliding = false;
    }
}