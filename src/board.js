import { Motorcycle } from './motorcycle.js';

export class Board {
    constructor(width, height) {
        this.canvas = document.getElementById("track") || document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;

        // wymiary toru zewnetrznego
        this.widthBig = 600;
        this.lengthBig = 1200;
        this.cornerRadius = 300;
        this.xStartBig = (width - this.lengthBig) / 2;
        this.yTopBig = (height - this.widthBig) / 2;

        // wymiary toru wewnetrznego
        this.widthSmall = this.widthBig - 400;
        this.lengthSmall = this.lengthBig - 400;
        this.cornerRadiusSmall = this.cornerRadius - 150;
        this.xStartSmall = this.xStartBig + (this.lengthBig - this.lengthSmall) / 2;
        this.yTopSmall = this.yTopBig + (this.widthBig - this.widthSmall) / 2;

        // sciezki toru do kolizji
        this.outerPath = new Path2D();
        this.innerPath = new Path2D();
        // z racji ze glownie z kolizja mialem problemy taka totalnei basic i matematyczna obrobka kodu (ktora pewnie i dziala szybciej ale no) uzyje Path2D czyli API z canvasa

        // tekstury toru
        this.grassPattern = null;
        this.dirtPattern = null;
        this.loadTextures();

        // parametry playera
        this.motorcycle = {
            // x: this.xStartBig + this.lengthBig / 2, // nieuzywane
            // y: this.yTopBig + this.widthBig / 2,   // nieuzywane
            width: 50,
            height: 30,
            angle: 0,
            speed: 0,
            image: null
        };
        this.loadMotorcycleImage();
    }

    // ladowanie tekstur toru
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

    // ladowanie obrazu motocykla
    loadMotorcycleImage() {
        const motorcycleImg = new Image();
        motorcycleImg.onload = () => {
            this.motorcycle.image = motorcycleImg;
            this.update();
        };
        motorcycleImg.src = 'public/gfx/motorcycle.png';
    }

    // tworzenie sciezek toru
    createTrackPaths() {
        // sciezka zewnetrzna
        this.outerPath = new Path2D();
        this.outerPath.roundRect(this.xStartBig, this.yTopBig, this.lengthBig, this.widthBig, this.cornerRadius);

        // sciezka wewnetrzna
        this.innerPath = new Path2D();
        this.innerPath.roundRect(this.xStartSmall, this.yTopSmall, this.lengthSmall, this.widthSmall, this.cornerRadiusSmall);
    }

    // rysowanie toru
    drawTracks() {
        this.context.save();

        // rysowanie tekstury trawy
        if (this.grassPattern) {
            this.context.fillStyle = this.grassPattern;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // rysowanie toru zewnetrznego i wewnetrznego
        this.context.beginPath();
        this.context.roundRect(this.xStartBig, this.yTopBig, this.lengthBig, this.widthBig, this.cornerRadius);
        this.context.roundRect(
            this.xStartSmall,
            this.yTopSmall,
            this.lengthSmall,
            this.widthSmall,
            this.cornerRadiusSmall
        );

        // wypelnienie toru tekstura
        if (this.dirtPattern) {
            this.context.fillStyle = this.dirtPattern;
            this.context.fill('evenodd');
        }

        // rysowanie obrysu toru
        this.context.strokeStyle = "black";
        this.context.lineWidth = 5;
        this.context.stroke();

        this.context.restore();

        // rysowanie linii startu/mety
        this.drawFinishLine();
    }

    // rysowanie linii startu/mety
    drawFinishLine() {
        const stripeSize = 10; // rozmiar pojedynczego kwadratu

        // szerokosc i wysokosc linii startu/mety
        const lineWidth = 10; // szerokosc linii
        const lineHeight = this.lengthBig; // dlugosc linii dopasowana do dlugosci toru

        // pozycja linii startu/mety na podstawie pozycji gracza
        const startX = 600 - lineWidth / 2; // x gracza (dopasowane do pozycji startowej)
        const startY = this.yTopBig; // poczatek toru zewnetrznego

        this.context.save();

        // rysowanie szachownicy
        for (let y = 0; y < lineHeight; y += stripeSize) {
            for (let x = 0; x < lineWidth; x += stripeSize) {
                this.context.fillStyle = (x / stripeSize + y / stripeSize) % 2 === 0 ? "black" : "white";
                this.context.fillRect(startX + x, startY + y, stripeSize, stripeSize);
            }
        }

        this.context.restore();
    }

    // rysowanie motocykla
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

    // aktualizacja pozycji motocykla
    updateMotorcyclePosition(key) {
        const speedIncrement = 2;
        const angleIncrement = 0.1;

        // zmiana predkosci i kata motocykla
        if (key === "ArrowUp") {
            this.motorcycle.speed += speedIncrement;
        } else if (key === "ArrowDown") {
            this.motorcycle.speed -= speedIncrement;
        } else if (key === "ArrowLeft") {
            this.motorcycle.angle -= angleIncrement;
        } else if (key === "ArrowRight") {
            this.motorcycle.angle += angleIncrement;
        }

        // aktualizacja pozycji motocykla
        this.motorcycle.x += this.motorcycle.speed * Math.cos(this.motorcycle.angle);
        this.motorcycle.y += this.motorcycle.speed * Math.sin(this.motorcycle.angle);

        // sprawdzenie kolizji z torem
        if (!this.isInsideTrack(this.motorcycle.x, this.motorcycle.y)) {
            this.motorcycle.speed = 0; // zatrzymanie motocykla w przypadku kolizji
        }
    }

    // sprawdzenie czy punkt jest w torze
    isInsideTrack(x, y) {
        return this.context.isPointInPath(this.outerPath, x, y) &&
            !this.context.isPointInPath(this.innerPath, x, y);
    }

    // inicjalizacja toru
    initialize() {
        if (!document.getElementById("track")) {
            document.body.appendChild(this.canvas);
        }
        this.createTrackPaths();
        this.drawTracks();
    }

    // aktualizacja toru
    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTracks();
        this.drawMotorcycle();
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