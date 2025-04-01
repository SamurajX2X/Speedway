// Konfiguracja toru
export const trackConfig = {
    widthBig: 600, // szerokosc toru zewnetrznego
    lengthBig: 1200, // dlugosc toru zewnetrznego
    cornerRadius: 300, // promien zakretu toru zewnetrznego
    widthSmall: 200, // szerokosc toru wewnetrznego
    lengthSmall: 800, // dlugosc toru wewnetrznego
    cornerRadiusSmall: 150, // promien zakretu toru wewnetrznego
    grassPattern: null, // tekstura trawy
    dirtPattern: null, // tekstura toru
};

// Konfiguracja gracza
export const playerConfig = {
    startX: 600, // poczatkowa pozycja gracza X
    startY: 200, // poczatkowa pozycja gracza Y
    speed: 7, // predkosc gracza
    turnSpeed: 0.05, // predkosc obrotu gracza
    trailMaxLength: 200, // maksymalna dlugosc sladu
    trailFadeSteps: 50, // kroki zanikania sladu
};

// Konfiguracja gry
export const gameConfig = {
    laps: 3, // domyslna liczba okrazen
    players: 1, // domyslna liczba graczy
};
