const pronunciationExercises = {
    level1: {
        name: 'Niveau 1 - Basis',
        words: [
            {
                dutch: 'hallo',
                phonetic: 'hah-loh',
                tips: 'De "h" wordt uitgesproken zoals in het Engels "hello". De "a" is kort.',
                icon: 'fas fa-hand-wave'
            },
            {
                dutch: 'goedemorgen',
                phonetic: 'khoo-duh-mor-khun',
                tips: 'De "g" wordt uitgesproken als een zachte keelklank. De "oe" klinkt als "oo" in "boot".',
                icon: 'fas fa-sun'
            },
            {
                dutch: 'dank je wel',
                phonetic: 'dahnk-yuh-vel',
                tips: 'De "a" is kort. De "e" in "je" is een schwa-klank (zoals "uh").',
                icon: 'fas fa-heart'
            },
            {
                dutch: 'alsjeblieft',
                phonetic: 'ahls-yuh-bleeft',
                tips: 'De "ie" klinkt als "ee" in "see". De "f" aan het eind wordt als "v" uitgesproken.',
                icon: 'fas fa-gift'
            },
            {
                dutch: 'tot ziens',
                phonetic: 'tot-zeens',
                tips: 'De "ie" klinkt als een lange "ee". De "s" aan het eind is scherp.',
                icon: 'fas fa-hand-wave'
            },
            {
                dutch: 'welkom',
                phonetic: 'vel-kom',
                tips: 'De "w" klinkt als "v". De "o" is kort.',
                icon: 'fas fa-door-open'
            },
            {
                dutch: 'eet smakelijk',
                phonetic: 'eyt-smah-kuh-luk',
                tips: 'De "ee" klinkt als "ay". De laatste "ijk" klinkt als "uk".',
                icon: 'fas fa-utensils'
            },
            {
                dutch: 'goedenavond',
                phonetic: 'khoo-duh-nah-vont',
                tips: 'De "g" is een keelklank. De "d" aan het eind wordt als "t" uitgesproken.',
                icon: 'fas fa-moon'
            }
        ]
    },
    level2: {
        name: 'Niveau 2 - Gemiddeld',
        words: [
            {
                dutch: 'scheveningen',
                phonetic: 'skhey-vuh-ning-un',
                tips: 'De "sch" is een combinatie van "s" en een zachte keelklank. De "e" is een schwa-klank.',
                icon: 'fas fa-beach-umbrella'
            },
            {
                dutch: 'gezellig',
                phonetic: 'khuh-zel-likh',
                tips: 'De "g" is een keelklank. De laatste "g" wordt zacht uitgesproken.',
                icon: 'fas fa-couch'
            },
            {
                dutch: 'bibliotheek',
                phonetic: 'bee-blee-oh-teyk',
                tips: 'De "th" wordt uitgesproken als "t". De "ee" klinkt als "ay" in "say".',
                icon: 'fas fa-book'
            },
            {
                dutch: 'Nederland',
                phonetic: 'ney-dur-lahnt',
                tips: 'De "d" aan het eind wordt als "t" uitgesproken. De "e" is een schwa-klank.',
                icon: 'fas fa-flag'
            },
            {
                dutch: 'boodschappen',
                phonetic: 'boht-skhah-pun',
                tips: 'De "oo" is lang. De "sch" is een combinatie van "s" en een zachte keelklank.',
                icon: 'fas fa-shopping-cart'
            },
            {
                dutch: 'restaurant',
                phonetic: 'res-to-rahnt',
                tips: 'De "au" klinkt als "o". De "t" aan het eind wordt zacht uitgesproken.',
                icon: 'fas fa-utensils'
            },
            {
                dutch: 'universiteit',
                phonetic: 'uu-ni-ver-si-teit',
                tips: 'De "u" is lang. De "ei" klinkt als "ay" in "say".',
                icon: 'fas fa-university'
            },
            {
                dutch: 'ziekenhuis',
                phonetic: 'zee-kun-huys',
                tips: 'De "ie" klinkt als "ee". De "ui" is een unieke Nederlandse klank.',
                icon: 'fas fa-hospital'
            }
        ]
    },
    level3: {
        name: 'Niveau 3 - Gevorderd',
        words: [
            {
                dutch: 'gebeurtenis',
                phonetic: 'khuh-burt-uh-nis',
                tips: 'Let op de "eu" klank, die uniek is in het Nederlands. De "g" is een keelklank.',
                icon: 'fas fa-calendar'
            },
            {
                dutch: 'verschillende',
                phonetic: 'ver-skhil-len-duh',
                tips: 'De "v" wordt als "f" uitgesproken. De laatste "e" is een schwa-klank.',
                icon: 'fas fa-random'
            },
            {
                dutch: 'waarschijnlijk',
                phonetic: 'vaar-skhein-luk',
                tips: 'De "aa" is lang. De "ij" klinkt als "ei". De laatste "k" wordt zacht uitgesproken.',
                icon: 'fas fa-percentage'
            },
            {
                dutch: 'mogelijkheid',
                phonetic: 'moh-khuh-luk-heit',
                tips: 'De "g" is een keelklank. De "ij" klinkt als "ei".',
                icon: 'fas fa-lightbulb'
            },
            {
                dutch: 'vriendelijkheid',
                phonetic: 'vreen-duh-luk-heit',
                tips: 'De "vr" wordt samen uitgesproken. De "ij" klinkt als "ei".',
                icon: 'fas fa-heart'
            },
            {
                dutch: 'onafhankelijk',
                phonetic: 'on-af-han-kuh-luk',
                tips: 'De "on" is kort. De laatste "ijk" klinkt als "uk".',
                icon: 'fas fa-unlock'
            },
            {
                dutch: 'wetenschappelijk',
                phonetic: 'vey-tun-skhap-puh-luk',
                tips: 'De "w" klinkt als "v". De "e" is een schwa-klank.',
                icon: 'fas fa-microscope'
            },
            {
                dutch: 'verantwoordelijk',
                phonetic: 'vur-ant-voor-duh-luk',
                tips: 'De "v" wordt als "f" uitgesproken. De "oo" is lang.',
                icon: 'fas fa-clipboard-check'
            }
        ]
    }
};

let currentLevel = 'level1';
let currentWordIndex = 0;
let score = 0;
let correctCount = 0;
let words = [];
let isRecording = false;

function initGame() {
    createLevelSelector();
    resetGame();
}

function createLevelSelector() {
    const container = document.getElementById('level-container');
    container.innerHTML = `
        <div class="form-group">
            <label for="level-select" class="form-label">Kies een niveau:</label>
            <select class="form-select" id="level-select" onchange="changeLevel(this.value)">
                ${Object.entries(pronunciationExercises).map(([key, level]) => 
                    `<option value="${key}">${level.name}</option>`
                ).join('')}
            </select>
        </div>
    `;
}

function changeLevel(newLevel) {
    currentLevel = newLevel;
    resetGame();
}

function resetGame() {
    currentWordIndex = 0;
    score = 0;
    correctCount = 0;
    words = [...pronunciationExercises[currentLevel].words];
    shuffleWords();
    updateUI();
    showNextWord();
}

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('current-level').textContent = currentLevel.replace('level', '');
    
    const progress = (currentWordIndex / words.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

function showNextWord() {
    if (currentWordIndex < words.length) {
        const currentWord = words[currentWordIndex];
        
        // Eğer son kelimeyse "Volgende" butonunu "Afronden" olarak değiştir
        const nextButton = document.querySelector('button.btn-primary');
        if (currentWordIndex === words.length - 1) {
            nextButton.innerHTML = `<i class="fas fa-flag-checkered"></i> Afronden`;
        } else {
            nextButton.innerHTML = `<i class="fas fa-forward"></i> Volgende`;
        }
        
        // Kelimeyi göster ve telaffuzu çal
        document.getElementById('current-word').textContent = currentWord.dutch;
        document.getElementById('phonetic').textContent = currentWord.phonetic;
        document.getElementById('tips').textContent = currentWord.tips;
        document.getElementById('word-icon').className = currentWord.icon;
        
        // Otomatik olarak kelimeyi seslendir
        playWord();
    } else {
        endGame();
    }
}

function playWord() {
    const currentWord = words[currentWordIndex];
    const utterance = new SpeechSynthesisUtterance(currentWord.dutch);
    utterance.lang = 'nl-NL';
    utterance.rate = 0.8; // Biraz yavaş konuşma hızı
    window.speechSynthesis.speak(utterance);
}

async function startRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            isRecording = true;
            
            // Kayıt başladığında geri bildirim
            showFeedback('recording', 'Spreek de woord duidelijk uit...');
            
            // Kayıt arayüzünü güncelle
            document.querySelector('.recording-waves').style.display = 'block';
            
            // Web Speech API için tanıma nesnesini oluştur
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'nl-NL';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.start();
            
            recognition.onresult = (event) => {
                const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
                const currentWord = words[currentWordIndex].dutch.toLowerCase();
                const confidence = event.results[0][0].confidence;
                
                console.log('Spoken:', spokenWord, 'Expected:', currentWord, 'Confidence:', confidence);
                
                checkPronunciation(spokenWord, currentWord, confidence, stream);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                showFeedback(false, 'Er is een fout opgetreden. Probeer het opnieuw.');
                stopRecording(stream, false);
            };
            
            // 5 saniye sonra kaydı durdur
            setTimeout(() => {
                recognition.stop();
            }, 5000);
            
        } catch (err) {
            console.error('Microphone error:', err);
            showFeedback(false, 'Microfoon toegang geweigerd. Controleer uw browserinstellingen.');
        }
    }
}

function checkPronunciation(spokenWord, expectedWord, confidence, stream) {
    // Kelime karşılaştırması için temizleme
    spokenWord = spokenWord.replace(/[.,!?]/g, '').trim();
    expectedWord = expectedWord.replace(/[.,!?]/g, '').trim();
    
    // Telaffuz doğruluğunu kontrol et
    const isCorrect = spokenWord === expectedWord && confidence > 0.7;
    const isClose = calculateSimilarity(spokenWord, expectedWord) > 0.8;
    
    if (isCorrect) {
        score += 10;
        correctCount++;
        showFeedback(true, 'Uitstekend! Je uitspraak was correct.');
        
        // 5 saniye sonra otomatik olarak sonraki kelimeye geç
        setTimeout(() => {
            currentWordIndex++;
            updateUI();
            showNextWord();
        }, 5000);
    } else if (isClose) {
        showFeedback('warning', 'Bijna goed! Let op de uitspraak en probeer het nog eens.');
    } else {
        showFeedback(false, `
            Niet correct. Luister nog een keer en probeer het opnieuw.<br>
            <small>Tips: ${words[currentWordIndex].tips}</small>
        `);
    }
    
    stopRecording(stream, isCorrect);
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
    
    // Benzerlik oranını hesapla (0-1 arası)
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (track[str2.length][str1.length] / maxLength);
}

function stopRecording(stream, wasCorrect) {
    stream.getTracks().forEach(track => track.stop());
    isRecording = false;
    document.querySelector('.recording-waves').style.display = 'none';
    
    if (!wasCorrect) {
        // Yanlış telaffuzda otomatik olarak ses örneğini tekrar çal
        setTimeout(() => {
            playWord();
        }, 2000);
    }
}

function showFeedback(type, message) {
    const feedbackContainer = document.getElementById('feedback-container');
    let feedbackClass = 'alert-info';
    
    if (type === true) feedbackClass = 'alert-success';
    else if (type === false) feedbackClass = 'alert-danger';
    else if (type === 'warning') feedbackClass = 'alert-warning';
    else if (type === 'recording') feedbackClass = 'alert-primary';
    
    feedbackContainer.innerHTML = `
        <div class="alert ${feedbackClass} mt-3">
            ${message}
        </div>
    `;
    
    if (type !== 'recording') {
        setTimeout(() => {
            feedbackContainer.innerHTML = '';
        }, 4000);
    }
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-correct').textContent = correctCount;
}

function restartGame() {
    resetGame();
}

function handleNextWord() {
    // Eğer son kelimeyse ve doğru yapılmadıysa uyarı ver
    if (currentWordIndex === words.length - 1) {
        const confirmed = confirm('Weet je zeker dat je de oefening wilt afronden? Je kunt nog oefenen met de huidige woord.');
        if (confirmed) {
            endGame();
        }
        return;
    }

    // Kullanıcıya onay sor
    const skipConfirmed = confirm('Wil je doorgaan naar het volgende woord? Je kunt nog oefenen met het huidige woord.');
    if (skipConfirmed) {
        // Geçerli kelimeyi atla ve sonrakine geç
        currentWordIndex++;
        updateUI();
        
        // Yeni kelimeyi göster ve seslendir
        showNextWord();
        
        // Bilgilendirme mesajı göster
        showFeedback('info', `
            Je bent naar het volgende woord gegaan.<br>
            <small>Luister goed en probeer de uitspraak te oefenen!</small>
        `);
    }
}

// CSS için animasyon stillerini ekle
const style = document.createElement('style');
style.textContent = `
    .recording-dot {
        color: red;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
    }
    
    .recording-waves {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);

// Oyunu başlat
initGame();

// HTML'deki "Volgende" butonunun onclick olayını güncelle
document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('button.btn-primary');
    nextButton.onclick = handleNextWord;
}); 