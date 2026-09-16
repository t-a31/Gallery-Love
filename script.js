document.addEventListener('DOMContentLoaded', () => {

  // --- 1. LIGHTBOX FOTO ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox .close-btn');
  const galleryImages = document.querySelectorAll('.gallery-item img');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      lightbox.style.display = 'none';
    }
  });

  // --- 2. EFEK HOVER CARD ---
  const cards = document.querySelectorAll('.gallery-item, .quote-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.02)';
      card.style.zIndex = '30';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
      card.style.zIndex = '';
    });
  });

  // --- 3. LOGIKA LOADING AWAL ---
  const loader = document.getElementById("appLoader");
  setTimeout(() => {
    if (loader) {
      loader.classList.add("hidden");
    }
  }, 1200);

  // --- 4. EVENT ENTER UNTUK INPUT PASSWORD ---
  const passInput = document.getElementById("passInput");
  if (passInput) {
    passInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        checkPassword();
      }
    });
  }

});

// --- 5. LOGIKA MUSIK ---
window.toggleMusic = function() {
  const audio = document.getElementById("weddingMusic");
  const btn = document.getElementById("musicBtn");
  const playPath = document.getElementById("playPath");
  const pausePath = document.getElementById("pausePath");

  if (audio.paused) {
    audio.play();
    btn.classList.add("playing");
    playPath.classList.add("hidden");
    pausePath.classList.remove("hidden");
  } else {
    audio.pause();
    btn.classList.remove("playing");
    playPath.classList.remove("hidden");
    pausePath.classList.add("hidden");
  }
};

// --- 6. LOGIKA AUTO SCROLL ---
const autoScrollBtn = document.getElementById("autoScrollBtn");
let scrollInterval = null;
let isScrolling = false;

const playIconPath = "M8 5v14l11-7z";
const pauseIconPath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

if (autoScrollBtn) {
  autoScrollBtn.addEventListener("click", function () {
    if (!isScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  });
}

function startAutoScroll() {
  isScrolling = true;
  autoScrollBtn.classList.add("scrolling");
  autoScrollBtn.querySelector("path").setAttribute("d", pauseIconPath);

  scrollInterval = setInterval(function () {
    window.scrollBy(0, 1);

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      stopAutoScroll();
    }
  }, 30);
}

function stopAutoScroll() {
  isScrolling = false;
  if (autoScrollBtn) {
    autoScrollBtn.classList.remove("scrolling");
    autoScrollBtn.querySelector("path").setAttribute("d", playIconPath);
  }
  clearInterval(scrollInterval);
}

window.addEventListener("wheel", stopAutoScroll);
window.addEventListener("touchmove", stopAutoScroll);

// --- 7. MODAL VIDEO ---
function openModal(containerElement) {
  const sourceVideo = containerElement.querySelector('video');
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');

  modalVideo.src = sourceVideo.src;
  modalVideo.currentTime = sourceVideo.currentTime;
  modalVideo.muted = true;
  
  updateMuteIcon(true);
  modal.style.display = 'flex';
  modalVideo.play();
}

function toggleModalMute() {
  const modalVideo = document.getElementById('modalVideo');
  if (modalVideo.muted) {
    modalVideo.muted = false;
    updateMuteIcon(false);
  } else {
    modalVideo.muted = true;
    updateMuteIcon(true);
  }
}

function updateMuteIcon(isMuted) {
  const mutedPath = document.getElementById('mutedPath');
  const unmutedPath = document.getElementById('unmutedPath');
  
  if (isMuted) {
    mutedPath.classList.remove('hidden');
    unmutedPath.classList.add('hidden');
  } else {
    mutedPath.classList.add('hidden');
    unmutedPath.classList.remove('hidden');
  }
}

function closeModal() {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  
  modalVideo.pause();
  modalVideo.src = "";
  modal.style.display = 'none';
}

const videoModal = document.getElementById('videoModal');
if (videoModal) {
  videoModal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });
}

// --- 8. LOGIKA VALIDASI PASSWORD & LOADER TRANSISI ---
function checkPassword() {
  const passwordBenar = "pipaaiiipipuuiii"; // <-- UBAH PASSWORD DI SINI
  const inputPass = document.getElementById("passInput").value;
  const errorMsg = document.getElementById("errorMsg");
  const overlay = document.getElementById("passwordOverlay");
  const loader = document.getElementById("appLoader");
  const loaderText = document.getElementById("loaderText");

  if (inputPass === passwordBenar) {
    // 1. Langsung sembunyikan halaman password
    if (overlay) overlay.style.display = "none";

    // 2. Tampilkan loader transisi
    if (loaderText) loaderText.innerText = "Membuka galeri... ✨";
    if (loader) loader.classList.remove("hidden");

    // 3. Tampilkan galeri setelah 1.5 detik
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
    }, 1500);

  } else {
    // 4. Jika salah, tetap di halaman password & munculkan pesan error
    if (errorMsg) errorMsg.innerText = "Password salah, coba lagi ya!";
    document.getElementById("passInput").value = "";
  }
}
