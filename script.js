// ===== LOADER =====
const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
  }
};
window.addEventListener('load', () => { setTimeout(hideLoader, 600); });
setTimeout(hideLoader, 2000);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let navScrollTicking = false;
window.addEventListener('scroll', () => {
  if (!navScrollTicking) {
    navScrollTicking = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      navScrollTicking = false;
    });
  }
}, { passive: true });

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinksItems = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinksItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-30% 0px -70% 0px' });
sections.forEach(sec => sectionObserver.observe(sec));

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + '+';
    }, 25);
  });
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('stats-bar')) animateCounters();
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== REVEAL-3D =====
const reveal3dObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      reveal3dObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-3d').forEach(el => reveal3dObserver.observe(el));

// ===== PORTFOLIO TABS =====
const tabButtons = document.querySelectorAll('.tab-btn');
const portfolioGridItems = document.querySelectorAll('#portfolioGrid .portfolio-item');
const allPortfolioItems = document.querySelectorAll('.portfolio-item');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    portfolioGridItems.forEach(item => {
      if (tab === 'all' || item.dataset.category === tab) {
        item.style.display = 'block';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
      } else {
        item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  });
});

// ===== PORTFOLIO CLICK =====
allPortfolioItems.forEach(item => {
  item.addEventListener('click', () => {
    const link = item.dataset.link;
    if (link) { window.open(link, '_blank'); }
    else { const img = item.querySelector('img'); if (img) openImageLightbox(img.src); }
  });
});

// ===== VIDEO DATA =====
const videoData = [
  { id: 'cJewmn7__w4', title: 'Resurgence Ep.1 | The Rise of Genesis Esports at BMSD 2025', channel: 'Genesis Esports' },
  { id: 'Cm1acEsrNkE', title: 'Genesis Presents: Consistency | Episode 1 | BGMS 2025', channel: 'Genesis Esports' },
  { id: 'T5PgtoMZcaA', title: "LET'S BE UNDERDOG AGAIN | Ep.4 ft. Genesis Shadow", channel: 'Genesis Esports' },
  { id: 'nSJmMHkoHgk', title: "LET'S BE UNDERDOG AGAIN | Ep.3 ft. Genesis Sam", channel: 'Genesis Esports' },
  { id: 'CnIy3S2UsOw', title: "LET'S BE UNDERDOG AGAIN | Ep.2 ft. Genesis Apollo", channel: 'Genesis Esports' },
  { id: 'IHRCqNz3yZA', title: "LET'S BE UNDERDOG AGAIN | Ep.1 ft. Genesis Mac", channel: 'Genesis Esports' },
  { id: 'd2JewtMcQhQ', title: 'DYNAMO Reviews OnePlus 15 For Gamers | Honest Review', channel: 'Dynamo Gaming' },
  { id: '3RoOFq0G5RQ', title: 'Deadly Roller Coaster Ride In Singapore | Vlog Ep. 5', channel: 'Dynamo Gaming' },
  { id: 'mm3czPEJk9c', title: 'The Jurassic Park Vlog | Singapore Vlog | Day 3', channel: 'Dynamo Gaming' },
  { id: 'DcSzFUsM3z0', title: 'Turkish Dinner In Singapore w Shreeman & Friends | Day 2', channel: 'Dynamo Gaming' },
  { id: 'yJtxqJWTzSU', title: 'Mumbai ✈️ Singapore 🇸🇬 | Special Event Vlog | Day 1', channel: 'Dynamo Gaming' }
];

const videoGrid = document.getElementById('videoGrid');
videoData.forEach(video => {
  const card = document.createElement('div');
  card.className = 'video-card reveal';
  card.innerHTML = `
    <div class="video-thumb" onclick="openVideoLightbox('${video.id}')">
      <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}" loading="lazy">
      <div class="play-btn"><div class="play-btn-circle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
      </div></div>
    </div>
    <div class="video-info"><h4>${video.title}</h4><p>${video.channel}</p></div>
  `;
  videoGrid.appendChild(card);
  revealObserver.observe(card);
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

function openVideoLightbox(videoId) {
  lightboxContent.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" allowfullscreen allow="autoplay"></iframe>`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function openImageLightbox(src) {
  lightboxContent.innerHTML = `<img src="${src}" style="max-width:100%;max-height:80vh;border-radius:12px;object-fit:contain;">`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxContent.innerHTML = ''; }, 400);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== CURSOR GLOW (desktop only) =====
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,45,85,0.06),transparent 70%);pointer-events:none;z-index:9998;transform:translate(-50%,-50%) translateZ(0);transition:opacity 0.3s;will-change:transform;';
  document.body.appendChild(glow);
  let glowRAF = 0;
  let glowX = 0, glowY = 0;
  document.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
    if (!glowRAF) {
      glowRAF = requestAnimationFrame(() => {
        glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px) translateZ(0)`;
        glowRAF = 0;
      });
    }
  }, { passive: true });
}

// ===== WHATSAPP FORM =====
window.handleSubmit = function(event) {
  event.preventDefault();
  const waName = document.getElementById('waName').value || '';
  const waEmail = document.getElementById('waEmail').value || '';
  const waType = document.getElementById('waType').value || '';
  const waMessage = document.getElementById('waMessage').value || '';
  let text = `Hi Gautam! I want to build something epic.\n\n`;
  text += `*Name:* ${waName}\n*Email:* ${waEmail}\n`;
  if(waType) text += `*Project Type:* ${waType}\n`;
  if(waMessage) text += `*Message:* ${waMessage}\n`;
  window.open(`https://wa.me/918347687963?text=${encodeURIComponent(text)}`, '_blank');
};

// ===== SMART IMAGE LOADING (portfolio section) =====
function setupImageLoading() {
  document.querySelectorAll('.portfolio-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    const markLoaded = () => item.classList.add('img-loaded');
    if (img.complete && img.naturalWidth > 0) markLoaded();
    else { img.addEventListener('load', markLoaded, { once: true }); img.addEventListener('error', markLoaded, { once: true }); }
  });
}

// ===== CLICKS BY ME — JS-driven 4-column grid, 12-per-batch =====
const clicksImages = [
  'assets/CLICKS BY ME/Copy of Copy of DSC09303.JPG',
  'assets/CLICKS BY ME/Copy of DSC09213.JPG',
  'assets/CLICKS BY ME/Copy of DSC09295.JPG',
  'assets/CLICKS BY ME/Copy of DSC09297.JPG',
  'assets/CLICKS BY ME/Copy of DSC09593.JPG',
  'assets/CLICKS BY ME/DSC00007.jpeg',
  'assets/CLICKS BY ME/DSC00474.jpeg',
  'assets/CLICKS BY ME/DSC02090.jpeg',
  'assets/CLICKS BY ME/DSC02125.jpeg',
  'assets/CLICKS BY ME/DSC02137.jpeg',
  'assets/CLICKS BY ME/DSC06193.jpeg',
  'assets/CLICKS BY ME/DSC07718.JPG',
  'assets/CLICKS BY ME/DSC07825.jpeg',
  'assets/CLICKS BY ME/DSC07940.jpeg',
  'assets/CLICKS BY ME/DSC07977.JPG',
  'assets/CLICKS BY ME/DSC07979.JPG',
  'assets/CLICKS BY ME/DSC08021.jpeg',
  'assets/CLICKS BY ME/DSC08070.jpeg',
  'assets/CLICKS BY ME/DSC08078.JPG',
  'assets/CLICKS BY ME/DSC08085.JPG',
  'assets/CLICKS BY ME/DSC08125.JPG',
  'assets/CLICKS BY ME/DSC08126.JPG',
  'assets/CLICKS BY ME/DSC08147.JPG',
  'assets/CLICKS BY ME/DSC08957.JPG',
  'assets/CLICKS BY ME/DSC09047.JPG',
  'assets/CLICKS BY ME/DSC09049.JPG',
  'assets/CLICKS BY ME/DSC09778.JPG',
  'assets/CLICKS BY ME/DSC09794.JPG',
  'assets/CLICKS BY ME/DSC09800.JPG',
  'assets/CLICKS BY ME/DSC09810.jpeg',
  'assets/CLICKS BY ME/DSC09826.jpeg',
  'assets/CLICKS BY ME/DSC09904.JPG',
  'assets/CLICKS BY ME/DSC09905.JPG',
  'assets/CLICKS BY ME/DSC09906.JPG',
  'assets/CLICKS BY ME/DSC09908.JPG',
  'assets/CLICKS BY ME/DSC09909.JPG',
  'assets/CLICKS BY ME/DSC09910.JPG',
  'assets/CLICKS BY ME/DSC09911.JPG',
  'assets/CLICKS BY ME/DSC09912.JPG',
  'assets/CLICKS BY ME/DSC09913.JPG',
  'assets/CLICKS BY ME/DSC09916.JPG',
  'assets/CLICKS BY ME/DSC09947.jpeg',
  'assets/CLICKS BY ME/IMG_6905.PNG',
  'assets/CLICKS BY ME/IMG_6906.PNG',
  'assets/CLICKS BY ME/IMG_6907.PNG',
  'assets/CLICKS BY ME/IMG_6908.PNG',
  'assets/CLICKS BY ME/IMG_6909.PNG',
  'assets/CLICKS BY ME/IMG_6910.PNG',
  'assets/CLICKS BY ME/imgi_27_581979214_18546304705047117_4490427180105577570_n.jpg',
  'assets/CLICKS BY ME/imgi_28_580687409_18545516347047117_6548205899302213467_n.jpg',
  'assets/CLICKS BY ME/imgi_29_574255611_18508142341068492_4051568763756614886_n.jpg',
  'assets/CLICKS BY ME/imgi_58_576396838_18545516359047117_5772894425543646372_n.jpg',
  'assets/CLICKS BY ME/imgi_59_579689319_18545516368047117_2243834755550060473_n.jpg',
  'assets/CLICKS BY ME/imgi_60_579982780_18545516377047117_2608074690610399893_n.jpg',
  'assets/CLICKS BY ME/imgi_66_571869595_18543925450047117_5842862858081014950_n.jpg',
  'assets/CLICKS BY ME/imgi_67_574418183_18543925459047117_5877918694169058135_n.jpg',
  'assets/CLICKS BY ME/Screenshot 2026-03-18 031956.png',
  'assets/CLICKS BY ME/Screenshot 2026-03-18 032104.png',
  'assets/CLICKS BY ME/Screenshot 2026-03-18 032157.png',
  'assets/CLICKS BY ME/Screenshot 2026-03-18 032211.png',
  'assets/CLICKS BY ME/Screenshot 2026-03-18 032503.png',
  'assets/CLICKS BY ME/Screenshot 2026-03-18 032518.png',
  'assets/CLICKS BY ME/WINNER.jpg'
];

const BATCH_SIZE = 12;
let clicksLoaded = 0;

// Helper: convert original path to WebP thumbnail/lightbox path
function clicksThumbPath(src) {
  const dir = src.substring(0, src.lastIndexOf('/') + 1);
  const file = src.substring(src.lastIndexOf('/') + 1);
  const webpFile = file.replace(/\.(jpg|jpeg|png|bmp|tiff)$/i, '.webp');
  return dir + 'thumbs/' + webpFile;
}
function clicksLightboxPath(src) {
  const dir = src.substring(0, src.lastIndexOf('/') + 1);
  const file = src.substring(src.lastIndexOf('/') + 1);
  const webpFile = file.replace(/\.(jpg|jpeg|png|bmp|tiff)$/i, '.webp');
  return dir + 'lightbox/' + webpFile;
}

function renderClicksBatch() {
  const grid = document.getElementById('clicksGrid');
  const loadMoreWrap = document.getElementById('clicksLoadMoreWrap');
  const remaining = document.getElementById('clicksRemaining');
  if (!grid) return;

  const batch = clicksImages.slice(clicksLoaded, clicksLoaded + BATCH_SIZE);

  batch.forEach((src, i) => {
    const card = document.createElement('div');
    card.className = 'click-card';

    const img = document.createElement('img');
    img.src = clicksThumbPath(src);       // Load small WebP thumbnail
    img.alt = 'Personal Click';
    img.loading = 'lazy';
    img.decoding = 'async';

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = '<span>Personal Click 📸</span>';

    card.appendChild(img);
    card.appendChild(overlay);
    grid.appendChild(card);

    // Open LIGHTBOX version (higher quality) on click
    card.addEventListener('click', () => openImageLightbox(clicksLightboxPath(src)));

    // Staggered smooth fade-in
    setTimeout(() => card.classList.add('visible'), i * 50);
  });

  clicksLoaded += batch.length;

  const left = clicksImages.length - clicksLoaded;
  if (left > 0) {
    loadMoreWrap.style.display = 'block';
    if (remaining) remaining.textContent = `+${left} more`;
  } else {
    loadMoreWrap.style.display = 'none';
  }
}

function initClicksGallery() {
  const btn = document.getElementById('clicksLoadMoreBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      renderClicksBatch();
      setTimeout(() => {
        const grid = document.getElementById('clicksGrid');
        if (grid && grid.lastElementChild) {
          grid.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    });
  }
  renderClicksBatch();
}

// ===== INIT =====
setupImageLoading();
initClicksGallery();
