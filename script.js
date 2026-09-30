document.addEventListener('DOMContentLoaded', function () {
    
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (openBtn && sidebar && overlay) {
        openBtn.addEventListener('click', function () {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (closeBtn && sidebar && overlay) {
        closeBtn.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
});

function bacaSelengkapnya() {
    const ceritaPenuh = document.getElementById('ceritaPenuh');
    const btnBaca = document.getElementById('btnBaca');

    if (ceritaPenuh && btnBaca) {
        if (ceritaPenuh.style.display === 'none' || ceritaPenuh.style.display === '') {
            ceritaPenuh.style.display = 'block';
            btnBaca.innerHTML = 'Read Less';
        } else {
            ceritaPenuh.style.display = 'none';
            btnBaca.innerHTML = 'Read More';
        }
    }
}

// Jalankan setelah seluruh elemen web selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll('.counter');
    const sectionStatistik = document.getElementById('sectionStatistik');
    let hasAnimated = false; // Mencegah animasi berjalan berulang kali

    // Fungsi untuk menambah angka dari 0 ke target
    function startCounting() {
        counters.forEach(counter => {
            counter.innerText = '0';
            const target = +counter.getAttribute('data-target');
            const speed = 200; // Makin kecil angkanya, makin cepat animasinya
            const increment = target / speed;

            const updateCounter = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCounter, 15);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    }

    // Deteksi ketika elemen muncul di layar (saat di-scroll)
    if (sectionStatistik) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    startCounting();
                    hasAnimated = true; // Kunci agar animasi hanya jalan 1x
                }
            });
        }, { threshold: 0.3 }); // 0.3 artinya animasi mulai ketika 30% area sudah terlihat di layar

        observer.observe(sectionStatistik);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const track = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Buat titik indikator sesuai jumlah foto
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    // Gambar berpindah otomatis setiap 3,5 detik
    setInterval(nextSlide, 3500);
});


