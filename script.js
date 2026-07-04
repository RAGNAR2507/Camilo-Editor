(() => {
  'use strict';

  /* =========================================================
     CONTENIDO DEL PORTAFOLIO
     Para agregar una nueva categoría, copia un objeto del
     arreglo "categories" y ajústalo. Para agregar un video,
     copia un objeto dentro de "videos".
     - embed: URL de YouTube/Vimeo (déjalo vacío "" si aún no hay video)
     - thumbnail: URL de una imagen de portada (opcional)
     - orientation: "portrait" (Reels/Shorts) o "landscape" (narrativos)
     ========================================================= */
  const categories = [
    {
      id: 'reels',
      title: 'Reels',
      description: 'Videos cortos y dinámicos diseñados para captar la atención en segundos, optimizados para Instagram, TikTok y YouTube Shorts.',
      videos: [
        { title: 'Reel de ejemplo 1', tag: 'Instagram', orientation: 'portrait', embed: '', thumbnail: '' },
        { title: 'Reel de ejemplo 2', tag: 'TikTok', orientation: 'portrait', embed: '', thumbnail: '' },
        { title: 'Reel de ejemplo 3', tag: 'YouTube Shorts', orientation: 'portrait', embed: '', thumbnail: '' }
      ]
    },
    {
      id: 'narrativos',
      title: 'Videos narrativos',
      description: 'Producciones con ritmo narrativo, pensadas para mantener la atención del espectador y transmitir mensajes claros en formatos más largos.',
      videos: [
        { title: 'Proyecto narrativo 1', tag: 'YouTube', orientation: 'landscape', embed: '', thumbnail: '' },
        { title: 'Proyecto narrativo 2', tag: 'Documental', orientation: 'landscape', embed: '', thumbnail: '' }
      ]
    }
    // Agrega aquí nuevas categorías siguiendo el mismo formato.
  ];

  const playIconSVG = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;

  /* ---------- Utilidades ---------- */
  function toEmbedUrl(url) {
    if (!url) return '';
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
    return url;
  }

  /* ---------- Render del portafolio ---------- */
  function renderPortfolio() {
    const filtersEl = document.getElementById('portfolioFilters');
    const categoriesEl = document.getElementById('portfolioCategories');
    if (!filtersEl || !categoriesEl) return;

    const filterButtons = [{ id: 'all', title: 'Todos' }, ...categories.map(c => ({ id: c.id, title: c.title }))];
    filtersEl.innerHTML = filterButtons
      .map((f, i) => `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${f.id}">${f.title}</button>`)
      .join('');

    categoriesEl.innerHTML = categories.map(cat => `
      <div class="portfolio-category" data-category="${cat.id}">
        <div class="category-header">
          <h3>${cat.title}</h3>
          <p>${cat.description}</p>
        </div>
        <div class="portfolio-grid">
          ${cat.videos.map(v => renderVideoCard(v, cat.id)).join('')}
        </div>
      </div>
    `).join('');

    filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });

    categoriesEl.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => onVideoCardClick(card));
    });
  }

  function renderVideoCard(video, categoryId) {
    const thumb = video.thumbnail
      ? `<img src="${video.thumbnail}" alt="${video.title}" loading="lazy">`
      : '';
    return `
      <article class="video-card" data-category="${categoryId}" data-embed="${video.embed || ''}" data-orientation="${video.orientation || 'portrait'}" tabindex="0" role="button" aria-label="Reproducir ${video.title}">
        <div class="video-thumb">
          <span class="video-badge">${video.tag || ''}</span>
          ${thumb}
          <span class="play-icon">${playIconSVG}</span>
        </div>
        <div class="video-info">
          <h4>${video.title}</h4>
          <span>${video.tag || ''}</span>
        </div>
      </article>
    `;
  }

  function applyFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    document.querySelectorAll('.portfolio-category').forEach(block => {
      block.style.display = (filter === 'all' || block.dataset.category === filter) ? '' : 'none';
    });
  }

  /* ---------- Modal de video ---------- */
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');

  function openModal(embedUrl) {
    modalVideo.innerHTML = `<iframe src="${toEmbedUrl(embedUrl)}" title="Reproductor de video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalVideo.innerHTML = '';
    document.body.style.overflow = '';
  }

  function onVideoCardClick(card) {
    const embed = card.dataset.embed;
    if (embed) {
      openModal(embed);
    } else {
      showToast(`"${card.querySelector('h4').textContent}" próximamente 🎬`);
    }
  }

  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------- Navegación móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Header al hacer scroll + link activo ---------- */
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);

    let current = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) current = section.id;
    });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  }
  document.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Año del footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Init ---------- */
  renderPortfolio();
  onScroll();
})();
