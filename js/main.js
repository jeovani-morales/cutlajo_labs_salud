/**
 * MAIN.JS - Lógica para Micrositios CUTLAJO / UdeG
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDropdownMenu();
  initHeroSlideshow();
  initLabHeroSlideshow();
  initGallerySlideshows();
  initTabs();
  initVirtualTours();
});

/** Menú Responsivo Móvil */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    // Alternar apertura/cierre del menú móvil al presionar el botón hamburguesa
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('is-active');
      const isExpanded = mainNav.classList.contains('is-active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Cierre automático al hacer clic en enlaces sencillos (excluye toggles de dropdown)
    const navLinks = mainNav.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Cierre automático al hacer clic fuera del menú o del botón hamburguesa
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-active')) {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
          mainNav.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
}

/** Dropdown Menú (Desplegables en Desktop y Móvil) */
function initDropdownMenu() {
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  dropdownItems.forEach((dropdown) => {
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Cerrar otros dropdowns abiertos
        dropdownItems.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('show');
            const otherBtn = otherDropdown.querySelector('.dropdown-toggle');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Alternar el dropdown actual
        const isShowing = dropdown.classList.contains('show');
        dropdown.classList.toggle('show');
        toggleBtn.setAttribute('aria-expanded', !isShowing);
      });
    }
  });

  // Cerrar cualquier dropdown abierto al hacer clic fuera
  document.addEventListener('click', (e) => {
    dropdownItems.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
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
    labHero.style.backgroundImage = `url('${imagesArray[0]}')`;

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

/** Sistema de Filtrado para Recorridos Virtuales 360° */
function initVirtualTours() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const tourCards = document.querySelectorAll('.tour-card-item');

  if (filterButtons.length > 0 && tourCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', function() {
        const filterValue = this.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        tourCards.forEach((card) => {
          if (filterValue === 'all' || card.dataset.category === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}