/* ==========================================================
   Jajan Kesayangan - JavaScript
   Fungsi:
   1. jalankanJam()        -> widget jam digital di sidebar
   2. menuMobile()         -> tombol hamburger menu
   3. slideshow()          -> foto berjalan otomatis
   4. lightbox()           -> perbesar gambar galeri
   5. validasiForm()       -> validasi form registrasi & kontak
   6. hitungPengunjung()   -> counter pengunjung (localStorage)
   7. tombolKeAtas()       -> tombol kembali ke atas
   ========================================================== */

/* 1. Jam digital: diperbarui setiap 1 detik */
function jalankanJam() {
  const el = document.getElementById("jam");
  const tgl = document.getElementById("tanggal");
  if (!el) return;

  function perbarui() {
    const sekarang = new Date();
    el.textContent = sekarang.toLocaleTimeString("id-ID", { hour12: false });
    if (tgl) {
      tgl.textContent = sekarang.toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
    }
  }
  perbarui();
  setInterval(perbarui, 1000);
}

/* 2. Menu hamburger untuk layar kecil */
function menuMobile() {
  const tombol = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".menu");
  if (!tombol || !menu) return;

  tombol.addEventListener("click", function () {
    const terbuka = menu.classList.toggle("open");
    tombol.setAttribute("aria-expanded", terbuka);
  });
}

/* 3. Slideshow: ganti slide tiap 4 detik, bisa juga manual */
function slideshow() {
  const slides = document.querySelectorAll(".slide");
  if (slides.length === 0) return;

  let index = 0;
  let timer;

  function tampilkan(n) {
    slides[index].classList.remove("active");
    index = (n + slides.length) % slides.length;   // putar balik jika melewati batas
    slides[index].classList.add("active");
  }
  function mulaiOtomatis() {
    timer = setInterval(function () { tampilkan(index + 1); }, 4000);
  }

  document.querySelector(".slide-btn.next").addEventListener("click", function () {
    clearInterval(timer); tampilkan(index + 1); mulaiOtomatis();
  });
  document.querySelector(".slide-btn.prev").addEventListener("click", function () {
    clearInterval(timer); tampilkan(index - 1); mulaiOtomatis();
  });

  tampilkan(0);
  mulaiOtomatis();
}

/* 4. Lightbox galeri: klik gambar untuk memperbesar */
function lightbox() {
  const kotak = document.getElementById("lightbox");
  const gambar = document.querySelectorAll(".galeri-grid img");
  if (!kotak || gambar.length === 0) return;

  const besar = kotak.querySelector("img");
  gambar.forEach(function (img) {
    img.addEventListener("click", function () {
      besar.src = img.src;
      besar.alt = img.alt;
      kotak.classList.add("open");
    });
  });
  kotak.addEventListener("click", function () { kotak.classList.remove("open"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") kotak.classList.remove("open");
  });
}

/* 5. Validasi form (tanpa server, hanya menampilkan ringkasan) */
function validasiForm() {
  const forms = document.querySelectorAll("form[data-validasi]");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();                       // cegah reload halaman
      let valid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        const pesan = field.closest("div").querySelector(".error");
        let teks = "";

        if (!field.value.trim()) {
          teks = "Kolom ini wajib diisi.";
        } else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
          teks = "Format email belum benar.";
        } else if (field.type === "tel" && !/^[0-9+\-\s]{9,15}$/.test(field.value)) {
          teks = "Nomor HP 9-15 digit.";
        }
        if (pesan) pesan.textContent = teks;
        if (teks) valid = false;
      });

      const hasil = form.querySelector(".hasil-form");
      if (valid && hasil) {
        const nama = form.querySelector("[name=nama]").value;
        hasil.textContent = "Terima kasih, " + nama + "! Data kamu sudah kami terima (simulasi, belum dikirim ke server).";
        hasil.classList.add("tampil");
        form.reset();
      } else if (hasil) {
        hasil.classList.remove("tampil");
      }
    });
  });
}

/* 6. Counter pengunjung sederhana dengan localStorage */
function hitungPengunjung() {
  const el = document.getElementById("pengunjung");
  if (!el) return;
  let jumlah = 1250;                            // angka awal
  try {
    jumlah = parseInt(localStorage.getItem("jajanVisit") || "1250", 10) + 1;
    localStorage.setItem("jajanVisit", jumlah);
  } catch (err) { /* localStorage bisa diblokir, abaikan */ }
  el.textContent = jumlah.toLocaleString("id-ID");
}

/* 7. Tombol ke atas muncul setelah scroll 300px */
function tombolKeAtas() {
  const btn = document.getElementById("ke-atas");
  if (!btn) return;
  window.addEventListener("scroll", function () {
    btn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Jalankan semua fungsi setelah HTML selesai dimuat */
document.addEventListener("DOMContentLoaded", function () {
  jalankanJam();
  menuMobile();
  slideshow();
  lightbox();
  validasiForm();
  hitungPengunjung();
  tombolKeAtas();
});
