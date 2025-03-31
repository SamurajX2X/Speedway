import { Motorcycle } from './motorcycle.js';

export class Board {
    constructor(width, height) {
        this.canvas = document.getElementById("track") || document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;

        // Wymiary głównego toru
        this.widthBig = 600;
        this.lengthBig = 1200;
        this.cornerRadius = 300;
        this.xStartBig = (width - this.lengthBig) / 2;
        this.yTopBig = (height - this.widthBig) / 2;

        // Wymiary wewnętrznego toru
        this.widthSmall = this.widthBig - 400;
        this.lengthSmall = this.lengthBig - 400;
        this.cornerRadiusSmall = this.cornerRadius - 150;
        this.xStartSmall = this.xStartBig + (this.lengthBig - this.lengthSmall) / 2;
        this.yTopSmall = this.yTopBig + (this.widthBig - this.widthSmall) / 2;

        // Tekstury
        this.grassPattern = null;

        this.dirtPattern = null;
        this.loadTextures();

        this.motorcycle = {
            x: this.xStartBig + this.lengthBig / 2,
            y: this.yTopBig + this.widthBig / 2,
            width: 50,
            height: 30,
            angle: 0,
            speed: 0,
            image: null
        };
        this.loadMotorcycleImage();
    }

    loadTextures() {
        const grassImg = new Image();
        const dirtImg = new Image();

        grassImg.onload = () => {
            this.grassPattern = this.context.createPattern(grassImg, 'repeat');
            this.drawTracks();
        };

        dirtImg.onload = () => {
            this.dirtPattern = this.context.createPattern(dirtImg, 'repeat');
            this.drawTracks();
        };

        grassImg.src = 'public/gfx/grass.jpg';
        dirtImg.src = 'public/gfx/dirt.jpg';
    }

    loadMotorcycleImage() {
        const motorcycleImg = new Image();
        motorcycleImg.onload = () => {
            this.motorcycle.image = motorcycleImg;
            this.update();
        };
        motorcycleImg.src = 'public/gfx/motorcycle.png';
    }

    initialize() {
        if (!document.getElementById("track")) {
            document.body.appendChild(this.canvas);
        }
        this.drawTracks();
        this.drawMotorcycle();
    }

    drawTracks() {
        this.context.save();

        if (this.grassPattern) {
            this.context.fillStyle = this.grassPattern;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.context.beginPath();
        this.context.roundRect(this.xStartBig, this.yTopBig, this.lengthBig, this.widthBig, this.cornerRadius);
        this.context.roundRect(
            this.xStartSmall,
            this.yTopSmall,
            this.lengthSmall,
            this.widthSmall,
            this.cornerRadiusSmall
        );

        if (this.dirtPattern) {
            this.context.fillStyle = this.dirtPattern;
            this.context.fill('evenodd');
        }

        this.context.strokeStyle = "black";
        this.context.lineWidth = 5;
        this.context.stroke();

        this.context.restore();
    }

    drawTrack(x, y, width, height, radius, color) {
        this.context.save();

        if (this.grassPattern) {
            this.context.fillStyle = this.grassPattern;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.context.beginPath();
        this.context.roundRect(x, y, width, height, radius);

        this.context.strokeStyle = color;
        this.context.lineWidth = 5;
        this.context.stroke();

        if (this.dirtPattern) {
            this.context.fillStyle = this.dirtPattern;
            this.context.fill();
        }

        this.context.restore();
    }

    drawMotorcycle() {
        if (this.motorcycle.image) {
            this.context.save();
            this.context.translate(this.motorcycle.x, this.motorcycle.y);
            this.context.rotate(this.motorcycle.angle);
            this.context.drawImage(
                this.motorcycle.image,
                -this.motorcycle.width / 2,
                -this.motorcycle.height / 2,
                this.motorcycle.width,
                this.motorcycle.height
            );
            this.context.restore();
        }
    }

    updateMotorcyclePosition(key) {
        const speedIncrement = 2;
        const angleIncrement = 0.1;

        if (key === "ArrowUp") {
            this.motorcycle.speed += speedIncrement;
        } else if (key === "ArrowDown") {
            this.motorcycle.speed -= speedIncrement;
        } else if (key === "ArrowLeft") {
            this.motorcycle.angle -= angleIncrement;
        } else if (key === "ArrowRight") {
            this.motorcycle.angle += angleIncrement;
        }

        this.motorcycle.x += this.motorcycle.speed * Math.cos(this.motorcycle.angle);
        this.motorcycle.y += this.motorcycle.speed * Math.sin(this.motorcycle.angle);

        // Prevent motorcycle from leaving the track
        if (!this.isInsideTrack(this.motorcycle.x, this.motorcycle.y)) {
            this.motorcycle.speed = 0; // Stop the motorcycle if it leaves the track
        }
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTracks();
        this.drawMotorcycle();
    }

    isInsideTrack(x, y) {
        const lineWidth = 5; // Grubość linii toru

        // Definicje centrów narożników dla zewnętrznego toru
        const centersOuter = {
            topLeft: { x: this.xStartBig + this.cornerRadius, y: this.yTopBig + this.cornerRadius },
            topRight: { x: this.xStartBig + this.lengthBig - this.cornerRadius, y: this.yTopBig + this.cornerRadius },
            bottomLeft: { x: this.xStartBig + this.cornerRadius, y: this.yTopBig + this.widthBig - this.cornerRadius },
            bottomRight: { x: this.xStartBig + this.lengthBig - this.cornerRadius, y: this.yTopBig + this.widthBig - this.cornerRadius }
        };

        // Definicje centrów narożników dla wewnętrznego toru
        const centersInner = {
            topLeft: { x: this.xStartSmall + this.cornerRadiusSmall, y: this.yTopSmall + this.cornerRadiusSmall },
            topRight: { x: this.xStartSmall + this.lengthSmall - this.cornerRadiusSmall, y: this.yTopSmall + this.cornerRadiusSmall },
            bottomLeft: { x: this.xStartSmall + this.cornerRadiusSmall, y: this.yTopSmall + this.widthSmall - this.cornerRadiusSmall },
            bottomRight: { x: this.xStartSmall + this.lengthSmall - this.cornerRadiusSmall, y: this.yTopSmall + this.widthSmall - this.cornerRadiusSmall }
        };

        // Sprawdzenie prostych odcinków (środkowa część toru)
        if (x >= this.xStartBig + this.cornerRadius && x <= this.xStartBig + this.lengthBig - this.cornerRadius &&
            y >= this.yTopBig && y <= this.yTopBig + this.widthBig) {
            const isInsideOuter = true;
            const isInsideInner = x >= this.xStartSmall + this.cornerRadiusSmall &&
                x <= this.xStartSmall + this.lengthSmall - this.cornerRadiusSmall &&
                y >= this.yTopSmall && y <= this.yTopSmall + this.widthSmall;
            if (isInsideOuter && !isInsideInner) {
                return true;
            }
        }



        // Sprawdzenie czy punkt jest w którymś z narożników zewnętrznego toru
        const isInOuterCorner =
            (this.distanceToPoint(x, y, centersOuter.topLeft) <= this.cornerRadius && x <= centersOuter.topLeft.x && y <= centersOuter.topLeft.y) ||
            (this.distanceToPoint(x, y, centersOuter.topRight) <= this.cornerRadius && x >= centersOuter.topRight.x && y <= centersOuter.topRight.y) ||
            (this.distanceToPoint(x, y, centersOuter.bottomLeft) <= this.cornerRadius && x <= centersOuter.bottomLeft.x && y >= centersOuter.bottomLeft.y) ||
            (this.distanceToPoint(x, y, centersOuter.bottomRight) <= this.cornerRadius && x >= centersOuter.bottomRight.x && y >= centersOuter.bottomRight.y);

        // Sprawdzenie czy punkt jest w którymś z narożników wewnętrznego toru
        const isInInnerCorner =
            (this.distanceToPoint(x, y, centersInner.topLeft) <= this.cornerRadiusSmall && x <= centersInner.topLeft.x && y <= centersInner.topLeft.y) ||
            (this.distanceToPoint(x, y, centersInner.topRight) <= this.cornerRadiusSmall && x >= centersInner.topRight.x && y <= centersInner.topRight.y) ||
            (this.distanceToPoint(x, y, centersInner.bottomLeft) <= this.cornerRadiusSmall && x <= centersInner.bottomLeft.x && y >= centersInner.bottomLeft.y) ||
            (this.distanceToPoint(x, y, centersInner.bottomRight) <= this.cornerRadiusSmall && x >= centersInner.bottomRight.x && y >= centersInner.bottomRight.y);

        // Punkt jest w torze, jeśli jest w zewnętrznym narożniku i nie jest w wewnętrznym narożniku
        return isInOuterCorner && !isInInnerCorner;
    }

    distanceToPoint(x, y, point) {
        return Math.sqrt(
            Math.pow(x - point.x, 2) +
            Math.pow(y - point.y, 2)
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const board = new Board(1200, 800);
    board.initialize();

    document.addEventListener("keydown", (event) => {
        board.updateMotorcyclePosition(event.key);
        board.update();
    });
});