// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

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
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 200;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = target >= 100 ? '+' : '+';
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 25);
  });
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('stats-bar')) {
        animateCounters();
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== REVEAL-3D (3D Entrance) =====
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
const portfolioItems = document.querySelectorAll('.portfolio-item');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    portfolioItems.forEach(item => {
      if (tab === 'all' || item.dataset.category === tab) {
        item.style.display = 'block';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  });
});

// ===== PORTFOLIO CLICK -> INSTAGRAM =====
portfolioItems.forEach(item => {
  item.addEventListener('click', () => {
    const link = item.dataset.link;
    if (link) window.open(link, '_blank');
  });
});

// ===== VIDEO DATA =====
const videoData = [
  {
    id: 'cJewmn7__w4',
    title: 'Resurgence Ep.1 | The Rise of Genesis Esports at BMSD 2025',
    channel: 'Genesis Esports'
  },
  {
    id: 'Cm1acEsrNkE',
    title: 'Genesis Presents: Consistency | Episode 1 | BGMS 2025',
    channel: 'Genesis Esports'
  },
  {
    id: 'T5PgtoMZcaA',
    title: "LET'S BE UNDERDOG AGAIN | Ep.4 ft. Genesis Shadow",
    channel: 'Genesis Esports'
  },
  {
    id: 'nSJmMHkoHgk',
    title: "LET'S BE UNDERDOG AGAIN | Ep.3 ft. Genesis Sam",
    channel: 'Genesis Esports'
  },
  {
    id: 'CnIy3S2UsOw',
    title: "LET'S BE UNDERDOG AGAIN | Ep.2 ft. Genesis Apollo",
    channel: 'Genesis Esports'
  },
  {
    id: 'IHRCqNz3yZA',
    title: "LET'S BE UNDERDOG AGAIN | Ep.1 ft. Genesis Mac",
    channel: 'Genesis Esports'
  },
  {
    id: 'd2JewtMcQhQ',
    title: 'DYNAMO Reviews OnePlus 15 For Gamers | Honest Review',
    channel: 'Dynamo Gaming'
  },
  {
    id: '3RoOFq0G5RQ',
    title: 'Deadly Roller Coaster Ride In Singapore | Vlog Ep. 5',
    channel: 'Dynamo Gaming'
  },
  {
    id: 'mm3czPEJk9c',
    title: 'The Jurassic Park Vlog | Singapore Vlog | Day 3',
    channel: 'Dynamo Gaming'
  },
  {
    id: 'DcSzFUsM3z0',
    title: 'Turkish Dinner In Singapore w Shreeman & Friends | Day 2',
    channel: 'Dynamo Gaming'
  },
  {
    id: 'yJtxqJWTzSU',
    title: 'Mumbai ✈️ Singapore 🇸🇬 | Special Event Vlog | Day 1',
    channel: 'Dynamo Gaming'
  }
];

// ===== RENDER VIDEOS =====
const videoGrid = document.getElementById('videoGrid');
videoData.forEach(video => {
  const card = document.createElement('div');
  card.className = 'video-card reveal';
  card.innerHTML = `
    <div class="video-thumb" onclick="openVideoLightbox('${video.id}')">
      <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}" loading="lazy">
      <div class="play-btn">
        <div class="play-btn-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
    </div>
    <div class="video-info">
      <h4>${video.title}</h4>
      <p>${video.channel}</p>
    </div>
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

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxContent.innerHTML = ''; }, 400);
}

// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #00d4ff, #8b5cf6)';
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CURSOR GLOW EFFECT (desktop only) =====
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,45,85,0.06),transparent 70%);pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:opacity 0.3s;';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ===== WHATSAPP FORM REDIRECT =====
window.handleSubmit = function(event) {
  event.preventDefault();
  
  const waName = document.getElementById('waName').value || '';
  const waEmail = document.getElementById('waEmail').value || '';
  const waType = document.getElementById('waType').value || '';
  const waMessage = document.getElementById('waMessage').value || '';
  
  let text = `Hi Gautam! I want to build something epic.\n\n`;
  text += `*Name:* ${waName}\n`;
  text += `*Email:* ${waEmail}\n`;
  if(waType) text += `*Project Type:* ${waType}\n`;
  if(waMessage) text += `*Message:* ${waMessage}\n`;
  
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://wa.me/918347687963?text=${encodedText}`;
  
  window.open(waUrl, '_blank');
};
