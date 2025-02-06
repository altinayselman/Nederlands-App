// Rozet tanımlamaları
const badgeDefinitions = {
    woordmeester: {
        id: 'woordmeester',
        title: 'Woordmeester Badge',
        description: 'Deze badge verdien je door Nederlandse woorden te leren.',
        icon: 'fas fa-book',
        level: 1,
        requirements: {
            wordsLearned: 100,
            accuracy: 75,
            daysStreak: 3
        },
        rewards: {
            xp: 500,
            features: ['Toegang tot gevorderde woordenlijsten', 'Speciale avatar frame']
        }
    },
    grammatica: {
        id: 'grammatica',
        title: 'Grammatica Expert Badge',
        description: 'Deze badge verdien je door grammatica oefeningen te voltooien.',
        icon: 'fas fa-book-reader',
        level: 2,
        requirements: {
            exercisesCompleted: 50,
            accuracy: 80,
            daysStreak: 3
        },
        rewards: {
            xp: 750,
            features: ['Toegang tot gevorderde grammatica oefeningen', 'Speciale avatar frame']
        }
    },
    quiz: {
        id: 'quiz',
        title: 'Quiz Champion Badge',
        description: 'Deze badge verdien je door een hoge score te behalen in de quiz.',
        icon: 'fas fa-crown',
        level: 3,
        requirements: {
            quizScore: 1000,
            accuracy: 90,
            daysStreak: 3
        },
        rewards: {
            xp: 1000,
            features: ['Toegang tot speciale quiz oefeningen', 'Speciale avatar frame']
        }
    },
    luister: {
        id: 'luister',
        title: 'Luister Expert Badge',
        description: 'Deze badge verdien je door luisteroefeningen te voltooien.',
        icon: 'fas fa-headphones',
        level: 4,
        requirements: {
            exercisesCompleted: 25,
            accuracy: 85,
            daysStreak: 3
        },
        rewards: {
            xp: 500,
            features: ['Toegang tot speciale luister oefeningen', 'Speciale avatar frame']
        }
    },
    uitspraak: {
        id: 'uitspraak',
        title: 'Uitspraak Meester Badge',
        description: 'Deze badge verdien je door uitspraakoefeningen te voltooien.',
        icon: 'fas fa-microphone',
        level: 5,
        requirements: {
            exercisesCompleted: 30,
            accuracy: 80,
            daysStreak: 3
        },
        rewards: {
            xp: 750,
            features: ['Toegang tot speciale uitspraak oefeningen', 'Speciale avatar frame']
        }
    },
    zinnen: {
        id: 'zinnen',
        title: 'Zinnen Expert Badge',
        description: 'Deze badge verdien je door zinnen correct te maken.',
        icon: 'fas fa-pencil-alt',
        level: 6,
        requirements: {
            sentencesCompleted: 40,
            accuracy: 75,
            daysStreak: 3
        },
        rewards: {
            xp: 500,
            features: ['Toegang tot speciale zinnen oefeningen', 'Speciale avatar frame']
        }
    }
};

// Kullanıcı verilerini yönetme
let currentUser = null;
let userProgress = null;

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    initializeBadges();
    setupEventListeners();
});

// Rozet sistemini başlat
function initializeBadges() {
    checkLoginStatus();
    if (currentUser) {
        loadUserProgress();
        updateBadgesDisplay();
        updateSummary();
    }
}

// Giriş durumunu kontrol et
function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

// Kullanıcı ilerlemesini yükle
function loadUserProgress() {
    const progress = localStorage.getItem(`progress_${currentUser.id}`);
    userProgress = progress ? JSON.parse(progress) : createDefaultProgress();
}

// Varsayılan ilerleme oluştur
function createDefaultProgress() {
    return {
        words: {
            learned: 0,
            accuracy: 0,
            streak: 0
        },
        grammar: {
            completed: 0,
            accuracy: 0,
            streak: 0
        },
        quiz: {
            score: 0,
            accuracy: 0,
            streak: 0
        },
        listening: {
            completed: 0,
            accuracy: 0,
            streak: 0
        },
        pronunciation: {
            completed: 0,
            accuracy: 0,
            streak: 0
        },
        sentences: {
            completed: 0,
            accuracy: 0,
            streak: 0
        }
    };
}

// Rozet durumunu kontrol et
function checkBadgeStatus(badgeId) {
    const badge = badgeDefinitions[badgeId];
    const progress = userProgress;
    
    switch(badgeId) {
        case 'woordmeester':
            return {
                isUnlocked: progress.words.learned >= badge.requirements.wordsLearned &&
                           progress.words.accuracy >= badge.requirements.accuracy &&
                           progress.words.streak >= badge.requirements.daysStreak,
                progress: (progress.words.learned / badge.requirements.wordsLearned) * 100
            };
        case 'grammatica':
            return {
                isUnlocked: progress.grammar.completed >= badge.requirements.exercisesCompleted &&
                           progress.grammar.accuracy >= badge.requirements.accuracy &&
                           progress.grammar.streak >= badge.requirements.daysStreak,
                progress: (progress.grammar.completed / badge.requirements.exercisesCompleted) * 100
            };
        // Diğer rozetler için benzer kontroller...
    }
}

// Rozet görüntülemesini güncelle
function updateBadgesDisplay() {
    const badgeContainer = document.querySelector('.row');
    badgeContainer.innerHTML = '';

    Object.keys(badgeDefinitions).forEach(badgeId => {
        const badge = badgeDefinitions[badgeId];
        const status = checkBadgeStatus(badgeId);
        
        const badgeElement = createBadgeElement(badge, status);
        badgeContainer.appendChild(badgeElement);
    });
}

// Rozet elementi oluştur
function createBadgeElement(badge, status) {
    const div = document.createElement('div');
    div.className = 'col-md-6 col-lg-4';
    div.dataset.category = status.isUnlocked ? 'unlocked' : 'locked';

    div.innerHTML = `
        <div class="badge-card">
            <div class="badge-card-inner">
                <div class="badge-icon ${status.isUnlocked ? 'unlocked' : ''}">
                    <i class="${badge.icon}"></i>
                    <div class="badge-level">Niveau ${badge.level}</div>
                </div>
                <h3>${badge.title}</h3>
                <p>${badge.description}</p>
                <div class="badge-progress">
                    <div class="progress">
                        <div class="progress-bar" style="width: ${status.progress}%"></div>
                    </div>
                    <div class="progress-info">
                        <span class="current">${Math.round(status.progress)}%</span>
                        <span class="status">${status.isUnlocked ? 'Voltooid!' : 'In uitvoering'}</span>
                    </div>
                </div>
                <div class="badge-details mt-3">
                    <button class="btn-details" onclick="showBadgeDetails('${badge.id}')">
                        <i class="fas fa-info-circle"></i> Details bekijken
                    </button>
                </div>
            </div>
        </div>
    `;

    return div;
}

// Özet bilgilerini güncelle
function updateSummary() {
    const unlockedBadges = Object.keys(badgeDefinitions).filter(badgeId => 
        checkBadgeStatus(badgeId).isUnlocked
    ).length;

    const totalBadges = Object.keys(badgeDefinitions).length;
    const completionPercentage = Math.round((unlockedBadges / totalBadges) * 100);

    document.querySelector('.summary-item:nth-child(1) .count').textContent = unlockedBadges;
    document.querySelector('.summary-item:nth-child(2) .count').textContent = totalBadges;
    document.querySelector('.summary-item:nth-child(3) .count').textContent = `${completionPercentage}%`;
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Kategori filtreleme
    document.querySelectorAll('.category-filter').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterBadges(category);
        });
    });
}

// Rozetleri filtrele
function filterBadges(category) {
    document.querySelectorAll('[data-category]').forEach(badge => {
        if (category === 'all' || badge.dataset.category === category) {
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Rozet detaylarını göster
function showBadgeDetails(badgeId) {
    const badge = badgeDefinitions[badgeId];
    const status = checkBadgeStatus(badgeId);
    
    const content = `
        <div class="badge-detail-content">
            <h4>${badge.title}</h4>
            <p>${badge.description}</p>
            <h5>Vereisten:</h5>
            <ul>
                ${Object.entries(badge.requirements).map(([key, value]) => `
                    <li>${key}: ${value}</li>
                `).join('')}
            </ul>
            <h5>Beloningen:</h5>
            <ul>
                <li>XP: ${badge.rewards.xp}</li>
                ${badge.rewards.features.map(feature => `
                    <li>${feature}</li>
                `).join('')}
            </ul>
        </div>
    `;

    document.getElementById('badgeDetailContent').innerHTML = content;
    new bootstrap.Modal(document.getElementById('badgeDetailModal')).show();
}

// İlerlemeyi güncelle (diğer oyunlardan çağrılacak)
function updateProgress(category, data) {
    if (!currentUser || !userProgress) return;

    // İlerlemeyi güncelle
    userProgress[category] = {
        ...userProgress[category],
        ...data
    };

    // LocalStorage'a kaydet
    localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(userProgress));

    // Rozet görüntülemesini güncelle
    updateBadgesDisplay();
    updateSummary();
} 