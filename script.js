/* ============================================
   CiPHER — script.js
   ============================================ */

/* ══════════════════════════════════════════
   PARTICLE CANVAS — floating chess pieces
   ══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PIECES = ['♟','♞','♝','♜','♛','♔'];
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function randomPiece() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      char: PIECES[Math.floor(Math.random() * PIECES.length)],
      size: 14 + Math.random() * 22,
      opacity: 0.04 + Math.random() * 0.08,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.12 - Math.random() * 0.18,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      life: 0,
      maxLife: 280 + Math.random() * 220,
    };
  }

  for (let i = 0; i < 28; i++) {
    const p = randomPiece();
    p.life = Math.floor(Math.random() * p.maxLife); // stagger
    particles.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Fade in / fade out
      const t = p.life / p.maxLife;
      const fade = t < 0.12 ? t / 0.12 : t > 0.85 ? (1 - t) / 0.15 : 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity * fade;
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = '#1a1a1a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.char, 0, 0);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;

      if (p.life >= p.maxLife) {
        particles[i] = randomPiece();
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ══════════════════════════════════════════
   SMOOTH SCROLL — override all anchor links
   ══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ══════════════════════════════════════════
   NAVBAR SCROLL EFFECT
   ══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/* ══════════════════════════════════════════
   SCROLL-TO-TOP BUTTON
   Fades in after scrolling 400px
   ══════════════════════════════════════════ */
const scrollTopBtn = document.getElementById('scrollTopBtn');

function updateScrollTopBtn() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateScrollTopBtn, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ══════════════════════════════════════════
   BOTTOM NAVIGATION
   Fades in after user scrolls past hero
   Active state tracks current section
   ══════════════════════════════════════════ */
const bottomNav     = document.getElementById('bottomNav');
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
const sections      = document.querySelectorAll('section[id], .hero[id]');

// Show bottom nav after hero passes
function updateBottomNav() {
  const heroEl = document.getElementById('hero');
  if (!heroEl) return;
  const heroBottom = heroEl.getBoundingClientRect().bottom;
  if (heroBottom < 0) {
    bottomNav.classList.add('visible');
  } else {
    bottomNav.classList.remove('visible');
  }
}

// Active section highlight
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      bottomNavItems.forEach(item => {
        const isActive = item.getAttribute('data-section') === id;
        item.classList.toggle('active', isActive);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

window.addEventListener('scroll', updateBottomNav, { passive: true });
updateBottomNav(); // run on load


/* ══════════════════════════════════════════
   TOAST NOTIFICATION
   ══════════════════════════════════════════ */
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let   toastTimer;

function showToast(msg, duration = 3000) {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}


/* ══════════════════════════════════════════
   DOWNLOAD HANDLER
   ══════════════════════════════════════════ */
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
    setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 400);
  }
}


/* ══════════════════════════════════════════
   WORD FLOAT ANIMATION
   Wraps each word in section titles and
   animates them in with staggered delays
   ══════════════════════════════════════════ */
function initWordAnimations() {
  const titleEls = document.querySelectorAll('.section-title, .hero-title');

  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.wordsAnimated) return;
      el.dataset.wordsAnimated = '1';

      // Walk text nodes and wrap words, preserve HTML children
      function wrapWordsInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach(w => {
            if (/\S/.test(w)) {
              const span = document.createElement('span');
              span.className = 'word-float';
              span.style.animationDelay = `${wordIndex * 0.08}s`;
              span.style.animationFillMode = 'both';
              span.textContent = w;
              frag.appendChild(span);
              wordIndex++;
            } else {
              frag.appendChild(document.createTextNode(w));
            }
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(wrapWordsInNode);
        }
      }

      let wordIndex = 0;
      Array.from(el.childNodes).forEach(wrapWordsInNode);
      wordObserver.unobserve(el);
    });
  }, { threshold: 0.2 });

  titleEls.forEach(el => wordObserver.observe(el));
}
initWordAnimations();


/* ══════════════════════════════════════════
   SCROLL-REVEAL for cards and elements
   Fade up with staggered delay
   ══════════════════════════════════════════ */
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
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s`;
  revealObserver.observe(el);
});


/* ══════════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT (top navbar)
   ══════════════════════════════════════════ */
const navAnchors = document.querySelectorAll('.nav-links a');

const navSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--cyan)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navSectionObserver.observe(s));


/* ══════════════════════════════════════════
   INSTALLATION GUIDE — tab switching
   ══════════════════════════════════════════ */
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


/* ══════════════════════════════════════════
   INSTALL SCREENSHOT SHIMMER REMOVAL
   ══════════════════════════════════════════ */
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


/* ══════════════════════════════════════════
   HERO LOGO FALLBACK
   ══════════════════════════════════════════ */
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
      font-family: 'Afacad Flux', sans-serif;
      font-size: 1.5rem; font-weight: 900;
      color: #0ea5e9; letter-spacing: 0.12em;
      background: rgba(14,165,233,0.05);
    `;
    placeholder.textContent = 'CiPHER';
    heroLogo.parentNode.insertBefore(placeholder, heroLogo);
  });
}


/* ══════════════════════════════════════════
   TYPING CURSOR EFFECT on hero tagline
   ══════════════════════════════════════════ */
const heroSub = document.getElementById('heroSub');
if (heroSub) {
  const fullText = heroSub.textContent;
  heroSub.textContent = '';
  heroSub.style.borderRight = '2px solid var(--cyan, #0ea5e9)';

  let idx = 0;
  const typeInterval = setInterval(() => {
    heroSub.textContent += fullText[idx];
    idx++;
    if (idx >= fullText.length) {
      clearInterval(typeInterval);
      setTimeout(() => {
        heroSub.style.transition = 'border-color 0.5s';
        heroSub.style.borderColor = 'transparent';
      }, 900);
    }
  }, 42);
}


/* ══════════════════════════════════════════
   HIRE ME BUTTON — ripple click effect
   ══════════════════════════════════════════ */
const hireMeBtn = document.querySelector('.btn-hire-me');
if (hireMeBtn) {
  hireMeBtn.addEventListener('click', function(e) {
    // Ripple
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute;
      width: 6px; height: 6px;
      background: rgba(14,165,233,0.5);
      border-radius: 50%;
      left: ${e.clientX - rect.left - 3}px;
      top: ${e.clientY - rect.top - 3}px;
      transform: scale(0);
      animation: rippleAnim 0.55s ease-out forwards;
      pointer-events: none;
    `;
    // Inject keyframes once
    if (!document.getElementById('rippleStyle')) {
      const style = document.createElement('style');
      style.id = 'rippleStyle';
      style.textContent = `@keyframes rippleAnim { to { transform: scale(20); opacity: 0; } }`;
      document.head.appendChild(style);
    }
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

/* ═══════════════════════════════════════════════════
   LIGHTBOX for Android installation screenshots
   ═══════════════════════════════════════════════════ */

(function initLightbox() {
  // Only target images inside the Android tab
  const androidTab = document.getElementById('tab-android');
  if (!androidTab) return;

  // Build the modal DOM elements
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Enlarged screenshot');

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  const img = document.createElement('img');
  img.alt = 'Enlarged installation screenshot';
  content.appendChild(img);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Close image');
  content.appendChild(closeBtn);

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  let currentImage = null;

  function openLightbox(src) {
    img.src = src;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scroll
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Optionally clear src to free memory
    // img.src = '';
  }

  // Click on any image inside Android tab to open
  const androidImages = androidTab.querySelectorAll('.install-shot-img');
  androidImages.forEach((image) => {
    image.addEventListener('click', function (e) {
      e.stopPropagation();
      const src = this.getAttribute('src');
      if (src) {
        openLightbox(src);
      }
    });
  });

  // Close on backdrop click (click on overlay itself)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Close with close button
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeLightbox();
  });

  // Prevent body scroll when modal is open (handled via overflow:hidden)
  // Also ensure modal closes if the user scrolls? No need.

  // If the modal is open and the window resizes, the image will adapt automatically.
})();
