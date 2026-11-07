const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

/* Full-width Premium Projects image carousel */
(() => {
  const track = document.getElementById('project-grid');
  const previous = document.getElementById('projects-prev');
  const next = document.getElementById('projects-next');
  const dotsHost = document.getElementById('project-dots');
  const count = document.getElementById('project-count');
  if (!track || !previous || !next) return;

  const getVisibleSlides = () =>
    Array.from(track.querySelectorAll('.project-card:not(.hidden)'));

  const getActiveIndex = () => {
    const slides = getVisibleSlides();
    if (!slides.length) return 0;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  };

  const goToSlide = (index) => {
    const slides = getVisibleSlides();
    if (!slides.length) return;
    const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
    track.scrollTo({ left: slides[safeIndex].offsetLeft, behavior: 'smooth' });
  };

  const renderDots = () => {
    if (!dotsHost) return;
    const slides = getVisibleSlides();
    dotsHost.innerHTML = '';
    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'project-dot';
      dot.setAttribute('aria-label', `Show project ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsHost.appendChild(dot);
    });
    updateControls();
  };

  const updateControls = () => {
    const slides = getVisibleSlides();
    const index = getActiveIndex();
    previous.disabled = slides.length < 2 || index === 0;
    next.disabled = slides.length < 2 || index >= slides.length - 1;

    if (count) {
      count.textContent = slides.length
        ? `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`
        : '00 / 00';
    }
    if (dotsHost) {
      Array.from(dotsHost.children).forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
        dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
      });
    }
  };

  previous.addEventListener('click', () => goToSlide(getActiveIndex() - 1));
  next.addEventListener('click', () => goToSlide(getActiveIndex() + 1));
  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  renderDots();

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToSlide(getActiveIndex() - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToSlide(getActiveIndex() + 1);
    }
  });

  // Expose a small refresh hook for the property filter below.
  window.refreshProjectCarousel = () => {
    track.scrollTo({ left: 0, behavior: 'auto' });
    renderDots();
  };
})();

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.textContent = '☰';
    }
  });
});

let intent = 'Buy';
document.querySelectorAll('.search-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    intent = tab.dataset.intent || 'Buy';
    document.querySelectorAll('.search-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    const message = document.getElementById('search-message');
    if (message) {
      message.textContent = intent === 'Rent'
        ? 'Rental listings can be added by the site administrator.'
        : '';
    }
  });
});

const form = document.getElementById('search-form');
const cards = Array.from(document.querySelectorAll('.project-card'));

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const type = document.getElementById('property-type')?.value || 'all';
  const location = document.getElementById('property-location')?.value || 'all';
  const budget = document.getElementById('property-budget')?.value || 'all';
  const status = document.getElementById('property-status')?.value || 'all';
  let matchedCount = 0;

  cards.forEach((card) => {
    const visible = (type === 'all' || card.dataset.type === type)
      && (location === 'all' || card.dataset.location === location)
      && (budget === 'all' || card.dataset.budget === budget)
      && (status === 'all' || card.dataset.status === status);

    card.classList.toggle('hidden', !visible);
    if (visible) matchedCount += 1;
  });

  const result = document.getElementById('results-message');
  if (result) {
    result.textContent = matchedCount
      ? `${matchedCount} sample project${matchedCount === 1 ? '' : 's'} match your filters${intent === 'Rent' ? ' for rent' : ''}.`
      : 'No sample projects match those filters. Try changing your selection.';
  }

  window.refreshProjectCarousel?.();
  document.getElementById('projects')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});

document.querySelectorAll('.category-card').forEach((category) => {
  category.addEventListener('click', () => {
    const typeSelect = document.getElementById('property-type');
    if (typeSelect) typeSelect.value = category.dataset.category || 'all';
  });
});

document.querySelectorAll('.map-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    document.querySelectorAll('.map-toggle').forEach((item) => {
      item.classList.toggle('active', item === toggle);
    });
    document.getElementById('map-canvas')
      ?.classList.toggle('list-mode', toggle.dataset.view === 'list');
  });
});

const projectNames = [
  'Sree Vista Heights',
  'Green Valley Villas',
  'Royal Enclave',
  'Kurnool Meadows'
];

document.querySelectorAll('.map-pin').forEach((pin) => {
  pin.addEventListener('click', () => {
    const popup = document.getElementById('map-popup');
    const strong = popup?.querySelector('strong');
    if (strong) strong.textContent = pin.dataset.project || projectNames[0];
    if (popup) popup.style.display = 'flex';
  });
});

/* Builder logo controls only. Project arrows are handled by the carousel above. */
document.querySelectorAll('.builder-prev, .builder-next').forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('.builder-row');
    if (!row) return;
    const logos = Array.from(row.querySelectorAll('.builder-logo'));
    if (logos.length < 2) return;

    if (button.classList.contains('builder-next')) {
      row.insertBefore(logos[0], button);
    } else {
      row.insertBefore(logos[logos.length - 1], logos[0]);
    }
  });
});

document.querySelectorAll('.map-zoom button').forEach((button) => {
  button.addEventListener('click', () => {
    const canvas = document.getElementById('map-canvas');
    if (!canvas) return;
    const current = Number(canvas.dataset.zoom || 1);
    const zoom = button.textContent.trim() === '+'
      ? Math.min(current + 0.1, 1.4)
      : Math.max(current - 0.1, 0.8);
    canvas.dataset.zoom = String(zoom);
    canvas.style.backgroundSize = `${100 * zoom}% ${100 * zoom}%`;
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();


document.querySelectorAll(".map-project-item").forEach((item) => {
  item.addEventListener("click", function () {

    const name = this.dataset.name;
    const location = this.dataset.location;

    const searchQuery = `${name}, ${location}`;

    const encodedLocation = encodeURIComponent(searchQuery);

    // Update embedded Google Map
    document.getElementById("project-google-map").src =
      `https://maps.google.com/maps?q=${encodedLocation}&z=16&output=embed`;

    // Update project information
    document.getElementById("selected-project-name").textContent = name;
    document.getElementById("selected-project-location").textContent = location;

    // Update external Google Maps links
    document.getElementById("google-map-link").href =
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

    document.getElementById("directions-link").href =
      `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;

    // Active selection
    document.querySelectorAll(".map-project-item").forEach((button) => {
      button.classList.remove("active");
    });

    this.classList.add("active");
  });
});
