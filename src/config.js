// ustawienia toru
export const trackConfig = {
    widthBig: 600, // szerokosc toru zewnetrznego
    lengthBig: 1200, // dlugosc toru zewnetrznego
    cornerRadius: 300, // zakrety toru zewnetrznego
    widthSmall: 200, // szerokosc toru wewnetrznego
    lengthSmall: 800, // dlugosc toru wewnetrznego
    cornerRadiusSmall: 150, // zakrety toru wewnetrznego
    grassPattern: null, // wzor trawy
    dirtPattern: null, // wzor nawierzchni
    canvasWidth: 1200, // szerokosc kanwy
    canvasHeight: 800, // wysokosc kanwy
    finishLine: {
        x: 600,
        width: 30,
        y: 100,  // wysokosc linii mety
        height: 192
    }
};

// ustawienia motocykla
export const playerConfig = {
    startX: 620, // poczatkowa pozycja X
    startY: 200, // poczatkowa pozycja Y
    speed: 5, // predkosc
    turnSpeed: 0.05, // predkosc obrotu
    trailMaxLength: 200, // dlugosc sladu
    trailFadeSteps: 200, // zanikanie sladu
    radius: 5, // promien
    imageWidth: 50, // szerokosc obrazka
    imageHeight: 30, // wysokosc obrazka
    startPositions: {
        player1: { x: 620, y: 200 },
        player2: { x: 620, y: 210 },
        player3: { x: 620, y: 220 },
        player4: { x: 620, y: 230 }
    }
};

// kolory graczy
export const playerColors = {
    player1: {
        trail: 'rgba(255, 0, 0, 0.8)',    // czerwony slad
        base: '#FF0000'
    },
    player2: {
        trail: 'rgba(0, 255, 0, 0.8)',    // zielony slad
        base: '#00FF00'
    },
    player3: {
        trail: 'rgba(0, 0, 255, 0.8)',    // niebieski slad
        base: '#0000FF'
    },
    player4: {
        trail: 'rgba(255, 255, 0, 0.8)',  // zolty slad
        base: '#FFFF00'
    }
};

// ustawienia rozgrywki
export const gameConfig = {
    laps: 3, // liczba okrazen
    players: 1, // liczba graczy
    minLaps: 1, // minimalna liczba okrazen
    maxLaps: 10, // maksymalna liczba okrazen
    maxPlayers: 4, // maksymalna liczba graczy
};

// ustawienia menu
export const formConfig = {
    playerControls: {
        // player1: { left: 'ArrowLeft', right: 'ArrowRight' },
        // player2: { left: 'KeyA', right: 'KeyS' },
        // player3: { left: 'KeyG', right: 'KeyH' },
        // player4: { left: 'KeyK', right: 'KeyL' }
        player1: { right: 'ArrowRight' },
        player2: { right: 'KeyS' },
        player3: { right: 'KeyH' },
        player4: { right: 'KeyL' }
    },
    defaultLaps: 3,
    defaultPlayers: 1
};
