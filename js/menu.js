const menuToggle = document.querySelector('.menu-toggle');
const sideMenu = document.querySelector('.side-menu');
const menuBackdrop = document.querySelector('.menu-backdrop');
const topbar = document.querySelector('.topbar');

document.querySelectorAll('.brand-mark .fa-shield-halved, .site-footer .fa-shield-halved').forEach((icon) => {
  icon.classList.replace('fa-shield-halved', 'fa-compass');
});

document.querySelectorAll('.page-importantes .page-heading .fa-shield-halved').forEach((icon) => {
  icon.classList.replace('fa-shield-halved', 'fa-list-check');
});

const pageLinks = document.querySelector('.menu-links');
const isInsidePages = window.location.pathname.includes('/pages/');
const pagePrefix = isInsidePages ? '' : 'pages/';

[
  ['Mapa de clanes', 'mapa.html', 'fa-map-location-dot'],
  ['Publicaciones destacadas', 'publicaciones.html', 'fa-star'],
  ['AnonBot', 'anonbot.html', 'fa-user-secret'],
].forEach(([label, file, icon]) => {
  const link = document.createElement('a');
  link.className = 'menu-link';
  link.href = `${pagePrefix}${file}`;
  link.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${label}</span>`;
  pageLinks?.append(link);
});

const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.type = 'button';
themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
themeToggle.setAttribute('title', 'Cambiar a modo claro');
themeToggle.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
topbar?.insertBefore(themeToggle, topbar.querySelector('.topbar-action'));

let themeTransitionTimeout;

function applyTheme(theme, animate = false) {
  if (animate) {
    document.documentElement.classList.add('theme-transitioning');
    window.clearTimeout(themeTransitionTimeout);
    themeTransitionTimeout = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 380);
  }
  const isLight = theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  themeToggle.innerHTML = `<i class="fa-solid ${isLight ? 'fa-moon' : 'fa-sun'}" aria-hidden="true"></i>`;
  themeToggle.setAttribute('aria-label', `Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`);
  themeToggle.setAttribute('title', `Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#eef3e9' : '#101813');
}

let savedTheme = 'dark';
try {
  savedTheme = localStorage.getItem('office-safe-theme') || 'dark';
} catch {}
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme, true);
  try {
    localStorage.setItem('office-safe-theme', nextTheme);
  } catch {}
});

function setMenuOpen(isOpen) {
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  menuToggle?.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  sideMenu?.setAttribute('aria-hidden', String(!isOpen));
  if (sideMenu) sideMenu.inert = !isOpen;
  if (isOpen) sideMenu?.querySelector('a')?.focus();
  else menuToggle?.focus();
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menuBackdrop?.addEventListener('click', () => setMenuOpen(false));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    setMenuOpen(false);
  }
});

const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.menu-link').forEach((link) => {
  const href = link.getAttribute('href');
  const destination = href?.split('/').pop();
  const isHome = currentPage === 'index.html' && destination === 'index.html';
  if (destination === currentPage || isHome) {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  } else {
    link.classList.remove('is-active');
    link.removeAttribute('aria-current');
  }
});
