const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

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
    if (message) message.textContent = intent === 'Rent'
      ? 'Rental listings can be added by the site administrator.'
      : '';
  });
});

const form = document.getElementById('search-form');
const cards = Array.from(document.querySelectorAll('.project-card'));
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const type = document.getElementById('property-type').value;
  const location = document.getElementById('property-location').value;
  const budget = document.getElementById('property-budget').value;
  const status = document.getElementById('property-status').value;
  let count = 0;
  cards.forEach((card) => {
    const visible = (type === 'all' || card.dataset.type === type)
      && (location === 'all' || card.dataset.location === location)
      && (budget === 'all' || card.dataset.budget === budget)
      && (status === 'all' || card.dataset.status === status);
    card.classList.toggle('hidden', !visible);
    if (visible) count++;
  });
  const result = document.getElementById('results-message');
  if (result) result.textContent = count
    ? `${count} sample project${count === 1 ? '' : 's'} match your filters${intent === 'Rent' ? ' for rent' : ''}.`
    : 'No sample projects match those filters. Try changing your selection.';
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.category-card').forEach((category) => {
  category.addEventListener('click', () => {
    const typeSelect = document.getElementById('property-type');
    if (typeSelect) typeSelect.value = category.dataset.category || 'all';
  });
});

document.querySelectorAll('.map-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    document.querySelectorAll('.map-toggle').forEach((item) => item.classList.toggle('active', item === toggle));
    document.getElementById('map-canvas')?.classList.toggle('list-mode', toggle.dataset.view === 'list');
  });
});

const projectNames = ['Sree Vista Heights', 'Green Valley Villas', 'Royal Enclave', 'Kurnool Meadows'];
document.querySelectorAll('.map-pin').forEach((pin) => {
  pin.addEventListener('click', () => {
    const popup = document.getElementById('map-popup');
    const strong = popup?.querySelector('strong');
    if (strong) strong.textContent = pin.dataset.project || projectNames[0];
    if (popup) popup.style.display = 'flex';
  });
});

document.querySelectorAll('#projects-next, #projects-prev, .builder-prev, .builder-next').forEach((button) => {
  button.addEventListener('click', () => {
    const isNext = button.id === 'projects-next' || button.classList.contains('builder-next');
    if (button.closest('.builder-row')) {
      const row = button.closest('.builder-row');
      const logos = Array.from(row.querySelectorAll('.builder-logo'));
      if (logos.length > 1) {
        if (isNext) row.insertBefore(logos[0], button);
        else row.insertBefore(logos[logos.length - 1], logos[0]);
      }
      return;
    }
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    const visibleCards = Array.from(grid.querySelectorAll('.project-card:not(.hidden)'));
    if (visibleCards.length > 1) {
      if (isNext) grid.appendChild(visibleCards[0]);
      else grid.insertBefore(visibleCards[visibleCards.length - 1], grid.firstChild);
    }
  });
});

document.querySelectorAll('.map-zoom button').forEach((button) => {
  button.addEventListener('click', () => {
    const canvas = document.getElementById('map-canvas');
    if (!canvas) return;
    const current = Number(canvas.dataset.zoom || 1);
    const next = button.textContent.trim() === '+' ? Math.min(current + 0.1, 1.4) : Math.max(current - 0.1, 0.8);
    canvas.dataset.zoom = String(next);
    canvas.style.backgroundSize = `${100 * next}% ${100 * next}%`;
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
