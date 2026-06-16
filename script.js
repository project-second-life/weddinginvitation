/* ═══════════════════════════════════════════════════════════════════
   LUXURY CHINESE WEDDING INVITATION — Script
   Golden particles, enhanced audio, cinematic reveals
   ═══════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  // ─── DOM References ───
  const countdown     = document.querySelector(".countdown");
  const targetDate    = countdown ? new Date(countdown.dataset.date).getTime() : 0;
  const storageKey    = "michael-merlin-wedding-wishes";

  const rsvpForm      = document.querySelector(".rsvp-form");
  const wishesList    = document.querySelector("#wishes-list");
  const clearButton   = document.querySelector(".clear-wishes");
  const guestName     = document.querySelector("#guest-name");
  const coverGuestName = document.querySelector("#cover-guest-name");
  const musicToggle   = document.querySelector(".music-fab");
  const romanceLayer  = document.querySelector(".floating-romance");
  const gate          = document.querySelector(".gate");
  const openBtn       = document.querySelector(".open-invitation");
  const particleCanvas = document.querySelector("#golden-particles");

  // Audio state — declared once here, used by both HTML5 Audio and synth fallback
  let audioContext;
  let musicTimer;
  let isPlaying = false;
  let bgAudio = null;
  let audioFailed = false;

  // ─── Utility ───
  const pad = (v) => String(v).padStart(2, "0");

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ═══════════════════════════════════════════════════════════════════
  // GOLDEN PARTICLE SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  function initParticles() {
    if (!particleCanvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = particleCanvas.getContext("2d");
    let width, height;
    const particles = [];
    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 15));

    function resize() {
      width = particleCanvas.width = window.innerWidth;
      height = particleCanvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 3 + 0.8;
        this.speedY = -(Math.random() * 1.1 + 0.3); // Rise upwards
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.7 + 0.15;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        // 0 = Imperial Gold, 1 = Phoenix Orange, 2 = Vermillion Ember
        this.colorType = Math.floor(Math.random() * 3);
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.pulse) * 0.25;
        this.pulse += this.pulseSpeed;

        if (this.y < -10) this.reset();
      }

      draw() {
        const heightRatio = Math.max(0, Math.min(1, this.y / height)); // 1 at bottom, 0 at top
        const currentOpacity = this.opacity * heightRatio * (0.65 + 0.35 * Math.sin(this.pulse));
        
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        
        const radius = this.size * (0.4 + 0.6 * heightRatio);
        ctx.arc(this.x, this.y, radius * 3.5, 0, Math.PI * 2);

        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 3.5);
        if (this.colorType === 0) {
          // Imperial Gold
          grd.addColorStop(0, "rgba(252, 223, 135, 0.95)");
          grd.addColorStop(0.3, "rgba(212, 168, 67, 0.5)");
          grd.addColorStop(1, "rgba(212, 168, 67, 0)");
        } else if (this.colorType === 1) {
          // Phoenix Orange
          grd.addColorStop(0, "rgba(255, 120, 50, 0.95)");
          grd.addColorStop(0.35, "rgba(232, 93, 58, 0.45)");
          grd.addColorStop(1, "rgba(232, 93, 58, 0)");
        } else {
          // Vermillion
          grd.addColorStop(0, "rgba(242, 79, 61, 0.9)");
          grd.addColorStop(0.4, "rgba(194, 58, 34, 0.35)");
          grd.addColorStop(1, "rgba(194, 58, 34, 0)");
        }

        ctx.fillStyle = grd;
        ctx.fill();

        // Hot inner core
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ═══════════════════════════════════════════════════════════════════
  // COUNTDOWN
  // ═══════════════════════════════════════════════════════════════════
  function updateCountdown() {
    if (!targetDate) return;

    const distance = Math.max(targetDate - Date.now(), 0);
    const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    animateDigit("days", pad(days));
    animateDigit("hours", pad(hours));
    animateDigit("minutes", pad(minutes));
    animateDigit("seconds", pad(seconds));
  }

  function animateDigit(id, value) {
    const el = document.getElementById(id);
    if (!el || el.textContent === value) return;
    el.textContent = value;
    el.style.transform = "scale(1.08)";
    el.style.transition = "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    setTimeout(() => { el.style.transform = "scale(1)"; }, 200);
  }

  // ═══════════════════════════════════════════════════════════════════
  // WISHES (localStorage)
  // ═══════════════════════════════════════════════════════════════════
  function getSavedWishes() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(data) ? data : [];
    }
    catch { return []; }
  }

  function saveWishes(wishes) {
    localStorage.setItem(storageKey, JSON.stringify(wishes));
  }

  function renderWishes() {
    if (!wishesList) return;

    const wishes = getSavedWishes();

    if (wishes.length === 0) {
      wishesList.innerHTML =
        '<p class="empty-wishes">No wishes yet. Be the first to send one. · 还没有祝福留言。</p>';
      return;
    }

    wishesList.innerHTML = wishes
      .map(
        (wish) => `
        <article class="wish-card">
          <div>
            <strong>${escapeHtml(wish.name)}</strong>
            <span>${escapeHtml(wish.attendance)} · ${escapeHtml(wish.date)}</span>
          </div>
          <p>${escapeHtml(wish.message)}</p>
        </article>`
      )
      .join("");
  }

  // ═══════════════════════════════════════════════════════════════════
  // GUEST NAME FROM URL
  // ═══════════════════════════════════════════════════════════════════
  function setGuestName() {
    const params = new URLSearchParams(window.location.search);
    const inviteName = params.get("to") || params.get("guest") || params.get("name");
    const name = inviteName && inviteName.trim() ? inviteName.trim() : "Honored Guest";

    if (guestName) guestName.textContent = name;
    if (coverGuestName) coverGuestName.textContent = name;
  }

  // ═══════════════════════════════════════════════════════════════════
  // MUSIC — Chinese Wedding BGM (HTML5 Audio + Synth Fallback)
  // ═══════════════════════════════════════════════════════════════════
  // Free royalty-free Chinese guzheng instrumental from Pixabay CDN
  const MUSIC_URLS = [
    "assets/song.mp3",
    "https://archive.org/download/TheMoonRepresentsMyHeartTeresaTeng/The%20Moon%20Represents%20My%20Heart%20-%20Teresa%20Teng.mp3",
  ];

  function initBgAudio() {

    if (bgAudio) return bgAudio;
    bgAudio = new Audio();
    bgAudio.loop = true;
    bgAudio.volume = 0;
    bgAudio.preload = "none";
    bgAudio.src = MUSIC_URLS[0];

    bgAudio.addEventListener("error", () => {
      // Try second URL
      if (bgAudio.src !== MUSIC_URLS[1]) {
        bgAudio.src = MUSIC_URLS[1];
        bgAudio.load();
        bgAudio.play().catch(() => { audioFailed = true; startSynthFallback(); });
      } else {
        audioFailed = true;
        startSynthFallback();
      }
    });

    return bgAudio;
  }

  function fadeAudio(targetVol, durationMs) {
    if (!bgAudio) return;
    const steps = 30;
    const stepTime = durationMs / steps;
    const startVol = bgAudio.volume;
    const delta = (targetVol - startVol) / steps;
    let step = 0;
    const fade = setInterval(() => {
      step++;
      bgAudio.volume = Math.max(0, Math.min(1, startVol + delta * step));
      if (step >= steps) clearInterval(fade);
    }, stepTime);
  }

  function startMusic() {
    if (!musicToggle) return;
    const audio = initBgAudio();
    const label = musicToggle.querySelector(".music-fab__label");

    musicToggle.classList.add("is-playing");
    musicToggle.setAttribute("aria-pressed", "true");
    label.textContent = "Playing";
    isPlaying = true;

    if (!audioFailed) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => { fadeAudio(0.42, 1200); })
          .catch(() => { audioFailed = true; startSynthFallback(); });
      }
    } else {
      startSynthFallback();
    }
  }

  function stopMusic() {
    if (!musicToggle) return;
    isPlaying = false;
    clearInterval(musicTimer);

    if (bgAudio && !bgAudio.paused) {
      fadeAudio(0, 800);
      setTimeout(() => { if (bgAudio) bgAudio.pause(); }, 900);
    }

    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.querySelector(".music-fab__label").textContent = "Music";
  }

  // ─── Synth Fallback — Chinese Pentatonic ───
  function playNote(freq, startTime, duration, type = "sine", volume = 0.06) {
    const osc  = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  function scheduleMelody() {
    if (!audioContext || !isPlaying) return;
    const melody = [
      { freq: 523.25, dur: 0.5  },
      { freq: 587.33, dur: 0.35 },
      { freq: 659.25, dur: 0.5  },
      { freq: 783.99, dur: 0.6  },
      { freq: 659.25, dur: 0.35 },
      { freq: 587.33, dur: 0.5  },
      { freq: 523.25, dur: 0.6  },
      { freq: 392.00, dur: 0.7  },
    ];
    const now = audioContext.currentTime + 0.05;
    let offset = 0;
    melody.forEach(({ freq, dur }) => {
      playNote(freq, now + offset, dur, "sine", 0.055);
      playNote(freq * 2, now + offset, dur * 0.7, "sine", 0.015);
      playNote(freq / 2, now + offset, dur * 0.5, "triangle", 0.02);
      offset += dur * 0.8;
    });
  }

  function startSynthFallback() {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    scheduleMelody();
    musicTimer = setInterval(scheduleMelody, 3800);
  }


  // ═══════════════════════════════════════════════════════════════════
  // FLOATING PETALS
  // ═══════════════════════════════════════════════════════════════════
  function createPetal() {
    if (!romanceLayer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const petal = document.createElement("span");
    const types = ["gold", "ember", "red"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    petal.className = `petal petal--${randomType}`;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.random() * 140 - 70}px`);
    petal.style.animationDuration = `${8 + Math.random() * 6}s`;
    romanceLayer.append(petal);
    setTimeout(() => petal.remove(), 15000);
  }

  // ═══════════════════════════════════════════════════════════════════
  // OPENING GATE
  // ═══════════════════════════════════════════════════════════════════
  function openInvitation() {
    if (!gate) return;

    gate.classList.add("is-hidden");
    document.body.classList.remove("cover-open");
    startMusic();
  }

  // ═══════════════════════════════════════════════════════════════════
  // SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════════════════════════════════════
  function setupRevealAnimation() {
    const revealItems = document.querySelectorAll(
      ".section__header, .profile-card, .prewed-copy, .prewed-frame, " +
      ".countdown-inner > *, .event-card, .story-visual, .story-copy, " +
      ".section--blessing blockquote, .rsvp-form, .wishes-panel"
    );

    revealItems.forEach((item, index) => {
      item.classList.add("reveal-target");
      item.style.transitionDelay = `${index % 4 * 80}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  // ─── Prewedding Slideshow ───
  function initPrewedSlideshow() {
    const container = document.getElementById("prewed-slideshow");
    if (!container) return;

    const images = [
      "assets/Real/20230718_144029.jpg",
      "assets/Real/20230903_132024.jpg",
      "assets/Real/20230903_134351.jpg",
      "assets/Real/IMG20240214154047.jpg",
      "assets/Real/IMG20240218111950.jpg",
      "assets/Real/IMG20240218113136.jpg",
      "assets/Real/IMG20240413122836.jpg",
      "assets/Real/IMG20240521161329.jpg",
      "assets/Real/IMG20240521161440.jpg",
      "assets/Real/IMG20240523163421.jpg",
      "assets/Real/IMG20241221125226.jpg",
      "assets/Real/IMG20241223145546.jpg",
      "assets/Real/IMG20250413145116.jpg",
      "assets/Real/IMG20250502213650.jpg",
      "assets/Real/IMG20250622195328.jpg",
      "assets/Real/IMG20250622195444.jpg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.34.52.jpeg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.34.56 (1).jpeg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.34.56.jpeg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.34.57.jpeg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.34.58 (1).jpeg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.34.58.jpeg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.34.59.jpeg",
      "assets/Real/WhatsApp Image 2026-06-16 at 16.35.01.jpeg"
    ];

    let currentIndex = 0;
    const imgElements = [];

    const firstImg = container.querySelector("img");
    if (firstImg) {
      imgElements.push(firstImg);
    }

    images.slice(1).forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Romantic prewedding portrait of Michael Vinci and Merlin";
      img.loading = "lazy";
      container.appendChild(img);
      imgElements.push(img);
    });

    setInterval(() => {
      imgElements[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % imgElements.length;
      imgElements[currentIndex].classList.add("active");
    }, 3500);
  }

  // ═══════════════════════════════════════════════════════════════════
  // INITIALISE
  // ═══════════════════════════════════════════════════════════════════
  if (gate) {
    document.body.classList.add("cover-open");
  }

  setGuestName();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  renderWishes();
  setInterval(createPetal, 1200);
  setupRevealAnimation();
  initParticles();
  initPrewedSlideshow();

  // ─── Event Listeners ───
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form     = event.currentTarget;
      const formData = new FormData(form);
      const name       = formData.get("name").trim();
      const attendance = formData.get("attendance");
      const message    = formData.get("message").trim();
      const note       = form.querySelector(".form-note");

      const wishes = getSavedWishes();
      wishes.unshift({
        name,
        attendance,
        message,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      });

      saveWishes(wishes);
      renderWishes();
      note.textContent = `Thank you, ${name}. Your RSVP and wishes have been saved. · 谢谢，您的回复和祝福已保存。`;
      form.reset();
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      localStorage.removeItem(storageKey);
      renderWishes();
    });
  }

  if (openBtn && gate) {
    openBtn.addEventListener("click", openInvitation);
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      if (isPlaying) { stopMusic(); } else { startMusic(); }
    });
  }
})();
