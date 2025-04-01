// tu sie zaczyna cała zabawa
import { Board } from './board.js'
import { Player } from './player.js'
import { gameConfig, formConfig } from './config.js'

// potrzebne zmienne do działania gry
let board
let players = []
let keys = {}
let gameRunning = false
let currentLaps = gameConfig.laps
let currentPlayers = gameConfig.players

// jak gracz wciska klawisze to tu
function handleControls(keys) {
    // jak nic nie wcisniete to nie ma co sprawdzać
    if (Object.keys(keys).length === 0) return

    // lecimy po każdym graczu i patrzymy jego klawisze
    players.forEach(player => {
        if (player.isAlive) {
            const controls = formConfig.playerControls[`player${player.playerId}`]
            player.handleInput(keys[controls.left], keys[controls.right])
        }
    })
}

// odpalamy nową grę z ustawieniami
function startGame(laps, numberOfPlayers) {
    currentLaps = laps
    currentPlayers = numberOfPlayers

    board = new Board(1200, 800)
    board.initialize()

    // czyszczenie starych graczy
    players = []

    // tworzymy nowych graczy tylu ile trzeba
    for (let i = 1; i <= numberOfPlayers; i++) {
        const player = new Player(i)
        player.totalLaps = laps
        players.push(player)
    }

    gameRunning = true
    console.log(`Start gry${currentLaps} laps  ${currentPlayers} players`)
    requestAnimationFrame(gameLoop)
}

// pokazuje kto wygrał jak gra się skończy
function showGameOver(message) {
    const gameOver = document.getElementById('gameOver')
    const winnerText = document.getElementById('winnerText')
    gameOver.style.display = 'block'
    winnerText.innerHTML = message
}

// sprawdza czy gra się już skończyła
function checkGameEnd() {
    // kto jeszcze żyje
    const alivePlayers = players.filter(p => p.isAlive)
    // kto już wygrał
    const winners = players.filter(p => p.hasWon)

    // jak ktoś wygrał to koniec
    if (winners.length > 0) {
        gameRunning = false
        showGameOver(`Gracz ${winners[0].playerId} wygrywa okrazeniami`)
        return true
    }

    // w multiplayerze jak został tylko jeden
    if (currentPlayers > 1 && alivePlayers.length === 1) {
        gameRunning = false
        const survivor = alivePlayers[0]
        survivor.hasWon = true
        showGameOver(`Gracz ${survivor.playerId} wygrywa jako ostatni zyjacy`)
        return true
    }

    // w singleplayerze jak się rozjebał
    if (currentPlayers === 1 && alivePlayers.length === 0) {
        gameRunning = false
        showGameOver('Game Over - rozwaliles sie')
        return true
    }

    // w multiplayerze jak wszyscy się rozwalili
    if (currentPlayers > 1 && alivePlayers.length === 0) {
        gameRunning = false
        showGameOver('Game Over - wszyscy gracze rozwalili sie')
        return true
    }

    return false
}

// główna pętla gry 
function gameLoop() {
    if (!gameRunning) return

    board.update()
    handleControls(keys)

    // czyszczenie  ekranu przed rysowaniem
    board.context.clearRect(0, 0, board.canvas.width, board.canvas.height)
    board.drawTracks()

    // aktualizacja i rysowanie graczy
    players.forEach(player => {
        // tylko żywi gracze 
        if (player.isAlive) {
            player.update(keys, board)
        }
        player.draw(board.context)
    })

    if (checkGameEnd()) {
        // restart gry po 5 sekundach
        setTimeout(() => {
            players.forEach(p => p.reset())
            // startGame(currentLaps, currentPlayers)
        }, 5000)
        return
    }

    requestAnimationFrame(gameLoop)
}

// jak strona będzie gotowa
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("settingsForm")
    const gameArea = document.getElementById("gameArea")
    const settingsPanel = document.getElementById("gameSettings")

    // ustawiamy domyślne wartości
    document.getElementById("laps").value = 3  // standardowa liczba okrążeń
    document.getElementById("players").value = 2  // domyślnie 2 graczy

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        //  wartości z formularza
        let laps = parseInt(document.getElementById("laps").value) || 3
        let players = parseInt(document.getElementById("players").value) || 2

        //  wartości defaultowe
        laps = Math.min(Math.max(laps, 1), 10)  // min 1 max 10
        players = Math.min(Math.max(players, 1), 4)  // min 1 max 4

        // pokazujemy arenę gry i chowamy formularz
        settingsPanel.style.display = "none"
        gameArea.style.display = "block"

        // start
        startGame(laps, players)
    })
})
// handlowanie wcisnietych klawiszy
document.addEventListener("keydown", (e) => {
    keys[e.code] = true
})

// łapiemy puszczone klawisze
document.addEventListener("keyup", (e) => {
    keys[e.code] = false
})