javascript

/* ============================================
   CiPHER — script.js
   ============================================ */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Toast notification ── */
const toast     = document.getElementById('toast');
const toastMsg  = document.getElementById('toastMsg');
let   toastTimer;

function showToast(msg, duration = 3000) {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Download handler ── */
const platformMessages = {
  windows : 'Windows installer download starting…',
  mac     : 'macOS disk image download starting…',
  linux   : 'Linux AppImage download starting…',
  android : 'Android APK download starting…',
  chrome  : 'Opening Chrome Web Store…',
  firefox : 'Opening Firefox Add-ons…',
};

const downloadURLs = {
  windows : '#',
  mac     : '#',
  linux   : '#',
  android : '#',
  chrome  : '#',
  firefox : '#',
};

function handleDownload(event, platform) {
  event.preventDefault();
  const url = downloadURLs[platform];
  showToast(platformMessages[platform] || 'Download starting…');

  if (url && url !== '#') {
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 400);
  }
}

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height + buffer
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Back to top button ── */
const backToTopBtn = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 350) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', updateBackToTop, { passive: true });

/* ── Bottom navigation — show/hide with fade ── */
const bottomNav = document.getElementById('bottomNav');
const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
let bottomNavVisible = false;

function updateBottomNav() {
  const shouldShow = window.scrollY > 200;
  if (shouldShow !== bottomNavVisible) {
    bottomNavVisible = shouldShow;
    if (shouldShow) {
      bottomNav.classList.add('visible');
    } else {
      bottomNav.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', updateBottomNav, { passive: true });

/* ── Bottom nav active link highlight ── */
const sections = document.querySelectorAll('section[id]');

const bottomNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      bottomNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => bottomNavObserver.observe(s));

/* ── Top nav active link highlight ── */
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cyan)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Word-by-word reveal on section titles ── */
function prepareWordReveal() {
  const titles = document.querySelectorAll('.reveal-words');
  titles.forEach(title => {
    // Walk child nodes and wrap words in each text node
    const nodes = Array.from(title.childNodes);
    title.innerHTML = '';

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim() === '') {
            title.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement('span');
            span.className = 'word-reveal-span';
            span.textContent = word;
            title.appendChild(span);
          }
        });
      } else {
        // element node (e.g. <span class="accent">)
        const el = node;
        if (el.textContent) {
          el.classList.add('word-reveal-span');
        }
        title.appendChild(el);
      }
    });
  });
}

prepareWordReveal();

const wordRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const spans = entry.target.querySelectorAll('.word-reveal-span');
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.classList.add('revealed');
        }, i * 90);
      });
      wordRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-words').forEach(el => {
  wordRevealObserver.observe(el);
});

/* ── Coach badge label pulse-in ── */
const coachBadge = document.querySelector('.section-coach-badge');
if (coachBadge) {
  coachBadge.style.opacity = '0';
  coachBadge.style.transform = 'translateX(-12px)';
  coachBadge.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';

  const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        coachBadge.style.opacity = '1';
        coachBadge.style.transform = 'translateX(0)';
        badgeObserver.unobserve(coachBadge);
      }
    });
  }, { threshold: 0.5 });
  badgeObserver.observe(coachBadge);
}

/* ── Scroll-reveal animation for cards ── */
const revealEls = document.querySelectorAll(
  '.feature-card, .platform-card, .ext-card, .story-quote-block, .android-browser-card, .screenshot-card, .screenshots-stats'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s`;
  revealObserver.observe(el);
});

/* ── Installation Guide — tab switching ── */
const installTabs   = document.querySelectorAll('.install-tab');
const installPanels = document.querySelectorAll('.install-panel');

installTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    installTabs.forEach(t => {
      t.classList.remove('install-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    installPanels.forEach(p => p.classList.add('install-panel--hidden'));
    tab.classList.add('install-tab--active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(target);
    if (panel) panel.classList.remove('install-panel--hidden');
  });
});

/* ── Install screenshot shimmer removal ── */
document.querySelectorAll('.install-shot-frame').forEach(frame => {
  const img = frame.querySelector('.install-shot-img');
  if (!img) return;
  const markLoaded = () => frame.classList.add('loaded');
  if (img.complete && img.naturalWidth > 0) {
    markLoaded();
  } else {
    img.addEventListener('load', markLoaded);
    img.addEventListener('error', markLoaded);
  }
});

/* ── Hero logo fallback ── */
const heroLogo = document.getElementById('heroLogo');
if (heroLogo) {
  heroLogo.addEventListener('error', () => {
    heroLogo.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 180px; height: 180px;
      border: 2px solid rgba(14,165,233,0.4);
      border-radius: 24px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem; font-weight: 900;
      color: #0ea5e9;
      letter-spacing: 0.12em;
      background: rgba(14,165,233,0.05);
    `;
    placeholder.textContent = 'CiPHER';
    heroLogo.parentNode.insertBefore(placeholder, heroLogo);
  });
}

/* ── Typing cursor effect on hero tagline ── */
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const fullText = heroSub.textContent;
  heroSub.textContent = '';
  heroSub.style.borderRight = '2px solid #0ea5e9';

  let idx = 0;
  const typeInterval = setInterval(() => {
    heroSub.textContent += fullText[idx];
    idx++;
    if (idx >= fullText.length) {
      clearInterval(typeInterval);
      setTimeout(() => { heroSub.style.borderRight = 'none'; }, 800);
    }
  }, 45);
}

/* ── Navbar logo subtle glitch effect ── */
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
  setInterval(() => {
    if (Math.random() > 0.92) {
      navLogo.style.textShadow = `
        ${(Math.random() - 0.5) * 4}px 0 rgba(14,165,233,0.7),
        ${(Math.random() - 0.5) * 4}px 0 rgba(99,102,241,0.5)
      `;
      setTimeout(() => { navLogo.style.textShadow = ''; }, 80);
    }
  }, 2500);
}

/* ── Stat counter animation ── */
function animateCounter(el, target, suffix = '') {
  const duration = 1600;
  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (target - from) * eased);
    el.textContent = (target < 50 ? current : '<' + current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statCounters = document.querySelectorAll('.counter[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statCounters.forEach(el => counterObserver.observe(el));

/* ── Hire me button micro-sparkle on hover ── */
const hireMeBtn = document.querySelector('.hire-me-btn');
if (hireMeBtn) {
  hireMeBtn.addEventListener('mouseenter', () => {
    hireMeBtn.style.boxShadow = '0 0 20px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.5)';
  });
  hireMeBtn.addEventListener('mouseleave', () => {
    hireMeBtn.style.boxShadow = '';
  });
}

/* ── Ambient orb parallax on mouse move ── */
const orb1 = document.querySelector('.ambient-orb--1');
const orb2 = document.querySelector('.ambient-orb--2');
if (orb1 && orb2) {
  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const xRatio = e.clientX / window.innerWidth;
      const yRatio = e.clientY / window.innerHeight;
      orb1.style.transform = `translate(${xRatio * 30}px, ${yRatio * 20}px)`;
      orb2.style.transform = `translate(${-xRatio * 20}px, ${-yRatio * 15}px)`;
      ticking = false;
    });
  });
}

/* ── Section entrance: section-coach-badge slide-up ── */
const storyTextParas = document.querySelectorAll('.story-text p');
storyTextParas.forEach((p, i) => {
  p.style.opacity    = '0';
  p.style.transform  = 'translateY(18px)';
  p.style.transition = `opacity 0.55s ease ${0.15 + i * 0.12}s, transform 0.55s ease ${0.15 + i * 0.12}s`;
});

const parasObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.story-text p').forEach(p => {
        p.style.opacity   = '1';
        p.style.transform = 'translateY(0)';
      });
      parasObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const storyGrid = document.querySelector('.story-grid');
if (storyGrid) parasObserver.observe(storyGrid);

/* ── Step badges stagger reveal ── */
const stepBadges = document.querySelectorAll('.step-badge, .install-subsection-label');
stepBadges.forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'scale(0.8)';
  el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
});

const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'scale(1)';
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

stepBadges.forEach(el => stepObserver.observe(el));

/* ── Page load entrance fade ── */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});