async function loadAchievements() {
  try {
    const res = await fetch(`${API}/achievements`);
    const achievements = await res.json();
    const container = document.getElementById('achievements-container');

    document.getElementById('loading')?.remove();

    if (achievements.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-4">
          <p style="color: var(--text-mid);">لا توجد إنجازات بعد</p>
        </div>`;
      return;
    }

    const icons = ['bi-trophy-fill', 'bi-star-fill', 'bi-award-fill',
                   'bi-patch-check-fill', 'bi-shield-fill-check', 'bi-gem'];

    achievements.forEach((a, i) => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4 fade-in d-flex';
      col.innerHTML = `
        <div class="ach-card w-100">
          <div style="flex:1;">
            <div class="ach-icon">
              <i class="bi ${icons[i % icons.length]}"></i>
            </div>
            ${a.image ? `<img src="${a.image}" class="ach-image" alt="${a.title}"/>` : ''}
            <h5>${a.title}</h5>
            <p>${a.description}</p>
          </div>
          <span class="ach-date">
            <i class="bi bi-calendar3 me-1"></i>
            ${new Date(a.date).toLocaleDateString('ar-EG-u-nu-latn')}
        
          </span>
        </div>`;
      container.appendChild(col);
      observer.observe(col);
    });
  } catch (err) {
    console.log('Error:', err);
  }
}

async function loadVideos() {
  try {
    const res = await fetch(`${API}/videos`);
    const videos = await res.json();
    const container = document.getElementById('videos-container');

    if (videos.length === 0) {
      container.innerHTML = `<p style="color: var(--text-mid); text-align:center;">لا توجد فيديوهات بعد</p>`;
      return;
    }

    container.innerHTML = videos.map(v => `
      <div class="col-md-4 fade-in">
        <div class="video-card">
          <video controls>
           <source src="${v.filename}" type="video/mp4"/>
          </video>
          <div class="video-info">
            <span>نادي العلوم والذكاء الاصطناعي</span>
            <h6>${v.title}</h6>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  } catch (err) {
    console.log('Videos error:', err);
  }
}

loadAchievements();
loadVideos();