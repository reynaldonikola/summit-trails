// Summit Trails: theme toggle with memory, sticky header, mobile nav, scroll reveal, active nav link.

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme: stored choice wins, otherwise follow the system.
const stored = (() => {
  try { return localStorage.getItem('summit-theme'); } catch { return null; }
})();
if (stored === 'dark' || stored === 'light') root.dataset.theme = stored;

const themeButton = document.getElementById('theme-toggle');
themeButton.addEventListener('click', () => {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.dataset.theme || (systemDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('summit-theme', next); } catch { /* private mode */ }
});

// Header border on scroll.
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('stuck', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav.
const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  mobileNav.classList.toggle('open', !open);
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
}));

// Reveal on scroll.
const revealables = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealables.forEach(el => el.classList.add('in'));
} else {
  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px' });
  revealables.forEach(el => revealer.observe(el));
}

// Nav link follows the section on screen.
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { threshold: 0.4 });
  sections.forEach(s => spy.observe(s));
}
