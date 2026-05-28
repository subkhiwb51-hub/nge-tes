/* =====================================================
   script.js — Love Letter Website
   =====================================================
   Struktur file ini:
   1. Setup Canvas Background
   2. Partikel Sparkle
   3. Kelopak Bunga Jatuh
   4. Loop Animasi Utama
   5. Navigasi Halaman
   6. Volume Bar
   7. Slider Kata-Kata (halaman 4)
   8. Slider Album Foto (halaman 5)
   ===================================================== */


/* =====================================================
   1. SETUP CANVAS BACKGROUND
   ===================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const colors = [
  'rgba(200,80,130,',
  'rgba(220,120,160,',
  'rgba(180,60,110,',
  'rgba(240,160,190,',
  'rgba(150,40,90,',
];


/* =====================================================
   2. PARTIKEL SPARKLE
   ===================================================== */
const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x:            Math.random() * window.innerWidth,
    y:            Math.random() * window.innerHeight,
    size:         Math.random() * 2.5 + 0.5,
    speed:        Math.random() * 0.4 + 0.1,
    opacity:      Math.random() * 0.6 + 0.1,
    color:        colors[Math.floor(Math.random() * colors.length)],
    drift:        (Math.random() - 0.5) * 0.3,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinklePhase: Math.random() * Math.PI * 2,
    isPetal:      Math.random() > 0.7,
    rotation:     Math.random() * 360,
  });
}


/* =====================================================
   3. KELOPAK BUNGA JATUH
   ===================================================== */
const petals = [];
for (let i = 0; i < 25; i++) {
  petals.push({
    x:             Math.random() * window.innerWidth,
    y:             Math.random() * window.innerHeight,
    size:          Math.random() * 6 + 4,
    speedY:        Math.random() * 1.2 + 0.4,
    speedX:        (Math.random() - 0.5) * 0.8,
    rotation:      Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 3,
    opacity:       Math.random() * 0.5 + 0.2,
    color:         colors[Math.floor(Math.random() * colors.length)],
  });
}


/* =====================================================
   4. LOOP ANIMASI UTAMA
   ===================================================== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() / 1000;

  particles.forEach(p => {
    const op = p.opacity * (0.5 + 0.5 * Math.sin(t * p.twinkleSpeed * 60 + p.twinklePhase));
    ctx.fillStyle = p.color + op + ')';
    ctx.beginPath();
    if (p.isPetal) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.scale(1, 1.6);
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.restore();
    } else {
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    ctx.fill();

    p.y += p.speed;
    p.x += p.drift;
    if (p.isPetal) p.rotation += 0.5;
    if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
    if (p.x < -10)                  p.x = canvas.width + 10;
    if (p.x > canvas.width + 10)    p.x = -10;
  });

  petals.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color + '0.8)';
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    p.y        += p.speedY;
    p.x        += p.speedX + Math.sin(t + p.x) * 0.3;
    p.rotation += p.rotationSpeed;
    if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
  });

  requestAnimationFrame(animate);
}
animate();


/* =====================================================
   AUDIO SETUP — didefinisikan sebelum fungsi navigasi
   agar variabel `music` bisa dipakai di openGift()
   ===================================================== */
const music        = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');

music.volume = 0.8;

playPauseBtn.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    playPauseBtn.textContent = '⏸';
  } else {
    music.pause();
    playPauseBtn.textContent = '▶';
  }
});

music.addEventListener('play',  () => { playPauseBtn.textContent = '⏸'; });
music.addEventListener('pause', () => { playPauseBtn.textContent = '▶'; });

music.addEventListener('timeupdate', () => {
  if (!music.duration) return;
  const pct = (music.currentTime / music.duration) * 100;
  const bar = document.querySelector('.music-progress-bar');
  if (bar) bar.style.width = pct + '%';
});

const progressTrack = document.querySelector('.music-progress');
if (progressTrack) {
  progressTrack.style.cursor = 'pointer';
  progressTrack.addEventListener('click', e => {
    if (!music.duration) return;
    const rect  = progressTrack.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    // Nonaktifkan transition agar bar langsung loncat ke posisi baru
    const bar = document.querySelector('.music-progress-bar');
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = (ratio * 100) + '%';
      setTimeout(() => { bar.style.transition = ''; }, 50);
    }
    music.currentTime = ratio * music.duration;
  });
}


/* =====================================================
   5. NAVIGASI HALAMAN
   ===================================================== */

/**
 * showPage(id)
 * Sembunyikan semua halaman, tampilkan halaman target.
 */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  const el = document.getElementById(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('active'));

  const closeBtn = document.getElementById('closeBtn');
  closeBtn.style.display = id === 'page1' ? 'none' : 'flex';
}

/**
 * spawnLoveParticles()
 * Membuat 20 emoji ❤️ yang menyebar ke segala arah dari
 * tengah layar saat kotak hadiah diklik, lalu menghilang.
 *
 * Cara kerja:
 * - Buat elemen <span> berisi emoji ❤ / 💕 / 💖
 * - Posisikan di tengah layar (posisi kotak hadiah)
 * - Beri arah acak (sudut + jarak) lewat CSS transform
 * - Tambahkan CSS transition agar bergerak halus
 * - Hapus elemen setelah animasi selesai
 */
function spawnLoveParticles() {
  // Ambil posisi tengah kotak hadiah di layar
  const box  = document.getElementById('giftBox');
  const rect = box.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;  // Titik tengah X
  const cy   = rect.top  + rect.height / 2;  // Titik tengah Y

  // Daftar emoji yang akan muncul secara acak
  const emojis = ['❤️', '💕', '💖', '💗', '💓', '🌸', '✨'];

  for (let i = 0; i < 20; i++) {
    const el = document.createElement('span');

    // Pilih emoji acak dari daftar
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Ukuran acak: 18px – 36px
    const size = Math.random() * 18 + 18;

    // Styling awal — muncul tepat di tengah kotak hadiah
    Object.assign(el.style, {
      position:   'fixed',
      left:       cx + 'px',
      top:        cy + 'px',
      fontSize:   size + 'px',
      lineHeight: '1',
      transform:  'translate(-50%, -50%) scale(0)',  // Mulai kecil
      opacity:    '1',
      zIndex:     '999',
      pointerEvents: 'none',
      transition: 'none',   // Matikan transition dulu agar spawn langsung
    });

    document.body.appendChild(el);

    // Hitung arah terbang acak:
    // angle  = sudut dalam radian (0 – 360°)
    // radius = seberapa jauh terbang (80–220px)
    const angle  = Math.random() * Math.PI * 2;
    const radius = Math.random() * 140 + 80;
    const tx     = Math.cos(angle) * radius;  // Perpindahan X
    const ty     = Math.sin(angle) * radius;  // Perpindahan Y

    // requestAnimationFrame pertama: pastikan elemen sudah di DOM
    // requestAnimationFrame kedua: baru aktifkan transition & gerakkan
    // (dua frame diperlukan agar CSS transition terpicu dengan benar)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        Object.assign(el.style, {
          transition: 'transform 0.8s ease-out, opacity 0.8s ease-out',
          transform:  `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`,
          opacity:    '0',
        });
      });
    });

    // Hapus elemen dari DOM setelah animasi selesai (800ms)
    setTimeout(() => el.remove(), 900);
  }
}

/**
 * openGift()
 * Animasi kotak hadiah terbuka → pindah ke halaman 2.
 */
function openGift() {
  // ✅ Panggil efek love burst terlebih dahulu
  spawnLoveParticles();

  music.play(); // ✅ TAMBAHKAN BARIS INI

  document.querySelector('.music-player').style.display = 'flex';
  const box = document.getElementById('giftBox');
  box.style.transition = 'transform 0.3s, opacity 0.5s';
  box.style.transform  = 'scale(1.3)';
  setTimeout(() => { box.style.opacity = '0'; }, 200);
  setTimeout(() => showPage('page2'), 700);

  document.querySelector('.music-player').style.display = 'flex';

  
}

/** Navigasi ke halaman tertentu */
function goToPage(id) {
  showPage(id);
}

/** Kembali ke halaman 1 & reset kotak hadiah */
function goHome() {
  showPage('page1');
  const box = document.getElementById('giftBox');
  box.style.transform = 'scale(1)';
  box.style.opacity   = '1';
}


/* =====================================================
   6. VOLUME BAR
   ===================================================== */
const volumeSlider = document.getElementById('volumeSlider');
const volIcon      = document.getElementById('volIcon');

/*
  Fungsi updateVolumeFill():
  Mengisi track slider dengan warna sesuai nilai volume.
  Caranya: gunakan CSS linear-gradient sebagai background.
  Bagian kiri (terisi) berwarna pink, bagian kanan (kosong) abu-abu.
*/
function updateVolumeFill() {
  const val = volumeSlider.value;  // Nilai 0–100
  const pct = val + '%';

  // Gradient: pink dari 0 sampai posisi thumb, abu-abu sisanya
  volumeSlider.style.background =
    `linear-gradient(to right, #c060a0 ${pct}, rgba(200,100,150,0.25) ${pct})`;

  // Update ikon speaker berdasarkan level volume
  if (val == 0) {
    volIcon.textContent = '🔇';   // Mute
  } else if (val < 40) {
    volIcon.textContent = '🔈';   // Pelan
  } else if (val < 75) {
    volIcon.textContent = '🔉';   // Sedang
  } else {
    volIcon.textContent = '🔊';   // Keras
  }
}

/*
  Event 'input' terpicu setiap kali slider digeser.
  Ini tempat kamu menghubungkan ke audio asli:
  
  const music = document.getElementById('bgMusic');
  music.volume = volumeSlider.value / 100;
*/
volumeSlider.addEventListener('input', () => {
  updateVolumeFill();
  music.volume = volumeSlider.value / 100;
  // Jika sedang mute lalu slider digeser, cabut mute
  if (music.muted) music.muted = false;
});

/*
  Klik ikon speaker → toggle mute/unmute.
  Simpan nilai volume sebelumnya di dataset agar bisa dikembalikan.
*/
volIcon.addEventListener('click', () => {
  if (volumeSlider.value > 0) {
    volumeSlider.dataset.prev = volumeSlider.value;
    volumeSlider.value = 0;
    music.volume = 0;
  } else {
    const prev = volumeSlider.dataset.prev || 80;
    volumeSlider.value = prev;
    music.volume = prev / 100;
  }
  updateVolumeFill();
});

// Jalankan sekali saat halaman dimuat untuk mengisi warna awal
updateVolumeFill();


/* =====================================================
   7. SLIDER KATA-KATA INDAH (halaman 4)
   ===================================================== */

/*
  Cara kerja slider:
  - quoteIndex = indeks slide yang sedang aktif (mulai dari 0)
  - TOTAL_QUOTES = jumlah total slide (dihitung otomatis)
  - quotes-track digeser dengan CSS transform: translateX()
  
  Rumus menggeser:
  translateX(-quoteIndex * 100%)
  → index 0 = 0% (slide 1 tampil)
  → index 1 = -100% (slide 2 tampil)
  → index 2 = -200% (slide 3 tampil)
  dst.
*/
let quoteIndex    = 0;
const quotesTrack = document.getElementById('quotesTrack');
const TOTAL_QUOTES = quotesTrack ? quotesTrack.children.length : 0;

/** Buat titik-titik indikator untuk slider quotes */
function buildQuoteDots() {
  const container = document.getElementById('quoteDots');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < TOTAL_QUOTES; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToQuote(i);   // Klik dot → langsung ke slide itu
    container.appendChild(dot);
  }
}

/**
 * goToQuote(index)
 * Geser track ke slide yang dipilih & update dot aktif.
 */
function goToQuote(index) {
  quoteIndex = index;
  quotesTrack.style.transform = `translateX(-${quoteIndex * 100}%)`;

  // Update class 'active' pada dot
  document.querySelectorAll('#quoteDots .dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === quoteIndex);
  });
}

/** Tombol ‹ — slide sebelumnya (wrap ke akhir jika sudah di awal) */
function prevQuote() {
  goToQuote((quoteIndex - 1 + TOTAL_QUOTES) % TOTAL_QUOTES);
}

/** Tombol › — slide berikutnya (wrap ke awal jika sudah di akhir) */
function nextQuote() {
  goToQuote((quoteIndex + 1) % TOTAL_QUOTES);
}

// ---- SWIPE / DRAG SUPPORT untuk slider quotes ----
// Mendeteksi gerakan sentuh (mobile) dan klik-geser (desktop)
(function attachQuoteSwipe() {
  if (!quotesTrack) return;
  let startX = 0;

  // Touch events (mobile)
  quotesTrack.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  quotesTrack.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {      // Minimal 40px agar tidak terpicu saat tap
      diff > 0 ? nextQuote() : prevQuote();
    }
  });

  // Mouse events (desktop drag)
  quotesTrack.addEventListener('mousedown', e => { startX = e.clientX; });
  quotesTrack.addEventListener('mouseup',   e => {
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextQuote() : prevQuote();
    }
  });
})();

buildQuoteDots();   // Inisialisasi dots saat halaman dimuat


/* =====================================================
   8. SLIDER ALBUM FOTO (halaman 5)
   Logika identik dengan slider quotes, hanya elemen berbeda.
   ===================================================== */
let photoIndex    = 0;
const photoTrack  = document.getElementById('photoTrack');
const TOTAL_PHOTOS = photoTrack ? photoTrack.children.length : 0;

/** Buat titik-titik indikator untuk slider foto */
function buildPhotoDots() {
  const container = document.getElementById('photoDots');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < TOTAL_PHOTOS; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToPhoto(i);
    container.appendChild(dot);
  }
}

/**
 * goToPhoto(index)
 * Geser track foto ke slide yang dipilih.
 */
function goToPhoto(index) {
  photoIndex = index;
  photoTrack.style.transform = `translateX(-${photoIndex * 100}%)`;

  document.querySelectorAll('#photoDots .dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === photoIndex);
  });
}

function prevPhoto() {
  goToPhoto((photoIndex - 1 + TOTAL_PHOTOS) % TOTAL_PHOTOS);
}

function nextPhoto() {
  goToPhoto((photoIndex + 1) % TOTAL_PHOTOS);
}

// ---- SWIPE / DRAG SUPPORT untuk slider foto ----
(function attachPhotoSwipe() {
  if (!photoTrack) return;
  let startX = 0;

  photoTrack.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  photoTrack.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextPhoto() : prevPhoto();
    }
  });

  photoTrack.addEventListener('mousedown', e => { startX = e.clientX; });
  photoTrack.addEventListener('mouseup',   e => {
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextPhoto() : prevPhoto();
    }
  });
})();

buildPhotoDots();   // Inisialisasi dots foto saat halaman dimuat


function togglePlayer() {
  const player = document.querySelector('.music-player');
  const btn = document.getElementById('minimizeBtn');
  player.classList.toggle('minimized');
  btn.textContent = player.classList.contains('minimized') ? '+' : '−';
}