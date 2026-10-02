/**
 * MAIN.JS - Lógica para Micrositios CUTLAJO
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDropdownMenu();
  initHeroSlideshow();
  initLabHeroSlideshow();
  initGallerySlideshows();
  initTabs();
});

/** Menú Responsivo Móvil */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('is-active');
      const isExpanded = mainNav.classList.contains('is-active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }
}

/** Dropdown Menú Laboratorios */
function initDropdownMenu() {
  const labsDropdown = document.getElementById('labsDropdown');
  if (!labsDropdown) return;

  const toggleBtn = labsDropdown.querySelector('.dropdown-toggle');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = labsDropdown.classList.contains('show');
      labsDropdown.classList.toggle('show');
      toggleBtn.setAttribute('aria-expanded', !isShowing);
    });
  }

  document.addEventListener('click', (e) => {
    if (!labsDropdown.contains(e.target)) {
      labsDropdown.classList.remove('show');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/** Slideshow Hero Principal (index.html) */
function initHeroSlideshow() {
  const heroBanner = document.querySelector('.hero-banner:not(.lab-hero)');
  if (!heroBanner) return;

  const images = [
    'img/slideshow_principal/fondo01.JPG',
    'img/slideshow_principal/fondo02.JPG',
    'img/slideshow_principal/fondo03.JPG',
    'img/slideshow_principal/fondo04.JPG'
  ];

  let currentIndex = 0;
  heroBanner.style.backgroundImage = `url('${images[0]}')`;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    heroBanner.style.backgroundImage = `url('${images[currentIndex]}')`;
  }, 10000);
}

/** Hero Banner en Páginas de Laboratorios (Secundarias) */
function initLabHeroSlideshow() {
  const labHeroes = document.querySelectorAll('.lab-hero');
  
  labHeroes.forEach((labHero) => {
    const rawImages = labHero.getAttribute('data-bg-images');
    if (!rawImages) return;

    const imagesArray = rawImages.split(',').map(img => img.trim()).filter(img => img.length > 0);
    if (imagesArray.length === 0) return;

    let currentIndex = 0;
    
    // Carga inicial directa de la primera imagen
    labHero.style.backgroundImage = `url('${imagesArray[0]}')`;

    // Rotación cada 8 segundos
    if (imagesArray.length > 1) {
      setInterval(() => {
        currentIndex = (currentIndex + 1) % imagesArray.length;
        labHero.style.backgroundImage = `url('${imagesArray[currentIndex]}')`;
      }, 8000);
    }
  });
}

/** Galerías Internas con Flechas e Indicadores */
function initGallerySlideshows() {
  const slideshows = document.querySelectorAll('.gallery-slideshow');

  slideshows.forEach((slideshow) => {
    const slides = slideshow.querySelectorAll('.gallery-img');
    const btnPrev = slideshow.querySelector('.slide-prev');
    const btnNext = slideshow.querySelector('.slide-next');
    const dotsContainer = slideshow.querySelector('.slide-dots');
    const intervalTime = parseInt(slideshow.getAttribute('data-interval')) || 6000;

    if (slides.length === 0) return;

    let currentIndex = 0;
    let timer = null;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { showSlide(i); startTimer(); });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      currentIndex = index;
    }

    function nextSlide() { showSlide((currentIndex + 1) % slides.length); }
    function prevSlide() { showSlide((currentIndex - 1 + slides.length) % slides.length); }

    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, intervalTime);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
    }

    if (btnNext) btnNext.addEventListener('click', () => { nextSlide(); startTimer(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { prevSlide(); startTimer(); });

    slideshow.addEventListener('mouseenter', stopTimer);
    slideshow.addEventListener('mouseleave', startTimer);

    startTimer();
  });
}

/** Sistema de Pestañas (Tabs) */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      const container = btn.closest('.tabs-container');

      if (!container) return;

      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = container.querySelector(`#${targetId}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* ==========================================================================
       6. SISTEMA DE FILTRADO PARA RECORRIDOS VIRTUALES 360°
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tourCards = document.querySelectorAll('.tour-card-item');

    if (filterButtons.length > 0 && tourCards.length > 0) {
        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const filterValue = this.dataset.filter;

                // Cambia el estado activo del botón
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filtra los recorridos 360
                tourCards.forEach(function(card) {
                    if (filterValue === 'all' || card.dataset.category === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }