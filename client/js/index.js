async function loadTeachers() {
  try {
    const res = await fetch(`${API}/teachers`);
    const teachers = await res.json();
    const container = document.getElementById('teachers-preview');

    if (teachers.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-4">
          <p style="color: var(--text-mid); font-size: 0.95rem;">
            لم يتم إضافة معلمين بعد — 
            <a href="join.html" style="color: var(--gold); font-weight: 700;">كن أول المسجلين</a>
          </p>
        </div>`;
      return;
    }

    teachers.slice(0, 4).forEach(t => {
      const card = document.createElement('div');
      card.className = 'col-6 col-md-4 col-lg-3 fade-in';
      card.innerHTML = `
        <div class="teacher-card">
          <div class="teacher-photo">
            ${t.photo
              ? `<img src="${API.replace('/api','')}/uploads/${t.photo}" alt="${t.name}"/>`
              : `<i class="bi bi-person-fill"></i>`}
          </div>
          <h6>${t.name}</h6>
          <span class="teacher-subject">${t.subject}</span>
          <div class="teacher-card-footer">
            <a href="teacher.html?id=${t._id}">عرض الملف <i class="bi bi-arrow-left"></i></a>
          </div>
        </div>`;
      container.appendChild(card);
      observer.observe(card);
    });
  } catch (e) {
    console.log('API not connected yet');
  }
}

loadTeachers();