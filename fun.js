// Grabar voz usando Web Speech API
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
}

recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.getElementById('recordButton').addEventListener('click', function () {
    recognition.start();
});

recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('promptInput').value = transcript;
};

recognition.onspeechend = function () {
    recognition.stop();
};

// Enviar prompt al API y reproducir la respuesta
document.getElementById('sendButton').addEventListener('click', function () {
    const prompt = document.getElementById('promptInput').value;
    const apiKey = 'AIzaSyBhHYEGpFfGiQfKGU4udecPt_bT6sCtqko'; // Reemplaza esto con tu clave de API real 

    if (prompt.trim() === '') {
        alert('Por favor, escribe un prompt.');
        return;
    }

    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

    const requestBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            const responseContainer = document.getElementById('responseContainer');
            if (data.error) {
                responseContainer.textContent = `Error: ${data.error.message}`;
            } else {
                const textResponse = data.candidates[0]?.content?.parts[0]?.text || 'No response text available';
                responseContainer.textContent = textResponse;
                speakResponse(textResponse); // Reproducir la respuesta
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('responseContainer').textContent = 'Error: ' + error;
        });
});

// Función para convertir texto a voz
function speakResponse(text) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'es-ES'; // Cambiar el idioma si es necesario
    synth.speak(utterThis);
}
