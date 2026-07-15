import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// NAVIGATION CLOCK
// ==========================================
function updateClock() {
  const clockEl = document.getElementById('nav-clock');
  if (!clockEl) return;
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = String(hours).padStart(2, '0');
  clockEl.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// CUSTOM CURSOR
// ==========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Immediately place the dot
    gsap.set(cursorDot, {
      x: mouseX,
      y: mouseY
    });
  });

  // Smooth lagging follow for the ring
  gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
    ringX += (mouseX - ringX) * dt;
    ringY += (mouseY - ringY) * dt;

    gsap.set(cursorRing, {
      x: ringX,
      y: ringY
    });
  });

  // Hover transitions
  const hoverTargets = document.querySelectorAll('.hover-target, a, button, .project-media-wrapper');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-link');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-link');
    });
  });
}

// ==========================================
// SOUPED-UP INITIAL LOADER
// ==========================================
const loaderWords = ["ROBOTICS", "AUTOMATION", "ALGORITHMS", "DEEP LEARNING", "FAISAL AL-DROU"];
const wordEl = document.getElementById('loader-word');
const progressEl = document.getElementById('loader-progress-bar');
const percentEl = document.getElementById('loader-percentage');
const loaderEl = document.getElementById('loader');

let count = 0;
let currentWordIndex = 0;

if (wordEl && progressEl && percentEl && loaderEl) {
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 6) + 3;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);
      hideLoader();
    }
    percentEl.textContent = `${count}%`;
    progressEl.style.width = `${count}%`;

    // Word cycle logic based on progress percentage
    const expectedIndex = Math.floor((count / 100) * loaderWords.length);
    if (expectedIndex > currentWordIndex && expectedIndex < loaderWords.length) {
      currentWordIndex = expectedIndex;
      
      gsap.to(wordEl, {
        y: -30,
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          wordEl.textContent = loaderWords[currentWordIndex];
          gsap.fromTo(wordEl, 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
          );
        }
      });
    }
  }, 45);
}

function hideLoader() {
  if (!loaderEl) return;
  const tl = gsap.timeline({
    onComplete: () => {
      loaderEl.style.display = 'none';
      startEntranceAnimations();
    }
  });

  tl.to(wordEl, { opacity: 0, y: -20, duration: 0.4, ease: "power2.inOut" })
    .to(loaderEl, { 
      yPercent: -100, 
      duration: 1.2, 
      ease: "power4.inOut" 
    }, "-=0.2");
}

// ==========================================
// ENTRANCE & PAGE TRANSITION ANIMATIONS
// ==========================================
function startEntranceAnimations() {
  // Animate hero text elements
  gsap.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  });

  gsap.from('.hero-title span', {
    y: 100,
    opacity: 0,
    stagger: 0.18,
    duration: 1.4,
    ease: "power4.out",
    delay: 0.15
  });

  gsap.from('.hero-intro-para', {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.6
  });

  gsap.from('.hero-visual-wrapper', {
    scale: 0.96,
    opacity: 0,
    duration: 1.6,
    ease: "power4.out",
    delay: 0.4
  });

  gsap.from('.hero-scroll-indicator', {
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
    delay: 1.0
  });

  gsap.from('header', {
    y: -40,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.8
  });
}

// ==========================================
// SCROLLTRIGGER CONTENT REVEALS & PARALLAX
// ==========================================
// Section grid basic reveals
gsap.utils.toArray('.section-grid').forEach(sec => {
  const label = sec.querySelector('.section-label');
  const content = sec.querySelector('.section-content');

  if (label) {
    gsap.from(label, {
      opacity: 0,
      x: -40,
      duration: 1.2,
      scrollTrigger: {
        trigger: sec,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }

  if (content) {
    gsap.from(content, {
      opacity: 0,
      y: 50,
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sec,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }
});

// Parallax effects on project images
document.querySelectorAll('.project-item').forEach(item => {
  const img = item.querySelector('.project-img');
  if (img) {
    gsap.fromTo(img, 
      { yPercent: -12 },
      { 
        yPercent: 12, 
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  }
});

// Stagger reveals for list elements
const skillsRows = document.querySelectorAll('.skills-row');
if (skillsRows.length > 0) {
  gsap.from(skillsRows, {
    opacity: 0,
    y: 35,
    stagger: 0.2,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '#skills',
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}
