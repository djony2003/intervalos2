const noteSteps = {
    "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11
};

const stepsToNote = Object.keys(noteSteps).reduce((acc, key) => {
    acc[noteSteps[key]] = key;
    return acc;
}, {});

function getNoteByStep(startNote, stepOffset) {
    const startStep = noteSteps[startNote];
    const targetStep = (startStep + stepOffset) % 12;
    return stepsToNote[targetStep];
}

function generateChordNotes(tonic, type, intervals) {
    let notes = [{ note: tonic, interval: "Tônica" }];
    if (type === "m") {
        notes.push({ note: getNoteByStep(tonic, 3), interval: "Terça menor" });
    } else if (type === "dim") {
        notes.push({ note: getNoteByStep(tonic, 3), interval: "Terça menor" });
        notes.push({ note: getNoteByStep(tonic, 6), interval: "Quinta diminuta" });
    } else if (type === "aug") {
        notes.push({ note: getNoteByStep(tonic, 4), interval: "Terça maior" });
        notes.push({ note: getNoteByStep(tonic, 8), interval: "Quinta aumentada" });
    } else {
        notes.push({ note: getNoteByStep(tonic, 4), interval: "Terça maior" });
    }
    notes.push({ note: getNoteByStep(tonic, 7), interval: "Quinta justa" });

    intervals.forEach(interval => {
        switch (interval) {
            case "4":
                notes.push({ note: getNoteByStep(tonic, 5), interval: "Quarta justa" });
                break;
            case "b5":
                notes.push({ note: getNoteByStep(tonic, 6), interval: "Quinta diminuta" });
                break;
            case "#5":
                notes.push({ note: getNoteByStep(tonic, 8), interval: "Quinta aumentada" });
                break;
            case "6":
                notes.push({ note: getNoteByStep(tonic, 9), interval: "Sexta maior" });
                break;
            case "b9":
                notes.push({ note: getNoteByStep(tonic, 1), interval: "Nona bemol" });
                break;
            case "9":
                notes.push({ note: getNoteByStep(tonic, 2), interval: "Nona" });
                break;
            case "11":
                notes.push({ note: getNoteByStep(tonic, 5), interval: "Décima primeira" });
                break;
            case "13":
                notes.push({ note: getNoteByStep(tonic, 9), interval: "Décima terceira" });
                break;
            case "#13":
                notes.push({ note: getNoteByStep(tonic, 10), interval: "Décima terceira aumentada" });
                break;
        }
    });

    return notes;
}

document.getElementById('buildChord').addEventListener('click', () => {
    const tonic = document.getElementById('tonic').value;
    const type = document.getElementById('type').value;
    const intervals = Array.from(document.getElementById('intervals').selectedOptions).map(option => option.value).slice(0, 3);
    const bass = document.getElementById('bass').value;

    let chord = `${tonic}`;
    if (type) {
        chord += type;
    }
    if (intervals.length > 0) {
        chord += intervals.map((interval, index) => index === 0 ? '/' + interval : '/' + interval).join('');
    }
    if (bass) {
        chord += `/${bass}`;
    }

    document.getElementById('result').innerText = `Acorde: ${chord}`;

    // Gerar e mostrar as notas do acorde
    const notes = generateChordNotes(tonic, type, intervals);
    const notesContainer = document.getElementById('notes');
    notesContainer.innerHTML = '';
    notes.forEach(noteObj => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `<span class="note-label">${noteObj.interval}:</span> <span>${noteObj.note}</span>`;
        notesContainer.appendChild(noteItem);
    });
    if (bass) {
        const bassItem = document.createElement('div');
        bassItem.className = 'note-item';
        bassItem.innerHTML = `<span class="note-label">Baixo:</span> <span>${bass}</span>`;
        notesContainer.appendChild(bassItem);
    }
});
