/* =====================================================
   script.js — Love Letter Website
   =====================================================
   Struktur file ini:
   1. Setup Canvas Background
   2. Buat Partikel Sparkle
   3. Buat Kelopak Bunga Jatuh
   4. Loop Animasi Utama
   5. Fungsi Navigasi Halaman
   ===================================================== */


/* =====================================================
   1. SETUP CANVAS BACKGROUND
   Canvas HTML5 digunakan untuk menggambar animasi
   partikel bintang & kelopak bunga di background.
   ===================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');  // Ambil context 2D untuk menggambar

// Sesuaikan ukuran canvas dengan ukuran jendela browser
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

// Update ukuran canvas ketika jendela di-resize
window.addEventListener('resize', resizeCanvas);

// Palet warna untuk partikel — semua bernuansa pink/ungu
const colors = [
  'rgba(200,80,130,',    // Merah muda
  'rgba(220,120,160,',   // Merah muda terang
  'rgba(180,60,110,',    // Merah muda gelap
  'rgba(240,160,190,',   // Pink muda
  'rgba(150,40,90,',     // Ungu kemerahan
];


/* =====================================================
   2. BUAT PARTIKEL SPARKLE
   80 partikel kecil yang melayang perlahan ke bawah
   dan berkedip-kedip seperti bintang.
   ===================================================== */
const particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x:            Math.random() * window.innerWidth,   // Posisi horizontal acak
    y:            Math.random() * window.innerHeight,  // Posisi vertikal acak
    size:         Math.random() * 2.5 + 0.5,           // Ukuran: 0.5px - 3px
    speed:        Math.random() * 0.4 + 0.1,           // Kecepatan jatuh: 0.1 - 0.5
    opacity:      Math.random() * 0.6 + 0.1,           // Transparansi: 0.1 - 0.7
    color:        colors[Math.floor(Math.random() * colors.length)],
    drift:        (Math.random() - 0.5) * 0.3,         // Gerakan kiri-kanan: -0.15 - 0.15
    twinkleSpeed: Math.random() * 0.02 + 0.005,        // Kecepatan kedip
    twinklePhase: Math.random() * Math.PI * 2,         // Fase awal kedip (agar tidak bersamaan)
    isPetal:      Math.random() > 0.7,                 // 30% berbentuk oval (kelopak)
    rotation:     Math.random() * 360,                 // Sudut rotasi awal
  });
}


/* =====================================================
   3. BUAT KELOPAK BUNGA JATUH
   25 kelopak lebih besar yang jatuh sambil berputar,
   dengan sedikit ayunan horizontal (efek angin).
   ===================================================== */
const petals = [];

for (let i = 0; i < 25; i++) {
  petals.push({
    x:             Math.random() * window.innerWidth,
    y:             Math.random() * window.innerHeight,
    size:          Math.random() * 6 + 4,              // Ukuran: 4px - 10px
    speedY:        Math.random() * 1.2 + 0.4,          // Kecepatan jatuh: 0.4 - 1.6
    speedX:        (Math.random() - 0.5) * 0.8,        // Drift horizontal: -0.4 - 0.4
    rotation:      Math.random() * 360,                // Sudut rotasi awal
    rotationSpeed: (Math.random() - 0.5) * 3,          // Kecepatan putar: -1.5 - 1.5
    opacity:       Math.random() * 0.5 + 0.2,          // Transparansi: 0.2 - 0.7
    color:         colors[Math.floor(Math.random() * colors.length)],
  });
}


/* =====================================================
   4. LOOP ANIMASI UTAMA
   Fungsi animate() dipanggil ~60x per detik oleh
   requestAnimationFrame. Setiap frame:
   - Canvas dibersihkan
   - Semua partikel dan kelopak digambar ulang
   - Posisi masing-masing diperbarui
   ===================================================== */
function animate() {
  // Bersihkan seluruh canvas setiap frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Waktu dalam detik — digunakan untuk animasi berbasis sinus
  const t = Date.now() / 1000;


  /* --- Gambar dan perbarui setiap partikel sparkle --- */
  particles.forEach(p => {

    // Hitung opacity dengan efek berkedip menggunakan fungsi sinus
    // Math.sin() menghasilkan nilai -1 hingga 1, lalu dinormalisasi ke 0.0 - 1.0
    const op = p.opacity * (0.5 + 0.5 * Math.sin(t * p.twinkleSpeed * 60 + p.twinklePhase));

    ctx.fillStyle = p.color + op + ')';
    ctx.beginPath();

    if (p.isPetal) {
      // Gambar bentuk oval memanjang (kelopak kecil)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180); // Konversi derajat ke radian
      ctx.scale(1, 1.6);                      // Panjangkan ke arah Y
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.restore();
    } else {
      // Gambar lingkaran biasa
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }

    ctx.fill();

    // --- Update posisi partikel ---
    p.y += p.speed;           // Jatuh ke bawah
    p.x += p.drift;           // Bergeser sedikit ke samping
    if (p.isPetal) p.rotation += 0.5;  // Putar perlahan

    // Reset ke atas jika keluar dari bawah layar
    if (p.y > canvas.height + 10) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
    // Wrap horizontal — keluar kiri masuk kanan, dan sebaliknya
    if (p.x < -10)                p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;
  });


  /* --- Gambar dan perbarui setiap kelopak bunga --- */
  petals.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color + '0.8)';

    // Gambar ellipse: setengah lebar dari tinggi → bentuk kelopak
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- Update posisi kelopak ---
    p.y        += p.speedY;
    // Gerakan horizontal: drift tetap + ayunan sinus (efek angin)
    p.x        += p.speedX + Math.sin(t + p.x) * 0.3;
    p.rotation += p.rotationSpeed;

    // Reset ke atas jika keluar dari bawah layar
    if (p.y > canvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
  });

  // Minta frame berikutnya — membuat loop berjalan terus
  requestAnimationFrame(animate);
}

// Mulai loop animasi
animate();


/* =====================================================
   5. FUNGSI NAVIGASI HALAMAN
   ===================================================== */

/**
 * showPage(id)
 * Menyembunyikan semua halaman, lalu menampilkan
 * halaman dengan ID yang diberikan + jalankan animasi masuk.
 *
 * @param {string} id - ID elemen halaman, contoh: 'page1'
 */
function showPage(id) {
  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  // Tampilkan halaman target
  const el = document.getElementById(id);
  el.style.display = 'flex';

  // requestAnimationFrame memastikan display:flex sudah aktif
  // sebelum class 'active' ditambahkan, agar animasi CSS berjalan
  requestAnimationFrame(() => el.classList.add('active'));

  // Tampilkan/sembunyikan tombol close (×)
  const closeBtn = document.getElementById('closeBtn');
  if (id === 'page1') {
    closeBtn.style.display = 'none';   // Halaman pertama tidak perlu tombol close
  } else {
    closeBtn.style.display = 'flex';
  }
}


/**
 * openGift()
 * Animasi membuka kotak hadiah, lalu pindah ke halaman 2.
 * Dipanggil saat kotak hadiah diklik.
 */
function openGift() {
  const box = document.getElementById('giftBox');

  // Perbesar kotak dulu, lalu fade out
  box.style.transition = 'transform 0.3s, opacity 0.5s';
  box.style.transform  = 'scale(1.3)';

  setTimeout(() => { box.style.opacity = '0'; }, 200);  // Mulai fade setelah 200ms
  setTimeout(() => showPage('page2'), 700);              // Pindah halaman setelah 700ms
}


/**
 * goToPage(id)
 * Navigasi ke halaman tertentu.
 * Digunakan oleh tombol "see more" dan "always & forever".
 *
 * @param {string} id - ID halaman tujuan
 */
function goToPage(id) {
  showPage(id);
}


/**
 * goHome()
 * Kembali ke halaman 1 dan reset tampilan kotak hadiah
 * (ukuran dan opacity dikembalikan ke semula).
 */
function goHome() {
  showPage('page1');

  const box = document.getElementById('giftBox');
  box.style.transform = 'scale(1)';
  box.style.opacity   = '1';
}
