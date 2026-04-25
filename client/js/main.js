const API = 'https://mediumaquamarine-wallaby-658287.hostingersite.com/api';

function toggleMenu() {
  const nav = document.getElementById('nav-links');
  nav.classList.toggle('open');
}

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
    const [schoolRes, teacherRes] = await Promise.all([
      fetch(`${API}/achievements/ticker`),
      fetch(`${API}/teachers`)
    ]);
    const schoolAch = await schoolRes.json();
    const teachers = await teacherRes.json();

    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent) return;

    const schoolItems = schoolAch.map(a => `<span>🏆 ${a.title}</span>`);
    const teacherItems = teachers.map(t => `<span>👨‍🏫 ${t.name} — ${t.subject}</span>`);
    const allItems = [...schoolItems, ...teacherItems, ...schoolItems, ...teacherItems, ...schoolItems];

    tickerContent.innerHTML = allItems.join('');
  } catch (err) {
    console.log('Ticker error:', err);
  }
}
const links = document.querySelectorAll(".nav-links a");
const currentPage = window.location.pathname.split("/").pop();
links.forEach(link => {
  const linkPage = link.getAttribute("href");
  if (linkPage === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

loadTicker();