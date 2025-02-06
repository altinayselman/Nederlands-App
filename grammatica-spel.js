const grammarExercises = {
    level1: {
        name: 'Niveau 1 - Basis',
        rules: [
            {
                title: 'De/Het Artikelen',
                description: 'In het Nederlands hebben we twee lidwoorden: "de" en "het". "De" wordt gebruikt voor mannelijke en vrouwelijke woorden, "het" voor onzijdige woorden.',
                icon: 'fas fa-font',
                example: 'de man, de vrouw, het kind, het huis',
                exercises: [
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ boek ligt op tafel.',
                        options: ['de', 'het'],
                        correct: 'het',
                        hint: 'Een boek is een onzijdig woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ telefoon is nieuw.',
                        options: ['de', 'het'],
                        correct: 'de',
                        hint: 'Een telefoon is een de-woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ computer staat op het bureau.',
                        options: ['de', 'het'],
                        correct: 'de',
                        hint: 'Een computer is een de-woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ huis is groot.',
                        options: ['de', 'het'],
                        correct: 'het',
                        hint: 'Een huis is een onzijdig woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ tafel is bruin.',
                        options: ['de', 'het'],
                        correct: 'de',
                        hint: 'Een tafel is een de-woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ raam staat open.',
                        options: ['de', 'het'],
                        correct: 'het',
                        hint: 'Een raam is een onzijdig woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ school is dichtbij.',
                        options: ['de', 'het'],
                        correct: 'de',
                        hint: 'Een school is een de-woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ meisje speelt buiten.',
                        options: ['de', 'het'],
                        correct: 'het',
                        hint: 'Een meisje is een onzijdig woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ auto is rood.',
                        options: ['de', 'het'],
                        correct: 'de',
                        hint: 'Een auto is een de-woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ bed is nieuw.',
                        options: ['de', 'het'],
                        correct: 'het',
                        hint: 'Een bed is een onzijdig woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ fiets staat buiten.',
                        options: ['de', 'het'],
                        correct: 'de',
                        hint: 'Een fiets is een de-woord.'
                    },
                    {
                        question: 'Kies het juiste lidwoord:',
                        context: '_____ kantoor is gesloten.',
                        options: ['de', 'het'],
                        correct: 'het',
                        hint: 'Een kantoor is een onzijdig woord.'
                    }
                ]
            },
            {
                title: 'Werkwoord "zijn" (to be)',
                description: 'Het werkwoord "zijn" is onregelmatig en wordt veel gebruikt. Leer de verschillende vormen.',
                icon: 'fas fa-equals',
                example: 'ik ben, jij bent, hij/zij/het is, wij zijn, jullie zijn, zij zijn',
                exercises: [
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Wij _____ studenten.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'zijn',
                        hint: 'Met "wij" gebruik je de meervoudsvorm.'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Ik _____ een leraar.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'ben',
                        hint: 'Met "ik" gebruik je "ben".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Hij _____ mijn broer.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'is',
                        hint: 'Met "hij" gebruik je "is".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Jullie _____ te laat.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'zijn',
                        hint: 'Met "jullie" gebruik je "zijn".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Jij _____ een goede student.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'bent',
                        hint: 'Met "jij" gebruik je "bent".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Het meisje _____ ziek.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'is',
                        hint: 'Met "het meisje" gebruik je "is".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Zij (enkelvoud) _____ mijn zus.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'is',
                        hint: 'Met "zij" (enkelvoud) gebruik je "is".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Zij (meervoud) _____ mijn vrienden.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'zijn',
                        hint: 'Met "zij" (meervoud) gebruik je "zijn".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'U _____ welkom.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'bent',
                        hint: 'Met "u" gebruik je "bent" (formeel).'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'De kinderen _____ op school.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'zijn',
                        hint: 'Met een meervoud gebruik je "zijn".'
                    },
                    {
                        question: 'Vul de juiste vorm van "zijn" in:',
                        context: 'Het boek _____ interessant.',
                        options: ['ben', 'bent', 'is', 'zijn'],
                        correct: 'is',
                        hint: 'Met "het boek" gebruik je "is".'
                    }
                ]
            }
        ]
    },
    level2: {
        name: 'Niveau 2 - Gemiddeld',
        rules: [
            {
                title: 'Woordvolgorde in hoofdzinnen',
                description: 'In Nederlandse hoofdzinnen staat het werkwoord op de tweede plaats (V2-regel).',
                icon: 'fas fa-sort-numeric-down',
                example: 'Vandaag ga ik naar school. (Tijd + Werkwoord + Onderwerp + Rest)',
                exercises: [
                    {
                        question: 'Kies de juiste woordvolgorde:',
                        context: 'Selecteer de correcte zin:',
                        options: [
                            'Morgen ik ga naar de stad',
                            'Morgen ga ik naar de stad',
                            'Ik morgen ga naar de stad'
                        ],
                        correct: 'Morgen ga ik naar de stad',
                        hint: 'Het werkwoord moet op de tweede plaats staan.'
                    }
                ]
            },
            {
                title: 'Voltooide tijd (Present Perfect)',
                description: 'De voltooide tijd wordt gevormd met hebben/zijn + voltooid deelwoord.',
                icon: 'fas fa-clock',
                example: 'Ik heb gegeten, Hij is gekomen',
                exercises: [
                    {
                        question: 'Kies de juiste vorm:',
                        context: 'Hij _____ naar huis gegaan.',
                        options: ['heeft', 'is', 'ben', 'hebt'],
                        correct: 'is',
                        hint: 'Bij bewegingswerkwoorden gebruik je "zijn".'
                    }
                ]
            }
        ]
    },
    level3: {
        name: 'Niveau 3 - Gevorderd',
        rules: [
            {
                title: 'Bijzinnen met "dat", "omdat", "wanneer"',
                description: 'In bijzinnen staat het werkwoord aan het einde van de zin.',
                icon: 'fas fa-link',
                example: 'Ik weet dat hij morgen komt. (werkwoord "komt" staat achteraan)',
                exercises: [
                    {
                        question: 'Kies de juiste woordvolgorde:',
                        context: 'Selecteer de correcte bijzin:',
                        options: [
                            'omdat hij is ziek',
                            'omdat hij ziek is',
                            'omdat is hij ziek'
                        ],
                        correct: 'omdat hij ziek is',
                        hint: 'In een bijzin staat het werkwoord aan het einde.'
                    }
                ]
            },
            {
                title: 'Passieve vorm (Lijdende vorm)',
                description: 'De passieve vorm wordt gemaakt met worden/zijn + voltooid deelwoord.',
                icon: 'fas fa-exchange-alt',
                example: 'De brief wordt geschreven. Het huis is verkocht.',
                exercises: [
                    {
                        question: 'Maak de passieve zin:',
                        context: 'Het rapport _____ door de manager geschreven.',
                        options: ['wordt', 'worden', 'is', 'zijn'],
                        correct: 'wordt',
                        hint: 'Gebruik de tegenwoordige tijd enkelvoud van "worden".'
                    }
                ]
            }
        ]
    }
};

let currentLevel = 'level1';
let currentRuleIndex = 0;
let currentExerciseIndex = 0;
let score = 0;
let correctCount = 0;
let selectedAnswer = null;
let learnedRules = new Set();

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
                ${Object.entries(grammarExercises).map(([key, level]) => 
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
    currentRuleIndex = 0;
    currentExerciseIndex = 0;
    score = 0;
    correctCount = 0;
    selectedAnswer = null;
    learnedRules = new Set();
    
    // Tüm alıştırmaları tek bir dizide topla
    let allExercises = [];
    grammarExercises[currentLevel].rules.forEach(rule => {
        rule.exercises.forEach(exercise => {
            // Her alıştırmaya kural bilgisini ekle
            allExercises.push({
                ...exercise,
                ruleTitle: rule.title,
                ruleDescription: rule.description,
                ruleIcon: rule.icon,
                ruleExample: rule.example
            });
        });
    });
    
    // Tüm alıştırmaları karıştır
    allExercises = shuffleArray(allExercises);
    
    // Karıştırılmış alıştırmaları tek bir kural altında topla
    grammarExercises[currentLevel].rules = [{
        title: 'Gemengde oefeningen',
        description: 'Gemengde oefeningen over lidwoorden en het werkwoord "zijn"',
        icon: 'fas fa-random',
        exercises: allExercises
    }];
    
    updateUI();
    showCurrentRule();
}

// Diziyi karıştırmak için yardımcı fonksiyon
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('grammar-rule').textContent = currentRuleIndex + 1;
    
    const totalExercises = getTotalExercises();
    const completedExercises = getCompletedExercises();
    const progress = (completedExercises / totalExercises) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    document.getElementById('game').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

function getTotalExercises() {
    return grammarExercises[currentLevel].rules.reduce((total, rule) => 
        total + rule.exercises.length, 0);
}

function getCompletedExercises() {
    let completed = 0;
    for (let i = 0; i < currentRuleIndex; i++) {
        completed += grammarExercises[currentLevel].rules[i].exercises.length;
    }
    completed += currentExerciseIndex;
    return completed;
}

function showCurrentRule() {
    const rule = grammarExercises[currentLevel].rules[currentRuleIndex];
    const exercise = rule.exercises[currentExerciseIndex];
    
    // Kural bilgilerini göster (her alıştırmanın kendi kural bilgisini kullan)
    document.getElementById('rule-icon').className = exercise.ruleIcon;
    document.getElementById('rule-title').textContent = exercise.ruleTitle;
    document.getElementById('rule-description').textContent = exercise.ruleDescription;
    document.getElementById('rule-example').textContent = exercise.ruleExample;
    
    // Alıştırma bilgilerini göster
    document.getElementById('exercise-question').textContent = exercise.question;
    document.getElementById('exercise-context').textContent = exercise.context;
    
    // Seçenekleri karıştır
    const shuffledOptions = shuffleArray([...exercise.options]);
    
    // Seçenekleri oluştur
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = shuffledOptions.map((option, index) => `
        <div class="form-check mb-2">
            <label class="form-check-label w-100" style="cursor: pointer;">
                <div class="option-container p-3 rounded" onclick="selectAnswerAndHighlight('${option}', this)">
                    <input class="form-check-input" type="radio" name="answer" 
                        id="option${index}" value="${option}" style="display: none;">
                    ${option}
                </div>
            </label>
        </div>
    `).join('');
    
    selectedAnswer = null;
    
    // Seçenek container'larına hover efekti ekle
    const optionContainers = document.querySelectorAll('.option-container');
    optionContainers.forEach(container => {
        container.style.transition = 'all 0.3s ease';
        container.style.backgroundColor = '#f8f9fa';
        container.style.border = '2px solid transparent';
    });
}

function selectAnswerAndHighlight(answer, element) {
    selectedAnswer = answer;
    
    // Tüm seçeneklerin vurgusunu kaldır
    document.querySelectorAll('.option-container').forEach(container => {
        container.style.backgroundColor = '#f8f9fa';
        container.style.border = '2px solid transparent';
    });
    
    // Seçilen seçeneği vurgula
    element.style.backgroundColor = '#e3f2fd';
    element.style.border = '2px solid #2196f3';
    
    // Radio button'u seç
    const radio = element.querySelector('input[type="radio"]');
    radio.checked = true;
}

function showHint() {
    const rule = grammarExercises[currentLevel].rules[currentRuleIndex];
    const exercise = rule.exercises[currentExerciseIndex];
    
    showFeedback('info', `💡 Hint: ${exercise.hint}`);
}

function checkAnswer() {
    if (!selectedAnswer) {
        showFeedback('warning', 'Kies eerst een antwoord!');
        return;
    }
    
    const rule = grammarExercises[currentLevel].rules[currentRuleIndex];
    const exercise = rule.exercises[currentExerciseIndex];
    
    if (selectedAnswer === exercise.correct) {
        score += 10;
        correctCount++;
        learnedRules.add(rule.title);
        showFeedback(true, 'Correct! Goed gedaan! 🎉');
        
        setTimeout(() => {
            nextExercise();
        }, 2000);
    } else {
        showFeedback(false, `
            Niet correct. Het juiste antwoord is: "${exercise.correct}"<br>
            <small>${exercise.hint}</small>
        `);
    }
    
    updateUI();
}

function nextExercise() {
    const rules = grammarExercises[currentLevel].rules;
    const currentRule = rules[currentRuleIndex];
    
    if (currentExerciseIndex < currentRule.exercises.length - 1) {
        // Sonraki alıştırmaya geç
        currentExerciseIndex++;
    } else if (currentRuleIndex < rules.length - 1) {
        // Sonraki kurala geç
        currentRuleIndex++;
        currentExerciseIndex = 0;
    } else {
        // Oyun bitti
        endGame();
        return;
    }
    
    updateUI();
    showCurrentRule();
}

function showFeedback(type, message) {
    const feedbackContainer = document.getElementById('feedback-container');
    let feedbackClass = 'alert-info';
    
    if (type === true) feedbackClass = 'alert-success';
    else if (type === false) feedbackClass = 'alert-danger';
    else if (type === 'warning') feedbackClass = 'alert-warning';
    
    feedbackContainer.innerHTML = `
        <div class="alert ${feedbackClass} mt-3">
            ${message}
        </div>
    `;
    
    setTimeout(() => {
        feedbackContainer.innerHTML = '';
    }, 4000);
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-correct').textContent = correctCount;
    
    // Öğrenilen kuralları listele
    const rulesList = document.getElementById('learned-rules-list');
    rulesList.innerHTML = Array.from(learnedRules).map(rule => `
        <li class="mb-2">
            <i class="fas fa-check-circle text-success"></i>
            ${rule}
        </li>
    `).join('');
}

function restartGame() {
    resetGame();
}

// Oyunu başlat
initGame(); 