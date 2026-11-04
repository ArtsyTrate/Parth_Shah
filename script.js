const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
if (reducedMotion) {
  document.querySelectorAll('model-viewer[auto-rotate]').forEach(model => model.removeAttribute('auto-rotate'));
}

const menu = document.querySelector('.menu-panel');
if (menu) {
  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => { menu.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
}

const reveals = document.querySelectorAll('[data-reveal]');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  reveals.forEach(element => revealObserver.observe(element));
} else {
  reveals.forEach(element => element.classList.add('is-in'));
}

document.querySelectorAll('img[data-b64-src]').forEach(image => {
  fetch(image.dataset.b64Src)
    .then(response => {
      if (!response.ok) throw new Error('Preview could not be loaded');
      return response.text();
    })
    .then(base64 => { image.src = 'data:image/webp;base64,' + base64.replace(/\s/g, ''); })
    .catch(() => { image.hidden = true; });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.getElementById(decodeURIComponent(targetId.slice(1)));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', targetId);
  });
});
