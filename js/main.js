/* eslint-env browser */
/* global performance, IntersectionObserver */

/* =============================================
   EHTASHAM PORTFOLIO – MAIN JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PRELOADER ──────────────────────────── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
      revealOnScroll();
    }, 900);
  });

  /* ── HEADER SCROLL ──────────────────────── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
    toggleBackToTop();
    checkSkillBars();
    revealOnScroll();
  });

  /* ── MOBILE MENU ────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const navbar     = document.getElementById('navbar');
  const navOverlay = document.createElement('div');
  navOverlay.classList.add('nav-overlay');
  document.body.appendChild(navOverlay);

  function openNav() {
    navbar.classList.add('open');
    hamburger.classList.add('open');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    navbar.classList.remove('open');
    hamburger.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    navbar.classList.contains('open') ? closeNav() : openNav();
  });
  navOverlay.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ── ACTIVE NAV LINK ────────────────────── */
  function updateActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 130;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
    });
  }

  /* ── SMOOTH SCROLL ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
  });

  /* ── PORTFOLIO FILTER ───────────────────── */
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.style.animation = 'fadeInUp 0.4s ease forwards';
      });
    });
  });

  /* ── PRICING TOGGLE ─────────────────────── */
  const pricingToggle = document.getElementById('pricing-toggle');
  const monthlyLabel  = document.getElementById('monthly-label');
  const yearlyLabel   = document.getElementById('yearly-label');
  let isYearly = false;

  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      isYearly = !isYearly;
      pricingToggle.classList.toggle('on', isYearly);
      if (monthlyLabel) monthlyLabel.classList.toggle('active', !isYearly);
      if (yearlyLabel)  yearlyLabel.classList.toggle('active',  isYearly);

      document.querySelectorAll('.price-amount').forEach(el => {
        el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        el.style.transform  = 'scale(0.8)';
        el.style.opacity    = '0';
        setTimeout(() => {
          el.textContent     = isYearly ? el.dataset.yearly : el.dataset.monthly;
          el.style.transform = 'scale(1)';
          el.style.opacity   = '1';
        }, 200);
      });
      document.querySelectorAll('.price-period').forEach(el => {
        el.textContent = isYearly ? '/year' : '/month';
      });
    });
  }

  /* ── COUNTER ANIMATION ──────────────────── */
  function animateCounter(el) {
    const target    = parseInt(el.dataset.count, 10);
    const duration  = 2000;
    const startTime = (window.performance || performance).now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target; // guarantee exact final value
      }
    }
    requestAnimationFrame(tick);
  }

  /* ── COUNTER OBSERVER ───────────────────── */
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    const ObserverClass = window.IntersectionObserver || IntersectionObserver;
    const counterObserver = new ObserverClass((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        document.querySelectorAll('.stat-number').forEach((el, i) => {
          setTimeout(() => {
            el.closest('.stat-card')?.classList.add('counting');
            animateCounter(el);
            setTimeout(() => {
              el.closest('.stat-card')?.classList.remove('counting');
            }, 2300);
          }, i * 300); // stagger: 0ms, 200ms, 400ms, 600ms
        });

        obs.unobserve(statsGrid); // fire once only
      });
    }, {
      threshold: 0.25 // trigger when 25% of grid is visible
    });

    counterObserver.observe(statsGrid);
  }

  /* ── SCROLL REVEAL ──────────────────────── */
  function revealOnScroll() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  // Assign reveal classes
  document.querySelector('.hero-content')?.classList.add('reveal-left');
  document.querySelector('.hero-image-wrap')?.classList.add('reveal-right');
  document.querySelector('.about-left')?.classList.add('reveal-left');
  document.querySelector('.about-right')?.classList.add('reveal-right');
  document.querySelector('.contact-left')?.classList.add('reveal-left');
  document.querySelector('.contact-right')?.classList.add('reveal-right');

  [
    ['.service-card',    0.08],
    ['.portfolio-card',  0.07],
    ['.testimonial-card',0.10],
    ['.pricing-card',    0.10],
    ['.blog-card',       0.10],
    ['.exp-card',        0.08],
    ['.cert-badge',      0.07],
    ['.leadership-card', 0.10],
    ['.stat-card',       0.10],
  ].forEach(([sel, delay]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * delay}s`;
    });
  });

  revealOnScroll(); // run once on load

  /* ── SKILL BARS ─────────────────────────── */
  let skillsAnimated = false;
  function checkSkillBars() {
    if (skillsAnimated) return;
    const wrap = document.querySelector('.skill-bar-wrap');
    if (!wrap) return;
    if (wrap.getBoundingClientRect().top < window.innerHeight - 80) {
      skillsAnimated = true;
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  }
  checkSkillBars(); // check on load too

  /* ── CONTACT FORM ───────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        btn.disabled  = false;
        if (formSuccess) formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess?.classList.remove('show'), 5000);
      }, 1800);
    });
  }

  /* ── BACK TO TOP ────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  function toggleBackToTop() {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
  }
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── TYPED HERO GREETING ────────────────── */
  const typedTarget = document.querySelector('.hero-greeting');
  if (typedTarget) {
    const phrases = [
      "Hello, I'm Ehtasham 👋",
      "I'm a DevOps Engineer 🐳",
      "I'm a MERN Stack Developer 💻",
      "I Build Cloud Infrastructure ☁️",
      "Welcome to my Portfolio ✨"
    ];
    let pi = 0, ci = 0, deleting = false, pauseTicks = 0;

    function type() {
      const phrase = phrases[pi];
      if (pauseTicks > 0) { pauseTicks--; setTimeout(type, 80); return; }

      if (!deleting) {
        typedTarget.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; pauseTicks = 28; }
      } else {
        typedTarget.textContent = phrase.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          pauseTicks = 8;
        }
      }
      setTimeout(type, deleting ? 55 : 110);
    }
    setTimeout(type, 1400); // start after preloader
  }

  /* ── PARALLAX GLOW ──────────────────────── */
  const glow = document.querySelector('.hero-bg-glow');
  window.addEventListener('mousemove', e => {
    if (!glow) return;
    glow.style.transform = `translate(${(e.clientX / window.innerWidth  - 0.5) * 40}px,
                                       ${(e.clientY / window.innerHeight - 0.5) * 40}px)`;
  });

  /* ── INJECT fadeInUp KEYFRAME ───────────── */
  const s = document.createElement('style');
  s.textContent = `
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0);    }
    }
  `;
  document.head.appendChild(s);

}); // end DOMContentLoaded