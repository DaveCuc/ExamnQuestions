const csvFile = document.getElementById('csvFile');
const card = document.getElementById('card');
const gameContainer = document.getElementById('gameContainer');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn'); // Nuevo selector
const progress = document.getElementById('progress');
const resetBtn = document.getElementById('resetBtn');

let flashcards = [];
let currentIndex = 0;

csvFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => parseCSV(event.target.result);
    reader.readAsText(file);
});

function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    flashcards = [];

    lines.forEach(line => {
        if (!line.trim()) return;
        const cols = splitCSVLine(line);
        if (cols.length >= 2) {
            flashcards.push({ q: cols[0].trim(), a: cols[1].trim() });
        }
    });

    if (flashcards.length > 0) {
        initGame();
    } else {
        alert("No se pudieron leer preguntas.");
    }
}

// Parser robusto (Mantenemos el que ya funciona)
function splitCSVLine(text) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            if (inQuotes && text[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

function initGame() {
    currentIndex = 0;
    document.querySelector('.upload-section').style.display = 'none';
    gameContainer.style.display = 'flex';
    gameContainer.style.flexDirection = 'column';
    gameContainer.style.alignItems = 'center';
    updateUI();
}

// --- NUEVA FUNCIÓN PARA MEZCLAR ---
function shuffleFlashcards() {
    // Algoritmo Fisher-Yates
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    // Reiniciar al principio
    currentIndex = 0;
    // Efecto visual: Aseguramos que la carta muestre el frente
    card.classList.remove('is-flipped');
    updateUI();
}

function updateUI() {
    card.classList.remove('is-flipped');
    
    setTimeout(() => {
        let q = flashcards[currentIndex].q.replace(/^"|"$/g, '');
        let a = flashcards[currentIndex].a.replace(/^"|"$/g, '');

        questionText.textContent = q;
        answerText.textContent = a;
        progress.textContent = `${currentIndex + 1} / ${flashcards.length}`;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === flashcards.length - 1;
    }, 150);
}

// --- EVENTOS ---

// Voltear carta
card.addEventListener('click', () => card.classList.toggle('is-flipped'));

// Botón de mezcla
shuffleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic se propague si estuviera dentro de la carta (no es el caso aquí, pero es buena práctica)
    shuffleFlashcards();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
        currentIndex--;
        updateUI();
    }
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        updateUI();
    }
});

resetBtn.addEventListener('click', () => location.reload());