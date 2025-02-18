// EmailJS yapılandırması
(function() {
    emailjs.init("n4DhHGjB4edUvGJsd");
})();

// Form gönderimi
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Gönder butonunu devre dışı bırak
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verzenden...';
    
    // Form verilerini al
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // EmailJS ile gönder
    emailjs.send('service_pgm4znj', 'template_6kc55go', formData)
        .then(function(response) {
            // İletişim modalını kapat
            const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            contactModal.hide();
            
            // Formu temizle
            document.getElementById('contactForm').reset();
            
            // Başarı modalını göster
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
        }, function(error) {
            showFeedback('error', 'Er is een fout opgetreden. Probeer het later opnieuw.');
        })
        .finally(function() {
            // Gönder butonunu tekrar aktif et
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Verzenden';
        });
});

// Geri bildirim mesajını göster
function showFeedback(type, message) {
    const modalBody = document.querySelector('#contactModal .modal-body');
    
    // Varolan geri bildirimi kaldır
    const existingFeedback = modalBody.querySelector('.contact-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Yeni geri bildirimi ekle
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `contact-feedback alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
    feedbackDiv.innerHTML = message;
    
    modalBody.appendChild(feedbackDiv);
    
    // 5 saniye sonra geri bildirimi kaldır
    setTimeout(() => {
        feedbackDiv.remove();
    }, 5000);
} 