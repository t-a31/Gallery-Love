// ==========================================
// CONFIGURASI
// ==========================================
const PASSWORD_BENAR = "bukanSaya"; // Password login Anda

// ==========================================
// ELEMEN DOM
// ==========================================
const loadingView = document.getElementById('loadingView');
const loginView = document.getElementById('loginView');
const mainView = document.getElementById('mainView');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const message = document.getElementById('message');
const heartsContainer = document.getElementById('hearts-container');

// ==========================================
// 1. LOGIKA ALUR HALAMAN (FLOW LOGIC)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // Buka awal: Tampilkan loading selama 2.5 detik, lalu munculkan login
  setTimeout(() => {
    loadingView.classList.add('hidden');
    loginView.classList.remove('hidden');
    passwordInput.focus();
  }, 3500);

  initThreeJS();
  initGalleryListeners();
});

// Proses Submit Login
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const inputVal = passwordInput.value;

  if (inputVal === PASSWORD_BENAR) {
    // 1. Sembunyikan Login, Tampilkan Loading Transisi
    loginView.classList.add('hidden');
    loadingView.classList.remove('hidden');
    message.innerText = '';
    passwordInput.value = '';

    // 2. Tampilkan Halaman Utama setelah 2 detik
    setTimeout(() => {
      loadingView.classList.add('hidden');
      mainView.classList.remove('hidden');
    }, 3500);

  } else {
    // 3. Jika salah: Jangan munculkan loading, beri pesan error
    message.innerText = 'password salah, coba lagi';
    passwordInput.value = '';
    passwordInput.focus();
  }
});

// ==========================================
// 2. EFEK HATI ANIMASI (LOADING)
// ==========================================
function createFloatingHeart() {
  if (!heartsContainer || loadingView.classList.contains('hidden')) return;

  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  const randomLeft = Math.random() * 160 - 30;
  const randomDelay = Math.random() * 2;
  const colors = ['#ff85a2', '#ff4071', '#ffb3c6', '#ff6b8b'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  heart.style.left = `${randomLeft}px`;
  heart.style.animationDelay = `${randomDelay}s`;
  heart.style.backgroundColor = randomColor;
  
  const styleRule = document.createElement('style');
  const uniqueId = `heart-${Math.floor(Math.random() * 100000)}`;
  heart.classList.add(uniqueId);
  
  styleRule.innerHTML = `
    .${uniqueId}::before, .${uniqueId}::after {
      background-color: ${randomColor} !important;
    }
  `;
  document.head.appendChild(styleRule);
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
    styleRule.remove();
  }, 4500);
}

setInterval(createFloatingHeart, 400);

// ==========================================
// 3. EFEK THREE.JS BACKGROUND (LOGIN)
// ==========================================
function initThreeJS() {
  const canvasElem = document.getElementById('bg-canvas');
  if (!canvasElem) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); 

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElem,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  function createFlatHeartTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffb6c1';
    ctx.beginPath();
    ctx.moveTo(32, 18);
    ctx.bezierCurveTo(32, 15, 27, 8, 18, 8);
    ctx.bezierCurveTo(7, 8, 7, 22.5, 7, 22.5);
    ctx.bezierCurveTo(7, 31, 17, 40, 32, 50);
    ctx.bezierCurveTo(47, 40, 57, 31, 57, 22.5);
    ctx.bezierCurveTo(57, 22.5, 57, 8, 46, 8);
    ctx.bezierCurveTo(37, 8, 32, 15, 32, 18);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  const particleCount = 1000;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i]     = (Math.random() - 0.5) * 800;
    particlePositions[i + 1] = (Math.random() - 0.5) * 800;
    particlePositions[i + 2] = (Math.random() - 0.5) * 800;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffe3e7,
    size: 6,
    map: createFlatHeartTexture(),
    transparent: true,
    opacity: 1.0,
    depthWrite: true,
    blending: THREE.NormalBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  let mouseX = 0;
  let mouseY = 0;

  function onPointerMove(event) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    mouseX = (clientX - window.innerWidth / 2) * 0.001;
    mouseY = (clientY - window.innerHeight / 2) * 0.001;
  }

  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove);

  function animate() {
    requestAnimationFrame(animate);

    const positions = particleGeometry.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      positions[i] += 0.3;
      if (positions[i] > 400) {
        positions[i] = -400;
      }
    }
    particleGeometry.attributes.position.needsUpdate = true;
    particleSystem.rotation.y += 0.0003;

    scene.rotation.y += (mouseX - scene.rotation.y) * 0.05;
    scene.rotation.x += (mouseY - scene.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ==========================================
// 4. FITUR FITUR GALERI UTAMA
// ==========================================
function initGalleryListeners() {
  // Lightbox Foto
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

  // Efek Hover Card
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
}

// Logika Musik
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

// Logika Auto Scroll
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

// Modal Video
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
  
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.src = "";
  }
  if (modal) {
    modal.style.display = 'none';
  }
}

const videoModal = document.getElementById('videoModal');
if (videoModal) {
  videoModal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });
}

// --- AUTO SLIDE Samping Tanpa Ubah HTML ---
document.addEventListener('DOMContentLoaded', () => {
  // Ganti 'photoContainer' dengan ID container foto kamu
  const container = document.getElementById('photoContainer'); 
  if (!container) return;

  const speed = 3000; // Waktu geser tiap 3 detik

  setInterval(() => {
    // Cek apakah scroll sudah sampai paling ujung kanan
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    if (container.scrollLeft >= maxScrollLeft - 5) {
      // Jika sudah di ujung, balik lagi ke paling awal (kiri)
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // Geser ke samping kanan sejauh lebar layar tampilan
      container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
    }
  }, speed);
});
