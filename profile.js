// Kullanıcı verilerini localStorage'da saklayacağız
let currentUser = null;

// Varsayılan profil resmi (initials tarzında)
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=";

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    setupEventListeners();
});

// Event listener'ları ayarla
function setupEventListeners() {
    // Giriş formu
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Kayıt formu
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });

    // Çıkış butonu
    if (document.querySelector('.profile-actions')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-danger mt-3 w-100';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Uitloggen';
        logoutBtn.onclick = logout;
        document.querySelector('.profile-actions').appendChild(logoutBtn);
    }
}

// Giriş durumunu kontrol et
function checkLoginStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showUserContent();
        updateUserInterface();
    } else {
        showGuestContent();
    }
}

// Giriş işlemini yönet
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Kullanıcıları kontrol et
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showUserContent();
        updateUserInterface();
    } else {
        showError('Onjuiste e-mailadres of wachtwoord');
    }
}

// Kayıt işlemini yönet
function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    if (password !== passwordConfirm) {
        showError('Wachtwoorden komen niet overeen');
        return;
    }

    // Kullanıcıları kontrol et
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        showError('Dit e-mailadres is al geregistreerd');
        return;
    }

    // Yeni kullanıcı oluştur
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        avatar: `${DEFAULT_AVATAR}${name.toLowerCase().replace(/\s+/g, '')}&backgroundColor=2a5298&textColor=ffffff`,
        stats: {
            totalScore: 0,
            badges: 0,
            practiceTime: 0,
            progress: {
                vocabulary: 0,
                grammar: 0,
                pronunciation: 0
            }
        }
    };

    // Kullanıcıyı kaydet
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Otomatik giriş yap
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Modal'ı kapat ve kullanıcı arayüzünü göster
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    modal.hide();
    showUserContent();
    updateUserInterface();
    
    // Başarılı kayıt mesajı göster
    showSuccess('Account succesvol aangemaakt!');
}

// Kullanıcı içeriğini göster
function showUserContent() {
    document.getElementById('guest-content').style.display = 'none';
    document.getElementById('user-content').style.display = 'block';
}

// Misafir içeriğini göster
function showGuestContent() {
    document.getElementById('guest-content').style.display = 'block';
    document.getElementById('user-content').style.display = 'none';
}

// Kullanıcı arayüzünü güncelle
function updateUserInterface() {
    if (!currentUser) return;

    // Profil resmini güncelle
    const avatarImg = document.querySelector('.profile-avatar img');
    avatarImg.src = currentUser.avatar || `${DEFAULT_AVATAR}${currentUser.name.toLowerCase().replace(/\s+/g, '')}&backgroundColor=2a5298&textColor=ffffff`;
    avatarImg.alt = `${currentUser.name}'s avatar`;

    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('total-score').textContent = currentUser.stats.totalScore;
    document.getElementById('total-badges').textContent = currentUser.stats.badges;
    document.getElementById('practice-time').textContent = `${currentUser.stats.practiceTime}u`;

    // İlerleme çubuklarını güncelle
    updateProgressBars(currentUser.stats.progress);

    // Navbar'daki rozet sayısını güncelle
    const badgeCount = document.querySelector('.badge-count');
    if (badgeCount) {
        badgeCount.textContent = currentUser.stats.badges;
    }
}

// İlerleme çubuklarını güncelle
function updateProgressBars(progress) {
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressTexts = document.querySelectorAll('.progress-item span:last-child');

    progressBars[0].style.width = `${progress.vocabulary}%`;
    progressBars[1].style.width = `${progress.grammar}%`;
    progressBars[2].style.width = `${progress.pronunciation}%`;

    progressTexts[0].textContent = `${progress.vocabulary}%`;
    progressTexts[1].textContent = `${progress.grammar}%`;
    progressTexts[2].textContent = `${progress.pronunciation}%`;
}

// Kayıt formunu göster
function showRegisterForm() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

// Profil düzenleme
function editProfile() {
    // Profil düzenleme modalını göster (henüz oluşturulmadı)
    alert('Deze functie komt binnenkort beschikbaar');
}

// Hata mesajı göster
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger mt-3';
    alertDiv.textContent = message;
    
    const form = document.querySelector('form');
    form.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Başarı mesajı göster
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success mt-3';
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Çıkış yap
function logout() {
    if (confirm('Weet je zeker dat je wilt uitloggen?')) {
        localStorage.removeItem('currentUser');
        currentUser = null;
        showGuestContent();
        
        // Navbar'daki rozet sayısını sıfırla
        const badgeCount = document.querySelector('.badge-count');
        if (badgeCount) {
            badgeCount.textContent = '0';
        }
        
        // Kullanıcıyı ana sayfaya yönlendir
        window.location.href = 'index.html';
    }
}