// Interactive 3D alarm clock for the hero card.
// Tries the local GLB first; if GitHub Pages serves the Git LFS pointer instead of the
// real binary, it retries from media.githubusercontent.com, then falls back to the poster.
(() => {
  const card = document.querySelector('.clock-card');
  const viewer = card && card.querySelector('model-viewer');
  if (!card || !viewer) return;

  const mediaUrl = 'https://media.githubusercontent.com/media/ArtsyTrate/Parth_Shah/main/assets/Projects/Alarm_Clock/Alarm_Clock.glb';
  let retried = false;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    viewer.removeAttribute('auto-rotate');
  }

  viewer.addEventListener('load', () => card.classList.add('is-loaded'));

  viewer.addEventListener('error', () => {
    if (!retried) {
      retried = true;
      viewer.src = mediaUrl;
      return;
    }
    card.classList.add('is-fallback');
  });

  // If the custom element never registers (blocked CDN, old browser), show the poster.
  window.setTimeout(() => {
    if (!window.customElements.get('model-viewer')) card.classList.add('is-fallback');
  }, 6000);
})();
