/**
 * MAIN.JS - Lógica para Micrositios CUTLAJO / UdeG
 */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveLink();
  initMobileMenu();
  initDropdownMenu();
  initHeroSlideshow();
  initLabHeroSlideshow();
  initGallerySlideshows();
  initTabs();
  initVirtualTours();
});

/** Destaca el enlace activo según la página actual */
function highlightActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-navigation .nav-link, .main-navigation .dropdown-item');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      const parentLi = link.closest('.nav-item');
      if (parentLi) parentLi.classList.add('active');
      
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) parentDropdown.classList.add('active');
    }
  });
}

/** Menú Responsivo Móvil */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = mainNav.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isActive);
      menuToggle.classList.toggle('open', isActive);
    });

    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('is-active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
      }
    });
  }
}

/** Dropdown Menú */
function initDropdownMenu() {
  const dropdowns = document.querySelectorAll('.nav-item.dropdown');

  dropdowns.forEach((dropdown) => {
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const parent = toggleBtn.closest('.dropdown');
        const isShowing = parent.classList.contains('show');

        dropdowns.forEach((item) => {
          if (item !== parent) {
            item.classList.remove('show');
            const btn = item.querySelector('.dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        });

        parent.classList.toggle('show', !isShowing);
        toggleBtn.setAttribute('aria-expanded', !isShowing);
      });
    }
  });
}

/** Slideshow Hero Principal */
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

/** Hero Banner Secundarios */
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

/** Galerías Internas */
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

/** Sistema de Pestañas (Tabs) con soporte para Hash directo (#tab-nombre) */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length === 0) return;

  function activateTab(targetId, container) {
    if (!container) return;
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    const activeBtn = container.querySelector(`.tab-btn[data-tab="${targetId}"]`);
    const activePane = container.querySelector(`#${targetId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePane) activePane.classList.add('active');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      const container = btn.closest('.tabs-container');
      activateTab(targetId, container);
    });
  });

  // Activar pestaña si la URL contiene un hash (ejemplo: reglamento.html#tab-microscopia)
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash) {
    const targetPane = document.getElementById(currentHash);
    if (targetPane && targetPane.classList.contains('tab-pane')) {
      const container = targetPane.closest('.tabs-container');
      activateTab(currentHash, container);
    }
  }
}

/** Recorridos Virtuales 360° */
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