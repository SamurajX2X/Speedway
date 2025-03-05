// import { CONFIG } from './config.js';

// export class Player {
//     constructor(x, y, angle, color, turnKey) {
//         this.x = x;
//         this.y = y;
//         this.angle = angle; // Kąt w radianach (0 do 2π)
//         this.speed = 0.02; // Prędkość jako zmiana kąta (radiany na klatkę)
//         this.turnSpeed = 0.005; // Zmiana kąta przy skręcalności
//         this.color = color;
//         this.turning = false;
//         this.turnKey = turnKey;
//         this.trail = [];
//         this.laps = 0;
//         this.alive = true;
//     }

//     update(track) {
//         if (!this.alive) return;

//         // Zwiększamy kąt o prędkość (ruch po elipsie)
//         this.angle += this.speed;
//         if (this.angle > 2 * Math.PI) {
//             this.angle -= 2 * Math.PI; // Powrót do 0 po pełnym okrążeniu
//             this.laps++;
//         }

//         // Skręcanie
//         if (this.turning) {
//             this.angle += this.turnSpeed;
//             this.angle = this.angle % (2 * Math.PI); // Utrzymanie w zakresie 0–2π
//         }

//         // Oblicz pozycję na elipsie
//         const position = track.getPositionFromAngle(this.angle);
//         this.prevX = this.x;
//         this.prevY = this.y;
//         this.x = position.x;
//         this.y = position.y;

//         // Ślad
//         this.trail.push({ x: this.x, y: this.y, time: Date.now() });
//         this.trail = this.trail.filter(point => Date.now() - point.time < CONFIG.TRAIL_FADE_TIME);
//     }

//     draw(ctx) {
//         if (!this.alive) return;

//         // Ślad
//         ctx.strokeStyle = this.color;
//         ctx.lineWidth = 2;
//         ctx.beginPath();
//         this.trail.forEach((point, index) => {
//             if (index === 0) ctx.moveTo(point.x, point.y);
//             else ctx.lineTo(point.x, point.y);
//         });
//         ctx.stroke();

//         // Motocykl (prostokąt z kołami)
//         ctx.save();
//         ctx.translate(this.x, this.y);
//         ctx.rotate(this.angle + Math.PI / 2); // Obrót o 90° dla poprawnego kierunku
//         ctx.fillStyle = this.color;
//         ctx.fillRect(-10, -5, 20, 10); // Rama
//         ctx.fillStyle = 'black';
//         ctx.beginPath();
//         ctx.arc(-5, 5, 3, 0, 2 * Math.PI); // Tylne koło
//         ctx.fill();
//         ctx.beginPath();
//         ctx.arc(5, 5, 3, 0, 2 * Math.PI); // Przednie koło
//         ctx.fill();
//         ctx.restore();
//     }

//     handleKeyDown(event) {
//         if (event.key === this.turnKey) this.turning = true;
//     }

//     handleKeyUp(event) {
//         if (event.key === this.turnKey) this.turning = false;
//     }
// }