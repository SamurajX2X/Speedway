class Motorcycle {
    constructor(x, y, angle, color, turnKey, track) {
        this.x = x;
        this.y = y;
        this.angle = angle; // Angle in radians – determines the direction of movement
        this.speed = 3;   // Movement speed in pixels per frame
        this.turnSpeed = 0.05; // Turning speed
        this.color = color;
        this.turnKey = turnKey; // Key for turning
        this.turning = false;
        this.trail = []; // Movement history – for drawing the trail
        this.lap = 0;
        this.alive = true;
        this.track = track; // Reference to the track – needed for collision detection
    }

    update() {
        if (!this.alive) return;
        // Save previous position (for detecting crossing the start line)
        this.prevX = this.x;
        this.prevY = this.y;
        if (this.turning) {
            this.angle += this.turnSpeed;
        }
        // Update position
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        // Update trail – points fade after 2 seconds
        const currentTime = Date.now();
        this.trail.push({ x: this.x, y: this.y, time: currentTime });
        const maxAge = 2000;
        this.trail = this.trail.filter(point => currentTime - point.time < maxAge);
        // Check if motorcycle is still on the track
        if (!this.track.isPointInside(this.x, this.y)) {
            this.alive = false;
            this.speed = 0;
        }
    }

    draw(ctx) {
        if (!this.alive) return;
        // Draw trail with fading effect
        ctx.lineWidth = 2;
        ctx.beginPath();
        const currentTime = Date.now();
        const maxAge = 2000;
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const age = currentTime - point.time;
            const opacity = 1 - age / maxAge;
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = opacity;
            if (i === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        // Draw motorcycle as a small dot
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

export default Motorcycle;