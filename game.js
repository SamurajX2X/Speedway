const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    drawTrack();
});

function drawTrack() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const straightLength = 600; // Długość prostych
    const outerRadius = 200; // Większy promień zewnętrzny
    const trackWidth = 100; // Znacznie szerszy tor
    const innerRadius = outerRadius - trackWidth;

    // Wypełnienie toru (brązowy)
    ctx.fillStyle = '#654321';
    ctx.beginPath();

    // Zewnętrzny kontur (zegarowo)
    ctx.moveTo(centerX - straightLength / 2, centerY - outerRadius);
    ctx.lineTo(centerX + straightLength / 2, centerY - outerRadius);
    ctx.arc(centerX + straightLength / 2, centerY, outerRadius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(centerX - straightLength / 2, centerY + outerRadius);
    ctx.arc(centerX - straightLength / 2, centerY, outerRadius, Math.PI / 2, 3 * Math.PI / 2);

    // Wewnętrzny kontur (przeciwnie do zegara)
    ctx.moveTo(centerX - straightLength / 2 + trackWidth, centerY - innerRadius);
    ctx.lineTo(centerX + straightLength / 2 - trackWidth, centerY - innerRadius);
    ctx.arc(centerX + straightLength / 2 - trackWidth, centerY, innerRadius, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(centerX - straightLength / 2 + trackWidth, centerY + innerRadius);
    ctx.arc(centerX - straightLength / 2 + trackWidth, centerY, innerRadius, Math.PI / 2, 3 * Math.PI / 2, true);

    ctx.fill('evenodd');

    // Bariery zewnętrzne
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - straightLength / 2, centerY - outerRadius);
    ctx.lineTo(centerX + straightLength / 2, centerY - outerRadius);
    ctx.arc(centerX + straightLength / 2, centerY, outerRadius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(centerX - straightLength / 2, centerY + outerRadius);
    ctx.arc(centerX - straightLength / 2, centerY, outerRadius, Math.PI / 2, 3 * Math.PI / 2);
    ctx.closePath();
    ctx.stroke();

    // Bariery wewnętrzne
    ctx.beginPath();
    ctx.moveTo(centerX - straightLength / 2 + trackWidth, centerY - innerRadius);
    ctx.lineTo(centerX + straightLength / 2 - trackWidth, centerY - innerRadius);
    ctx.arc(centerX + straightLength / 2 - trackWidth, centerY, innerRadius, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(centerX - straightLength / 2 + trackWidth, centerY + innerRadius);
    ctx.arc(centerX - straightLength / 2 + trackWidth, centerY, innerRadius, Math.PI / 2, 3 * Math.PI / 2);
    ctx.closePath();
    ctx.stroke();

    // Linia startowa
    ctx.strokeStyle = 'white';
    ctx.setLineDash([20, 15]);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(centerX - straightLength / 2 + 50, centerY - outerRadius + trackWidth / 2);
    ctx.lineTo(centerX + straightLength / 2 - 50, centerY - outerRadius + trackWidth / 2);
    ctx.stroke();

    // Kratki startowe
    const gridCount = 4;
    const gridSpacing = straightLength / (gridCount + 1);
    ctx.setLineDash([]);
    for (let i = 1; i <= gridCount; i++) {
        const x = centerX - straightLength / 2 + gridSpacing * i;
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 3, centerY - outerRadius + trackWidth / 2 - 15, 6, 30);
    }

    // Bandy bezpieczeństwa
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX + straightLength / 2, centerY, outerRadius + 20, -Math.PI / 2, Math.PI / 2);
    ctx.arc(centerX - straightLength / 2, centerY, outerRadius + 20, Math.PI / 2, 3 * Math.PI / 2);
    ctx.stroke();
}