const quizData = {
    categories: {
        vocabulary: {
            name: "Woordenschat",
            icon: "fa-book",
            questions: [
                {
                    level: "A1",
                    question: "Wat is het juiste artikel: ___ tafel?",
                    options: ["de", "het"],
                    correct: "de",
                    hint: "Meubels zijn meestal 'de' woorden."
                },
                {
                    level: "A2",
                    question: "Welk woord past niet in de groep?",
                    options: ["appel", "banaan", "boek", "peer"],
                    correct: "boek",
                    hint: "Denk aan categorieën: fruit vs. andere objecten."
                },
                {
                    level: "A1",
                    question: "Kies het juiste woord voor 'house':",
                    options: ["huis", "hond", "kat", "boom"],
                    correct: "huis",
                    hint: "Dit is een gebouw waar mensen wonen."
                }
            ]
        },
        grammar: {
            name: "Grammatica",
            icon: "fa-book-reader",
            questions: [
                {
                    level: "A1",
                    question: "Kies de juiste vorm van 'zijn': Ik ___ student.",
                    options: ["ben", "bent", "is", "zijn"],
                    correct: "ben",
                    hint: "Met 'ik' gebruiken we de eerste persoon enkelvoud."
                },
                {
                    level: "A2",
                    question: "Welke zin is grammaticaal correct?",
                    options: [
                        "Ik naar huis ga.",
                        "Ik ga naar huis.",
                        "Ik gaan naar huis.",
                        "Naar huis ik ga."
                    ],
                    correct: "Ik ga naar huis.",
                    hint: "In Nederlandse hoofdzinnen staat het werkwoord op de tweede plaats."
                }
            ]
        },
        listening: {
            name: "Luisteren",
            icon: "fa-headphones",
            questions: [
                {
                    level: "A1",
                    type: "audio",
                    question: "Luister naar de zin en kies de juiste betekenis:",
                    audio: "Ik woon in Nederland",
                    options: [
                        "I live in the Netherlands",
                        "I work in the Netherlands",
                        "I study in the Netherlands",
                        "I travel in the Netherlands"
                    ],
                    correct: "I live in the Netherlands",
                    hint: "Let op het werkwoord 'wonen'."
                },
                {
                    level: "A2",
                    type: "audio",
                    question: "Luister naar de dialoog en beantwoord de vraag:",
                    audio: "Hallo, hoe gaat het met je? - Met mij gaat het goed, dank je wel!",
                    options: [
                        "Ze praten over het weer",
                        "Ze begroeten elkaar",
                        "Ze nemen afscheid",
                        "Ze maken een afspraak"
                    ],
                    correct: "Ze begroeten elkaar",
                    hint: "Dit is een typische Nederlandse begroeting."
                },
                {
                    level: "B1",
                    type: "audio",
                    question: "Luister naar de weersvoorspelling en kies het juiste antwoord:",
                    audio: "Morgen wordt het zonnig met een temperatuur van ongeveer twintig graden.",
                    options: [
                        "Het gaat regenen",
                        "Het wordt bewolkt",
                        "Het wordt zonnig",
                        "Het gaat sneeuwen"
                    ],
                    correct: "Het wordt zonnig",
                    hint: "Let op het woord 'zonnig' in de audio."
                }
            ]
        },
        pronunciation: {
            name: "Uitspraak",
            icon: "fa-microphone",
            questions: [
                {
                    level: "A1",
                    type: "speak",
                    question: "Spreek de volgende zin uit:",
                    text: "Goedemorgen",
                    expectedPronunciation: "ɣudəˈmɔrɣə(n)",
                    options: ["Opnieuw proberen", "Volgende vraag", "Hint bekijken", "Audio afspelen"],
                    hint: "De 'g' wordt uitgesproken als een zachte keelklank."
                },
                {
                    level: "A2",
                    type: "speak",
                    question: "Spreek deze moeilijke woorden uit:",
                    text: "Scheveningen",
                    expectedPronunciation: "ˈsxeːvənɪŋə(n)",
                    options: ["Opnieuw proberen", "Volgende vraag", "Hint bekijken", "Audio afspelen"],
                    hint: "De 'sch' wordt uitgesproken als 's' + zachte 'g'."
                },
                {
                    level: "B1",
                    type: "speak",
                    question: "Spreek deze tongbreker uit:",
                    text: "De kat krabt de krullen van de trap",
                    expectedPronunciation: "də kɑt krɑpt də krʏlə vɑn də trɑp",
                    options: ["Opnieuw proberen", "Volgende vraag", "Hint bekijken", "Audio afspelen"],
                    hint: "Focus op de 'kr' klanken en spreek langzaam uit."
                }
            ]
        }
    }
};

let currentCategory = null;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let categoryResults = {};
let recognition = null;
let synthesis = null;

function initializeQuiz() {
    score = 0;
    correctAnswers = 0;
    currentQuestionIndex = 0;
    categoryResults = {};
    
    // Web Speech API'lerini başlat
    initializeSpeechAPIs();
    
    document.getElementById('score').textContent = score;
    document.getElementById('correct-count').textContent = correctAnswers;
    
    displayCategories();
    updateProgressBar();
}

function initializeSpeechAPIs() {
    // Speech Recognition için
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'nl-NL';
        
        recognition.onresult = handleSpeechResult;
        recognition.onerror = handleSpeechError;
    }
    
    // Speech Synthesis için
    if ('speechSynthesis' in window) {
        synthesis = window.speechSynthesis;
    }
}

function displayCategories() {
    const container = document.getElementById('category-container');
    container.innerHTML = '';
    
    Object.entries(quizData.categories).forEach(([key, category]) => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.innerHTML = `
            <i class="fas ${category.icon}"></i>
            ${category.name}
        `;
        button.onclick = () => {
            // Aktif kategoriyi güncelle
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectCategory(key);
        };
        container.appendChild(button);
    });
}

function selectCategory(categoryKey) {
    currentCategory = categoryKey;
    currentQuestionIndex = 0;
    displayQuestion();
}

function displayQuestion() {
    const category = quizData.categories[currentCategory];
    const question = category.questions[currentQuestionIndex];
    
    document.getElementById('question-category').textContent = category.name;
    document.getElementById('question-icon').className = `fas ${category.icon}`;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';
    
    if (question.type === 'audio') {
        const audioButton = document.createElement('button');
        audioButton.className = 'btn btn-primary audio-button mb-3';
        audioButton.innerHTML = '<i class="fas fa-play"></i> Audio afspelen';
        audioButton.onclick = () => playAudio(question.audio);
        optionsContainer.appendChild(audioButton);
    }
    
    if (question.type === 'speak') {
        const speakButton = document.createElement('button');
        speakButton.className = 'btn btn-primary speak-button mb-3';
        speakButton.innerHTML = '<i class="fas fa-microphone"></i> Start opname';
        speakButton.onclick = startSpeechRecognition;
        optionsContainer.appendChild(speakButton);
        
        const listenButton = document.createElement('button');
        listenButton.className = 'btn btn-info mb-3 ms-2';
        listenButton.innerHTML = '<i class="fas fa-volume-up"></i> Voorbeeld beluisteren';
        listenButton.onclick = () => playAudio(question.text);
        optionsContainer.appendChild(listenButton);
    }
    
    question.options.forEach((option, index) => {
        const optionContainer = document.createElement('div');
        optionContainer.className = 'option-container mb-2';
        optionContainer.innerHTML = `
            <label class="w-100 p-3 rounded" style="cursor: pointer;">
                <input type="radio" name="answer" value="${option}" style="display: none;">
                ${option}
            </label>
        `;
        optionContainer.onclick = () => {
            selectAnswer(optionContainer);
            // Kontrol butonunu aktif hale getir
            const checkButton = document.querySelector('.btn-primary[onclick="checkAnswer()"]');
            if (checkButton) {
                checkButton.disabled = false;
            }
        };
        optionsContainer.appendChild(optionContainer);
    });
    
    // Kontrol butonunu başlangıçta devre dışı bırak
    const checkButton = document.querySelector('.btn-primary[onclick="checkAnswer()"]');
    if (checkButton) {
        checkButton.disabled = true;
    }
    
    updateProgressBar();
}

function selectAnswer(container) {
    // Önceki seçimleri temizle
    document.querySelectorAll('.option-container').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Yeni seçimi işaretle
    container.classList.add('selected');
    const radio = container.querySelector('input[type="radio"]');
    radio.checked = true;
}

function playAudio(text) {
    if (synthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.9; // Biraz yavaş konuşma hızı
        synthesis.speak(utterance);
    }
}

function startSpeechRecognition() {
    if (recognition) {
        recognition.start();
        showFeedback('info', 'Luisteren... Spreek nu.');
    } else {
        showFeedback('warning', 'Speech recognition is niet beschikbaar in uw browser.');
    }
}

function handleSpeechResult(event) {
    const spokenText = event.results[0][0].transcript.toLowerCase();
    const currentQuestion = quizData.categories[currentCategory].questions[currentQuestionIndex];
    
    // Basit benzerlik kontrolü
    const similarity = calculateSimilarity(spokenText, currentQuestion.text.toLowerCase());
    
    if (similarity > 0.8) {
        score += calculateScore(currentQuestion.level);
        correctAnswers++;
        showFeedback('success', 'Uitstekende uitspraak! 🎉');
    } else {
        showFeedback('warning', `Probeer het nog eens. Juiste uitspraak: ${currentQuestion.text}`);
    }
    
    updateStats();
}

function handleSpeechError(event) {
    showFeedback('danger', 'Er is een fout opgetreden bij de spraakherkenning. Probeer het opnieuw.');
}

function calculateSimilarity(str1, str2) {
    // Levenshtein mesafesi hesaplama
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1,
                track[j - 1][i] + 1,
                track[j - 1][i - 1] + indicator
            );
        }
    }
    
    return 1 - (track[str2.length][str1.length] / Math.max(str1.length, str2.length));
}

function calculateScore(level) {
    const scoreMap = {
        'A1': 10,
        'A2': 20,
        'B1': 30,
        'B2': 40
    };
    return scoreMap[level] || 10;
}

function showHint() {
    const question = quizData.categories[currentCategory].questions[currentQuestionIndex];
    showFeedback('info', `💡 Hint: ${question.hint}`);
}

function showFeedback(type, message) {
    const feedbackContainer = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct-count').textContent = correctAnswers;
    updateLevel();
    updateProgressBar();
}

function updateLevel() {
    const level = calculateLevel();
    document.getElementById('current-level').textContent = level;
}

function calculateLevel() {
    const percentage = (correctAnswers / (currentQuestionIndex + 1)) * 100;
    if (percentage >= 90) return 'B2';
    if (percentage >= 75) return 'B1';
    if (percentage >= 60) return 'A2';
    return 'A1';
}

function updateProgressBar() {
    const category = quizData.categories[currentCategory];
    if (!category) return;
    
    const progress = ((currentQuestionIndex + 1) / category.questions.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
}

function showQuizOver() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('quiz-over').style.display = 'block';
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-correct').textContent = correctAnswers;
    document.getElementById('final-level').textContent = calculateLevel();
    
    displayCategoryResults();
}

function displayCategoryResults() {
    const resultsList = document.getElementById('category-results-list');
    resultsList.innerHTML = '';
    
    Object.entries(categoryResults).forEach(([category, results]) => {
        const percentage = Math.round((results.correct / results.total) * 100);
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `
            <strong>${quizData.categories[category].name}:</strong> 
            ${results.correct}/${results.total} correct (${percentage}%)
        `;
        resultsList.appendChild(li);
    });
}

function restartQuiz() {
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('quiz-over').style.display = 'none';
    initializeQuiz();
}

function checkAnswer() {
    const selectedAnswer = document.querySelector('.option-container.selected');
    if (!selectedAnswer) {
        showFeedback('warning', 'Kies eerst een antwoord! / Please select an answer first!');
        return;
    }
    
    const category = quizData.categories[currentCategory];
    const question = category.questions[currentQuestionIndex];
    const userAnswer = selectedAnswer.querySelector('input[type="radio"]').value;
    const isCorrect = userAnswer === question.correct;
    
    if (isCorrect) {
        score += calculateScore(question.level);
        correctAnswers++;
        showFeedback('success', 'Correct! 🎉');
    } else {
        showFeedback('danger', `Helaas, het juiste antwoord was: ${question.correct}`);
    }
    
    updateStats();
    
    if (!categoryResults[currentCategory]) {
        categoryResults[currentCategory] = { total: 0, correct: 0 };
    }
    categoryResults[currentCategory].total++;
    if (isCorrect) categoryResults[currentCategory].correct++;
    
    // Kontrol butonunu devre dışı bırak
    const checkButton = document.querySelector('.btn-primary[onclick="checkAnswer()"]');
    if (checkButton) {
        checkButton.disabled = true;
    }
    
    setTimeout(() => {
        if (currentQuestionIndex < quizData.categories[currentCategory].questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            showQuizOver();
        }
    }, 2000);
}

// Stil eklemeleri
const style = document.createElement('style');
style.textContent = `
    .option-container {
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    .option-container:hover {
        background-color: #f8f9fa;
        transform: translateX(10px);
    }
    
    .option-container.selected {
        background-color: #e3f2fd;
        border-color: #2196f3;
    }
    
    .recording-animation {
        animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Quiz'i başlat
window.onload = initializeQuiz; 