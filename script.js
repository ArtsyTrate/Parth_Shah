const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Stagger individual images/videos inside projects that contain multiple assets.
// Any future gallery can opt in by using .asset-gallery or .media-gallery.
const multiAssetGalleries = document.querySelectorAll('.well-gallery, .asset-gallery, .media-gallery');

multiAssetGalleries.forEach(gallery => {
  const assets = gallery.querySelectorAll(':scope > img, :scope > video, :scope > picture, :scope > figure');

  assets.forEach((asset, index) => {
    if (prefersReducedMotion) {
      asset.style.opacity = '1';
      asset.style.transform = 'none';
      return;
    }

    asset.style.opacity = '0';
    asset.style.transform = `translateY(${28 + (index % 2) * 10}px) scale(.975)`;
    asset.style.filter = 'blur(5px) saturate(.92) contrast(1.04)';
    asset.style.transition = 'opacity .8s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1), filter .8s ease';
    asset.style.willChange = 'opacity, transform, filter';
  });

  if (prefersReducedMotion) return;

  const galleryObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      assets.forEach((asset, index) => {
        window.setTimeout(() => {
          asset.style.opacity = '1';
          asset.style.transform = 'translateY(0) scale(1)';
          asset.style.filter = 'blur(0) saturate(.92) contrast(1.04)';
          asset.addEventListener('transitionend', () => {
            asset.style.willChange = 'auto';
          }, { once: true });
        }, index * 140);
      });

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  galleryObserver.observe(gallery);
});

document.querySelectorAll('img[data-b64-src]').forEach(img => {
  fetch(img.dataset.b64Src)
    .then(response => response.text())
    .then(base64 => {
      img.src = 'data:image/webp;base64,' + base64.replace(/\s/g, '');
    })
    .catch(() => {
      img.style.display = 'none';
    });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});