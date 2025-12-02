document.addEventListener('DOMContentLoaded', function() {
    // Memilih semua elemen timeline item
    const items = document.querySelectorAll('.timeline-item');

    // Opsi untuk IntersectionObserver
    const observerOptions = {
        root: null, // viewport
        threshold: 0.2, // Elemen muncul ketika 20% terlihat
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan class 'visible' ketika elemen masuk viewport
                entry.target.classList.add('visible');
                // Hentikan observasi setelah muncul (opsional, hapus baris ini jika ingin animasi berulang)
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    items.forEach(item => {
        observer.observe(item);
    });
});