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
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});