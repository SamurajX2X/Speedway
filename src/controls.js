document.addEventListener('DOMContentLoaded', () => {
    const controlBtn = document.querySelector('.key-btn');
    let isListening = false;

    // Ustaw początkową wartość przycisku
    controlBtn.textContent = `Skręt w prawo: ${formConfig.playerControls.player1.right}`;

    controlBtn.addEventListener('click', () => {
        if (!isListening) {
            isListening = true;
            controlBtn.textContent = "Naciśnij klawisz...";

            const keyHandler = (e) => {
                e.preventDefault();
                const key = e.code;

                // Zaktualizuj konfigurację
                formConfig.playerControls.player1.right = key;
                controlBtn.textContent = `Skręt w prawo: ${key}`;

                // Wyłącz nasłuchiwanie
                document.removeEventListener('keydown', keyHandler);
                isListening = false;
            };

            document.addEventListener('keydown', keyHandler);
        }
    });
});