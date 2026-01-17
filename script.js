const csvFile = document.getElementById('csvFile');
const card = document.getElementById('card');
const gameContainer = document.getElementById('gameContainer');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
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

// --- FUNCIÓN DE PARSEO CORREGIDA ---
function parseCSV(text) {
    const lines = text.split(/\r?\n/); // Dividir por líneas
    flashcards = [];

    lines.forEach(line => {
        if (!line.trim()) return; // Ignorar líneas vacías

        // Usamos esta función auxiliar para dividir respetando comillas
        const cols = splitCSVLine(line);

        // Validamos que tenga al menos Pregunta (A) y Respuesta (B)
        if (cols.length >= 2) {
            flashcards.push({ 
                q: cols[0].trim(), 
                a: cols[1].trim() 
            });
        }
    });

    if (flashcards.length > 0) {
        initGame();
    } else {
        alert("No se pudieron leer preguntas. Verifica el formato del archivo.");
    }
}

// Analizador carácter por carácter (Infalible para comillas y comas)
function splitCSVLine(text) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"') {
            // Si detectamos comillas dobles ("") dentro de comillas, es una comilla literal
            if (inQuotes && text[i + 1] === '"') {
                current += '"';
                i++; // Saltar la siguiente comilla
            } else {
                inQuotes = !inQuotes; // Entrar o salir de modo "texto citado"
            }
        } else if (char === ',' && !inQuotes) {
            // Si hay coma y NO estamos en comillas, es separador
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current); // Añadir el último campo
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

function updateUI() {
    card.classList.remove('is-flipped');
    
    setTimeout(() => {
        // Limpieza visual extra por si quedaron comillas al inicio/final
        let q = flashcards[currentIndex].q.replace(/^"|"$/g, '');
        let a = flashcards[currentIndex].a.replace(/^"|"$/g, '');

        questionText.textContent = q;
        answerText.textContent = a;
        progress.textContent = `${currentIndex + 1} / ${flashcards.length}`;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === flashcards.length - 1;
    }, 150);
}

card.addEventListener('click', () => card.classList.toggle('is-flipped'));

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