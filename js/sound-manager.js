/**
 * Sound Manager untuk NARASI (Navigasi Arah Studi)
 * Mengelola Backsound (BGM), Sound Effect (SFX), dan status Mute.
 */
const SoundManager = {
  // Lokasi file audio
  config: {
    bgm: "assets/sounds/bgm-home.mp3",
    question: "assets/sounds/sfx-question.mp3",
    result: "assets/sounds/sfx-result.mp3"
  },

  // Pengaturan volume (0.0 sampai 1.0)
  volumes: {
    bgm: 0.3,       // Backsound santai
    question: 0.6,  // SFX pertanyaan
    result: 0.8     // SFX hasil
  },

  audio: {},
  muted: false,

  init() {
    this.muted = localStorage.getItem("narasi_sound_muted") === "true";

    try {
      // Inisialisasi BGM
      this.audio.bgm = new Audio(this.config.bgm);
      this.audio.bgm.loop = true;
      this.audio.bgm.volume = this.volumes.bgm;

      // Inisialisasi SFX
      this.audio.question = new Audio(this.config.question);
      this.audio.question.volume = this.volumes.question;

      this.audio.result = new Audio(this.config.result);
      this.audio.result.volume = this.volumes.result;
    } catch (err) {
      console.warn("Audio tidak didukung di peramban ini:", err);
    }
  },

  // Sound 1: Backsound Halaman Utama (dengan penanganan blokir autoplay peramban)
  playBGM() {
    if (this.muted || !this.audio.bgm) return;

    const playPromise = this.audio.bgm.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Jika autoplay diblokir browser, mulai saat pengguna pertama kali berinteraksi
        const unlock = () => {
          if (!this.muted && this.audio.bgm) {
            this.audio.bgm.play().catch(() => {});
          }
          ["click", "touchstart", "keydown"].forEach((evt) => {
            window.removeEventListener(evt, unlock);
          });
        };
        ["click", "touchstart", "keydown"].forEach((evt) => {
          window.addEventListener(evt, unlock, { once: true });
        });
      });
    }
  },

  stopBGM() {
    if (this.audio.bgm) {
      this.audio.bgm.pause();
      this.audio.bgm.currentTime = 0;
    }
  },

  // Sound 2: SFX saat pertanyaan muncul di halaman tes
  playQuestionSFX() {
    this.playSFX("question");
  },

  // Sound 3: SFX saat hasil asesmen muncul
  playResultSFX() {
    this.playSFX("result");
  },

  // Helper pemutar SFX dengan reset time agar responsif saat diklik cepat
  playSFX(name) {
    if (this.muted || !this.audio[name]) return;
    try {
      const sfx = this.audio[name].cloneNode();
      sfx.volume = this.volumes[name] || 0.6;
      const playPromise = sfx.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}
  },

  // Mengubah status Mute / Unmute (tersimpan di browser)
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("narasi_sound_muted", this.muted ? "true" : "false");

    if (this.muted) {
      if (this.audio.bgm) this.audio.bgm.pause();
    } else {
      if (this.audio.bgm && window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        this.playBGM();
      }
    }
    return this.muted;
  }
};

// Inisialisasi otomatis
SoundManager.init();