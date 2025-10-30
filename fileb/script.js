// ===== PERSISTENT MUSIC PLAYER =====
// Musik akan terus berjalan saat berpindah halaman menggunakan localStorage

class PersistentMusicPlayer {
  constructor() {
    this.audio = document.getElementById("weddingMusic");
    this.toggleBtn = document.getElementById("musicToggle");
    this.textSpan = document.getElementById("musicText");
    
    if (this.audio && this.toggleBtn) {
      this.init();
    }
  }

  init() {
    // Ambil status musik dari localStorage
    const musicState = localStorage.getItem("weddingMusicState");
    const musicTime = parseFloat(localStorage.getItem("weddingMusicTime")) || 0;
    
    // Set waktu terakhir
    this.audio.currentTime = musicTime;
    
    // Jika musik sedang diputar, lanjutkan
    if (musicState === "playing") {
      this.playMusic();
    }
    
    // Event listener untuk tombol
    this.toggleBtn.addEventListener("click", () => this.toggleMusic());
    
    // Simpan posisi musik setiap detik
    this.audio.addEventListener("timeupdate", () => {
      localStorage.setItem("weddingMusicTime", this.audio.currentTime);
    });
    
    // Auto play on first user interaction
    document.addEventListener("click", () => this.autoPlay(), { once: true });
  }

  playMusic() {
    this.audio.play().then(() => {
      this.textSpan.textContent = "Musik Diputar";
      this.toggleBtn.style.background = "#5d4037";
      localStorage.setItem("weddingMusicState", "playing");
    }).catch((error) => {
      console.log("Autoplay prevented:", error);
    });
  }

  pauseMusic() {
    this.audio.pause();
    this.textSpan.textContent = "Putar Musik";
    this.toggleBtn.style.background = "#8b4513";
    localStorage.setItem("weddingMusicState", "paused");
  }

  toggleMusic() {
    if (this.audio.paused) {
      this.playMusic();
    } else {
      this.pauseMusic();
    }
  }

  autoPlay() {
    if (this.audio.paused && localStorage.getItem("weddingMusicState") !== "paused") {
      this.playMusic();
    }
  }
}

// Initialize music player
window.addEventListener("load", function () {
  new PersistentMusicPlayer();
});

// ===== LOADING SCREEN =====
window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 2000);
  }
});

// ===== NAVIGATION =====
const navbar = document.getElementById("navbar");
let lastScrollY = window.scrollY;

if (navbar) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("visible");
    } else {
      navbar.classList.remove("visible");
    }

    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
  });

  if (window.scrollY > 100) {
    navbar.classList.add("visible");
  }
}

// Smooth scrolling
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    const weddingDate = new Date("December 28, 2024 10:00:00").getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, "0");
    hoursEl.textContent = hours.toString().padStart(2, "0");
    minutesEl.textContent = minutes.toString().padStart(2, "0");
    secondsEl.textContent = seconds.toString().padStart(2, "0");

    if (distance < 0) {
      clearInterval(countdownInterval);
      const countdownTimer = document.querySelector(".countdown-timer");
      if (countdownTimer) {
        countdownTimer.innerHTML = "<h3>Hari yang diberkati telah tiba! 🙏</h3>";
      }
    }
  }
}

const countdownElements = document.getElementById("days");
if (countdownElements) {
  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
}

// ===== RSVP FORM =====
const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      attendance: document.getElementById("attendance").value,
      guests: document.getElementById("guests").value,
      message: document.getElementById("message").value,
    };

    const existingData = JSON.parse(localStorage.getItem("weddingRSVP")) || [];
    existingData.push({
      ...formData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("weddingRSVP", JSON.stringify(existingData));

    showNotification(
      "Tuhan memberkati! Konfirmasi kehadiran Anda telah tercatat. 🙏",
      "success"
    );
    rsvpForm.reset();
  });
}

// ===== NOTIFICATION =====
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : "cross"}"></i>
    <span>${message}</span>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#8b4513" : "#a0522d"};
    color: white;
    padding: 18px 25px;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease;
    font-family: 'Poppins', sans-serif;
    border: 2px solid rgba(255, 255, 255, 0.2);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// ===== ANIMATION STYLES =====
if (!document.querySelector("style[data-notifications]")) {
  const style = document.createElement("style");
  style.setAttribute("data-notifications", "true");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ===== CATHOLIC CROSS ANIMATION =====
function createCrossAnimation() {
  const crossContainer = document.querySelector(".cross-animation");
  if (crossContainer) {
    setInterval(() => {
      const cross = document.createElement("div");
      cross.innerHTML = "✝";
      cross.style.cssText = `
        position: absolute;
        color: rgba(139, 69, 19, 0.3);
        font-size: ${Math.random() * 16 + 12}px;
        left: ${Math.random() * 100}%;
        top: 100%;
        animation: fallCross ${Math.random() * 5 + 4}s linear forwards;
        opacity: ${Math.random() * 0.4 + 0.3};
      `;
      crossContainer.appendChild(cross);
      setTimeout(() => {
        if (crossContainer.contains(cross)) {
          cross.remove();
        }
      }, 9000);
    }, 800);
  }
}

// Add cross fall animation
if (!document.querySelector("style[data-cross]")) {
  const crossStyle = document.createElement("style");
  crossStyle.setAttribute("data-cross", "true");
  crossStyle.textContent = `
    @keyframes fallCross {
      to {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(crossStyle);
}

createCrossAnimation();

// ===== SCROLL ANIMATIONS =====
document.addEventListener("DOMContentLoaded", function () {
  // Form animations
  document
    .querySelectorAll(
      ".form-group input, .form-group select, .form-group textarea"
    )
    .forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });
      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused");
        }
      });
      if (input.value) {
        input.parentElement.classList.add("focused");
      }
    });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".couple-container > div, .event-card, .gallery-item, .rsvp-form, .timeline-item"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(el);
    });
});

// ===== ROSARY BEADS ANIMATION =====
function createRosaryBeads() {
  const container = document.getElementById("rosaryContainer");
  if (container) {
    setInterval(() => {
      const bead = document.createElement("div");
      bead.className = "rosary-bead";
      bead.innerHTML = "●";
      bead.style.cssText = `
        position: absolute;
        color: rgba(139, 69, 19, 0.3);
        font-size: ${Math.random() * 12 + 8}px;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.3 + 0.1};
        animation: rosaryFall ${Math.random() * 8 + 6}s linear forwards;
      `;

      container.appendChild(bead);

      setTimeout(() => {
        bead.remove();
      }, 14000);
    }, 500);
  }
}

// Add rosary animation style
if (!document.querySelector("style[data-rosary]")) {
  const rosaryStyle = document.createElement("style");
  rosaryStyle.setAttribute("data-rosary", "true");
  rosaryStyle.textContent = `
    @keyframes rosaryFall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rosaryStyle);
}

createRosaryBeads();

// ===== ACTIVE PAGE HIGHLIGHT =====
document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a");
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});
