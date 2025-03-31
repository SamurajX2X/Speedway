export class Motorcycle {
    constructor(context, x, y) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 30;
        this.color = 'red';
        this.speed = 5;
    }

    draw() {
        this.context.save();
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        this.context.restore();
    }

    handleInput(key) {
        switch (key) {
            case 'ArrowUp':
                this.y -= this.speed;
                break;
            case 'ArrowDown':
                this.y += this.speed;
                break;
            case 'ArrowLeft':
                this.x -= this.speed;
                break;
            case 'ArrowRight':
                this.x += this.speed;
                break;
        }
    }
}
