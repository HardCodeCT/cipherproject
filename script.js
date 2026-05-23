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

// ↓ Replace the href="#" on each download link with your real URLs,
//   or update the map below and the function will navigate automatically.
const downloadURLs = {
  windows : '#',   // e.g. 'https://cdn.cipher.app/releases/cipher-setup.exe'
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

  // Navigate after a brief moment so the toast is visible
  if (url && url !== '#') {
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 400);
  }
}

/* ── Scroll-reveal animation ── */
const revealEls = document.querySelectorAll(
  '.feature-card, .platform-card, .ext-card, .story-quote-block, .android-browser-card'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
  revealObserver.observe(el);
});

/* ── Smooth active nav link highlight ── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--cyan)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Hero logo fallback (if image missing) ── */
const heroLogo = document.getElementById('heroLogo');
if (heroLogo) {
  heroLogo.addEventListener('error', () => {
    // Show a styled text placeholder until the image is added
    heroLogo.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 180px; height: 180px;
      border: 2px solid rgba(79,195,247,0.4);
      border-radius: 24px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Orbitron', sans-serif;
      font-size: 1.5rem; font-weight: 900;
      color: #4FC3F7;
      letter-spacing: 0.12em;
      background: rgba(79,195,247,0.05);
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
  heroSub.style.borderRight = '2px solid #4FC3F7';

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
