// ===========================================
// CONSTANTS
// ===========================================
const LOADER_DELAY_MS = 800;
const STAR_COUNT = 200;
const COUNTER_STEPS = 50;
const PARALLAX_SCROLL_THRESHOLD = 800;
const PARALLAX_FACTOR = 0.15;
const NAV_SCROLL_THRESHOLD = 50;
const CURSOR_SMOOTHING = 0.15;
const THROTTLE_DELAY_MS = 16;
const RIPPLE_DURATION_MS = 600;

// Shared selector for animated cards
const ANIMATED_CARD_SELECTORS = '.project-card, .skill-category, .cert-card, .stat-card, .education-card, .timeline-item, .highlight-item';

// Interactive elements for custom cursor
const INTERACTIVE_ELEMENTS = 'a, button, .btn, .project-card, .skill-category, .cert-card, .stat-card, .education-card, .timeline-content, .highlight-item';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Throttle function to limit how often a function can be called
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===========================================
// PAGE LOADER
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    loader?.classList.add('hidden');
  }, LOADER_DELAY_MS);
});

// ===========================================
// STARFIELD ANIMATION
// ===========================================
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        twinkle: Math.random() * 0.02
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.opacity += star.twinkle;
      if (star.opacity > 0.8 || star.opacity < 0.2) {
        star.twinkle = -star.twinkle;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${star.opacity})`;
      ctx.fill();

      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  createStars();
  drawStars();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
  });
}

initStarfield();

// ===========================================
// CUSTOM CURSOR (with throttled mousemove)
// ===========================================
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  const handleMouseMove = throttle((e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = (mouseX - 3) + 'px';
    cursorDot.style.top = (mouseY - 3) + 'px';
  }, THROTTLE_DELAY_MS);

  document.addEventListener('mousemove', handleMouseMove);

  function animateCursor() {
    cursorX += (mouseX - cursorX) * CURSOR_SMOOTHING;
    cursorY += (mouseY - cursorY) * CURSOR_SMOOTHING;
    cursor.style.left = (cursorX - 10) + 'px';
    cursor.style.top = (cursorY - 10) + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effect to interactive elements
  document.querySelectorAll(INTERACTIVE_ELEMENTS).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

initCustomCursor();

// ===========================================
// MAGNETIC BUTTON EFFECT
// ===========================================
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

initMagneticButtons();

// ===========================================
// CONSOLIDATED SCROLL HANDLER
// ===========================================
function initScrollHandlers() {
  const scrollProgress = document.querySelector('.scroll-progress');
  const nav = document.querySelector('nav');
  const heroImage = document.querySelector('.hero-image-container');

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Scroll progress bar
    if (scrollProgress) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }

    // Navigation scroll effect
    if (nav) {
      if (scrollY > NAV_SCROLL_THRESHOLD) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Parallax effect on hero image
    if (heroImage && scrollY < PARALLAX_SCROLL_THRESHOLD) {
      heroImage.style.transform = `translateY(${scrollY * PARALLAX_FACTOR}px)`;
    }
  }, THROTTLE_DELAY_MS);

  window.addEventListener('scroll', handleScroll);
}

initScrollHandlers();

// ===========================================
// MOBILE MENU TOGGLE
// ===========================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

initMobileMenu();

// ===========================================
// TYPING EFFECT
// ===========================================
function initTypingEffect() {
  const typingTexts = [
    'Building ML pipelines & dashboards',
    'Transforming data into insights',
    'Python | SQL | PyTorch | Tableau',
    'B.S. in Data Science @ UC Riverside'
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.querySelector('.typing-text');

  if (!typingElement) return;

  function type() {
    const currentText = typingTexts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % typingTexts.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

initTypingEffect();

// ===========================================
// COUNTER ANIMATION
// ===========================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / COUNTER_STEPS;
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current) + '+';
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + '+';
          }
        };

        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

initCounters();

// ===========================================
// SECTION FADE-IN ANIMATIONS
// ===========================================
function initSectionAnimations() {
  const sections = document.querySelectorAll('section, .stats-section');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';

        const children = entry.target.querySelectorAll(ANIMATED_CARD_SELECTORS);
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 100);
        });
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    const children = section.querySelectorAll(ANIMATED_CARD_SELECTORS);
    children.forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    sectionObserver.observe(section);
  });
}

initSectionAnimations();

// ===========================================
// SMOOTH SCROLLING
// ===========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

initSmoothScroll();

// ===========================================
// BUTTON RIPPLE EFFECT
// ===========================================
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple ${RIPPLE_DURATION_MS}ms ease-out;
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), RIPPLE_DURATION_MS);
    });
  });
}

initRippleEffect();
