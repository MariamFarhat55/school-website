const API = 'https://school-website-production-31eb.up.railway.app/api';

// Scroll animations observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Load ticker
async function loadTicker() {
  try {
    const res = await fetch(`${API}/achievements/ticker`);
    const achievements = await res.json();
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent || achievements.length === 0) return;
    const items = [...achievements, ...achievements]
      .map(a => `<span>🏆 ${a.title}</span>`)
      .join('');
    tickerContent.innerHTML = items;
  } catch (err) {
    console.log('Ticker error:', err);
  }
}

loadTicker();