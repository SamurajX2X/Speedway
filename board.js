// export class Track {
//     constructor(canvas) {
//         this.canvas = canvas;
//         this.ctx = canvas.getContext('2d');
//         this.width = canvas.width;
//         this.height = canvas.height;
//         this.centerX = this.width / 2;
//         this.centerY = this.height / 2;
//         this.radiusX = 150; // Promień w poziomie
//         this.radiusY = 75; // Mniejszy promień w pionie (podłużny tor)
//         this.innerRadiusX = this.radiusX - 50; // Wewnętrzna elipsa
//         this.innerRadiusY = this.radiusY - 50;
//         this.startLineX = this.centerX + this.radiusX - 20; // Linia startu blisko prawej krawędzi
//     }

//     draw() {
//         // Tło toru (szary)
//         this.ctx.fillStyle = '#666';
//         this.ctx.beginPath();
//         this.ctx.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
//         this.ctx.fill();

//         // Wewnętrzna część (biała)
//         this.ctx.fillStyle = '#fff';
//         this.ctx.beginPath();
//         this.ctx.ellipse(this.centerX, this.centerY, this.innerRadiusX, this.innerRadiusY, 0, 0, 2 * Math.PI);
//         this.ctx.fill();

//         // Linia startu/mety
//         this.ctx.strokeStyle = 'red';
//         this.ctx.lineWidth = 2;
//         this.ctx.beginPath();
//         this.ctx.moveTo(this.startLineX, this.centerY - 20);
//         this.ctx.lineTo(this.startLineX, this.centerY + 20);
//         this.ctx.stroke();
//     }

//     isPointInside(x, y) {
//         // Wzór elipsy: x²/a² + y²/b² ≤ 1
//         const outer = (Math.pow(x - this.centerX, 2) / Math.pow(this.radiusX, 2)) +
//             (Math.pow(y - this.centerY, 2) / Math.pow(this.radiusY, 2)) <= 1;

//         const inner = (Math.pow(x - this.centerX, 2) / Math.pow(this.innerRadiusX, 2)) +
//             (Math.pow(y - this.centerY, 2) / Math.pow(this.innerRadiusY, 2)) >= 1;

//         return outer && inner;
//     }
//     //
//     crossedStartLine(prevX, prevY, x, y) {
//         const crossedX = prevX <= this.startLineX && x > this.startLineX;
//         const withinY = prevY >= this.centerY - 20 && prevY <= this.centerY + 20;
//         return crossedX && withinY;
//     }

//     getPositionFromAngle(angle) {
//         // Oblicza pozycję na elipsie na podstawie kąta w radianach
//         return {
//             x: this.centerX + this.radiusX * Math.cos(angle),
//             y: this.centerY + this.radiusY * Math.sin(angle)
//         };
//     }
// }