// ===========================================
// PAGE LOADER
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    loader?.classList.add('hidden');
  }, 800);
});

// ===========================================
// STARFIELD ANIMATION
// ===========================================
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  const numStars = 200;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
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
// CUSTOM CURSOR
// ===========================================
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = (mouseX - 3) + 'px';
    cursorDot.style.top = (mouseY - 3) + 'px';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = (cursorX - 10) + 'px';
    cursor.style.top = (cursorY - 10) + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effect to interactive elements
  const interactiveElements = 'a, button, .btn, .project-card, .skill-category, .cert-card, .stat-card, .education-card, .timeline-content, .highlight-item';
  document.querySelectorAll(interactiveElements).forEach(el => {
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
// SCROLL PROGRESS BAR
// ===========================================
function initScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
  });
}

initScrollProgress();

// ===========================================
// NAVIGATION SCROLL EFFECT
// ===========================================
function initNavScroll() {
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

initNavScroll();

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
        const increment = target / 50;
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

        const children = entry.target.querySelectorAll(
          '.project-card, .skill-category, .cert-card, .stat-card, .education-card, .timeline-item, .highlight-item'
        );
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

    const children = section.querySelectorAll(
      '.project-card, .skill-category, .cert-card, .stat-card, .education-card, .timeline-item, .highlight-item'
    );
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
// PARALLAX EFFECT ON HERO IMAGE
// ===========================================
function initParallax() {
  const heroImage = document.querySelector('.hero-image-container');

  window.addEventListener('scroll', () => {
    if (!heroImage) return;
    const scrolled = window.scrollY;
    if (scrolled < 800) {
      heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
}

initParallax();

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
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
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
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

initRippleEffect();
