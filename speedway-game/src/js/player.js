class Player {
    constructor(motorcycle) {
        this.motorcycle = motorcycle; // Reference to the player's motorcycle
    }

    handleKeyDown(event) {
        this.motorcycle.handleKeyDown(event); // Delegate key down event to motorcycle
    }

    handleKeyUp(event) {
        this.motorcycle.handleKeyUp(event); // Delegate key up event to motorcycle
    }

    update() {
        this.motorcycle.update(); // Update the motorcycle's state
    }

    draw(ctx) {
        this.motorcycle.draw(ctx); // Draw the motorcycle on the canvas
    }
}

export default Player;