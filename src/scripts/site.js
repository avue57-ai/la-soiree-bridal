// La Soirée — site behaviour. ~4 KB. No dependencies.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const px = reduce || !matchMedia('(min-width: 900px)').matches ? [] : [...document.querySelectorAll('[data-parallax]')];

/* ---------- header: transparent → solid, hide on scroll down ---------- */
const header = document.querySelector('[data-header]');
const transparentMode = header?.dataset.mode === 'transparent';
let lastY = scrollY;
let ticking = false;
function onScroll() {
  const y = scrollY;
  if (header) {
    const solid = !transparentMode || y > 40;
    header.classList.toggle('is-solid', solid);
    header.classList.toggle('is-transparent', !solid);
    const hide = y > 700 && y > lastY + 4 && !root.classList.contains('menu-open');
    const show = y < lastY - 4 || y < 700;
    if (hide) header.classList.add('is-hidden');
    else if (show) header.classList.remove('is-hidden');
  }
  lastY = y;
  parallax();
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- full-screen menu ---------- */
const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
function setMenu(open) {
  root.classList.toggle('menu-open', open);
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  if (menu) menu.inert = !open;
  // keep header + menu interactive, everything else inert while open
  document.querySelectorAll('main, footer, [data-book-bar]').forEach((el) => (el.inert = open));
  if (open) menu?.querySelector('a')?.focus();
}
toggle?.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); toggle?.focus(); }
});
menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

/* ---------- reveal on view ---------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
document.querySelectorAll('[data-reveal], .split-line').forEach((el) => io.observe(el));

/* ---------- gentle parallax (desktop, motion allowed) ---------- */
function parallax() {
  const vh = innerHeight;
  for (const el of px) {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) continue;
    const k = parseFloat(el.dataset.parallax) || 0.12;
    const offset = (r.top + r.height / 2 - vh / 2) * -k;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.08)`;
  }
}

/* ---------- mobile booking bar ---------- */
const bar = document.querySelector('[data-book-bar]');
if (bar) {
  const hiders = new Set();
  const hideIo = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? hiders.add(e.target) : hiders.delete(e.target);
    update();
  });
  document.querySelectorAll('[data-hide-bookbar]').forEach((el) => hideIo.observe(el));
  const update = () => bar.classList.toggle('is-visible', scrollY > innerHeight * 0.6 && hiders.size === 0);
  addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- desktop cursor label over imagery ---------- */
const cursor = document.querySelector('.cursor');
if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
  const label = cursor.querySelector('span');
  addEventListener('pointermove', (e) => {
    cursor.style.setProperty('--x', e.clientX + 'px');
    cursor.style.setProperty('--y', e.clientY + 'px');
    const t = e.target.closest?.('[data-cursor]');
    if (t) { label.textContent = t.dataset.cursor; cursor.classList.add('on'); } else cursor.classList.remove('on');
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
}

/* ---------- analytics events ---------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-track]');
  if (!a || typeof window.gtag !== 'function') return;
  window.gtag('event', a.dataset.track, { link_label: a.dataset.trackLabel || a.textContent.trim().slice(0, 60), link_url: a.href || '' });
});
