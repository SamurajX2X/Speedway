// wszystko co dotyczy toru wyścigowego
import { Motorcycle } from './motorcycle.js';
import { trackConfig } from './config.js';

export class Board {
    constructor(width, height) {
        // podstawowe ustawienia canvasu
        this.canvas = document.getElementById("track") || document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;

        // główny tor - zewnętrzny
        this.widthBig = trackConfig.widthBig;
        this.lengthBig = trackConfig.lengthBig;
        this.cornerRadius = trackConfig.cornerRadius;
        this.xStartBig = (width - this.lengthBig) / 2;
        this.yTopBig = (height - this.widthBig) / 2;

        // wewnętrzna część toru
        this.widthSmall = this.widthBig - 400;
        this.lengthSmall = this.lengthBig - 400;
        this.cornerRadiusSmall = this.cornerRadius - 150;
        this.xStartSmall = this.xStartBig + (this.lengthBig - this.lengthSmall) / 2;
        this.yTopSmall = this.yTopBig + (this.widthBig - this.widthSmall) / 2;

        // ścieżki do wykrywania kolizji
        this.outerPath = new Path2D();
        this.innerPath = new Path2D();

        // tekstury podłoża
        this.grassPattern = null;
        this.dirtPattern = null;
        this.loadTextures();

        // ustawienia motocykla
        this.motorcycle = {
            width: 50,
            height: 30,
            angle: 0,
            speed: 0,
            image: null
        };
        this.loadMotorcycleImage();
    }

    // ładujemy tekstury trawy i ziemi
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

    // ładujemy obrazek motocykla
    loadMotorcycleImage() {
        const motorcycleImg = new Image();
        motorcycleImg.onload = () => {
            this.motorcycle.image = motorcycleImg;
            this.update();
        };
        motorcycleImg.src = 'public/gfx/motorcycle.png';
    }

    // tworzymy kształt toru
    createTrackPaths() {
        // zewnętrzny obrys
        this.outerPath = new Path2D();
        this.outerPath.roundRect(this.xStartBig, this.yTopBig, this.lengthBig, this.widthBig, this.cornerRadius);

        // wewnętrzny obrys
        this.innerPath = new Path2D();
        this.innerPath.roundRect(this.xStartSmall, this.yTopSmall, this.lengthSmall, this.widthSmall, this.cornerRadiusSmall);
    }

    // rysujemy cały sigmaaaa tor
    drawTracks() {
        // tło  trawa jakas losowa nwm
        this.context.save();

        if (this.grassPattern) {
            this.context.fillStyle = this.grassPattern;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // ten dizalajacy tor 
        this.context.beginPath();
        this.context.roundRect(this.xStartBig, this.yTopBig, this.lengthBig, this.widthBig, this.cornerRadius);
        this.context.roundRect(
            this.xStartSmall,
            this.yTopSmall,
            this.lengthSmall,
            this.widthSmall,
            this.cornerRadiusSmall
        );

        // dirt z majkrafta
        if (this.dirtPattern) {
            this.context.fillStyle = this.dirtPattern;
            this.context.fill('evenodd');
        }

        // obramowanie toru
        this.context.strokeStyle = "black";
        this.context.lineWidth = 5;
        this.context.stroke();

        this.context.restore();

        // linia METY
        this.drawFinishLine();
    }

    //draw tej mety 
    drawFinishLine() {
        const stripeSize = 10;

        const lineWidth = 30;
        const lineHeight = 192;

        const startX = 600 - lineWidth / 2;
        const startY = this.yTopBig;

        this.context.save();

        // szachownica - czarno-białe kwadraty
        for (let y = 0; y < lineHeight; y += stripeSize) {
            for (let x = 0; x < lineWidth; x += stripeSize) {
                this.context.fillStyle = (x / stripeSize + y / stripeSize) % 2 === 0 ? "black" : "white";
                this.context.fillRect(startX + x, startY + y, stripeSize, stripeSize);
            }
        }

        this.context.restore();
    }

    // rysujemy motocykl na torze
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

    // aktualizacja pozycji motoru
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

        // nowa pozycja
        this.motorcycle.x += this.motorcycle.speed * Math.cos(this.motorcycle.angle);
        this.motorcycle.y += this.motorcycle.speed * Math.sin(this.motorcycle.angle);

        // sprawdzamy kolizje
        if (!this.isInsideTrack(this.motorcycle.x, this.motorcycle.y)) {
            this.motorcycle.speed = 0;
        }
    }

    // sprawdzamy czy pozycja jest na torze
    isInsideTrack(x, y) {
        return this.context.isPointInPath(this.outerPath, x, y) &&
            !this.context.isPointInPath(this.innerPath, x, y);
    }

    // przygotowanie toru do gry
    initialize() {
        if (!document.getElementById("track")) {
            document.body.appendChild(this.canvas);
        }
        this.createTrackPaths();
        this.drawTracks();
    }

    // odświeżanie widoku
    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTracks();
        this.drawMotorcycle();
    }
}

// start gry po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    const board = new Board(1200, 800);
    board.initialize();

    document.addEventListener("keydown", (event) => {
        board.updateMotorcyclePosition(event.key);
        board.update();
    });
});