(() => {
  const btn = document.querySelector('[data-back-to-top]');
  if (!btn) return;

  const raw = btn.getAttribute('data-threshold');
  const parsed = raw != null ? parseInt(raw, 10) : NaN;
  const SCROLL_THRESHOLD = !isNaN(parsed) && parsed > 0 ? parsed : 400;

  btn.removeAttribute('hidden');

  const toggle = () => {
    const past = window.scrollY > SCROLL_THRESHOLD;
    btn.classList.toggle('is-visible', past);
    btn.setAttribute('aria-hidden', String(!past));
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('#main-content')?.focus({ preventScroll: true });
  });
})();
