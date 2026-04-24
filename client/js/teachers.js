let allTeachers = [];

async function loadTeachers() {
  try {
    const res = await fetch(`${API}/teachers`);
    allTeachers = await res.json();
    renderTeachers(allTeachers);
    document.getElementById('loading')?.remove();
  } catch (err) {
    console.log('Error:', err);
  }
}

function renderTeachers(teachers) {
  const container = document.getElementById('teachers-container');
  document.getElementById('loading')?.remove();

  if (teachers.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-4">
        <p style="color: var(--text-mid);">لا يوجد معلمون مسجلون بعد</p>
      </div>`;
    return;
  }

  container.innerHTML = teachers.map(t => `
    <div class="col-6 col-md-4 col-lg-3 fade-in">
      <div class="teacher-card">
        <div class="teacher-photo">
          ${t.photo
            ? `<img src="${API.replace('/api','')}/uploads/${t.photo}" alt="${t.name}"/>`
            : `<i class="bi bi-person-fill"></i>`}
        </div>
        <h5>${t.name}</h5>
        <span class="teacher-subject">${t.subject}</span>
        ${t.bio ? `<p class="teacher-bio">${t.bio}</p>` : ''}
        <div class="teacher-card-footer">
          <a href="teacher.html?id=${t._id}">
            عرض الملف <i class="bi bi-arrow-left"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function filterTeachers() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const filtered = allTeachers.filter(t =>
    t.name.toLowerCase().includes(search) ||
    t.subject.toLowerCase().includes(search)
  );

  const noResults = document.getElementById('no-results');
  if (filtered.length === 0) {
    noResults.classList.remove('d-none');
  } else {
    noResults.classList.add('d-none');
  }

  renderTeachers(filtered);
}

loadTeachers();