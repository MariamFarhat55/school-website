const teacherId = new URLSearchParams(window.location.search).get('id');
const loggedInToken = localStorage.getItem('token');
const loggedInRole = localStorage.getItem('role');
let isOwner = false;

async function loadProfile() {
  try {
    const res = await fetch(`${API}/teachers/${teacherId}`);
    const teacher = await res.json();

    document.getElementById('profile-loading').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';

    // الصورة
    if (teacher.photo) {
      document.getElementById('profile-photo').innerHTML =
        `<img src="${teacher.photo}" alt="${teacher.name}"/>`;
    }

    document.getElementById('profile-name').textContent = teacher.name;
    document.getElementById('profile-subject').textContent = teacher.subject;

    if (teacher.bio) {
      document.getElementById('profile-bio').textContent = teacher.bio;
    }

    // معلومات التواصل
    let meta = '';
    if (teacher.email) meta += `<span><i class="bi bi-envelope-fill"></i>${teacher.email}</span>`;
    if (teacher.phone) meta += `<span><i class="bi bi-telephone-fill"></i>${teacher.phone}</span>`;
    document.getElementById('profile-meta').innerHTML = meta;

    // تحقق لو هو صاحب الصفحة  
const savedTeacherId = localStorage.getItem('teacherId');

if (loggedInToken && (loggedInRole === 'admin' || savedTeacherId === teacherId)) {
  isOwner = true;
  document.getElementById('add-btn').style.display = 'inline-block';
  document.getElementById('instructions-section').style.display = 'block';
}

    loadAchievements();
  } catch (err) {
    console.log('Error:', err);
  }
}

async function loadAchievements() {
  try {
    const res = await fetch(`${API}/teachers/${teacherId}/achievements`);
    const achievements = await res.json();
    const container = document.getElementById('achievements-container');

    if (achievements.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-4">
          <p style="color: var(--text-mid);">لا توجد إنجازات بعد</p>
        </div>`;
      return;
    }

   container.innerHTML = achievements.map(a => `
        <div class="col-md-6 col-lg-4 fade-in">
            <div class="ach-card">
            ${isOwner ? `<button class="ach-delete" onclick="deleteAchievement('${a._id}')"><i class="bi bi-trash"></i></button>` : ''}
            ${a.file ? `<img src="${a.file}" class="ach-image" alt="${a.title}" onerror="this.style.display='none'"/>` : ''}
            <h6>${a.title}</h6>
            <p>${a.description}</p>
            <span class="ach-date">
                <i class="bi bi-calendar3 me-1"></i>
                ${new Date(a.createdAt).toLocaleDateString('ar-EG-u-nu-latn')}
            </span>
            </div>
        </div>
        `).join('');

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  } catch (err) {
    console.log('Error:', err);
  }
}

async function addAchievement() {
  const token = localStorage.getItem('token');
  const title = document.getElementById('ach-title').value;
  const desc = document.getElementById('ach-desc').value;
  const file = document.getElementById('ach-file').files[0];

  if (!title || !desc) {
    alert('من فضلك املأ العنوان والوصف');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', desc);
  if (file) formData.append('file', file);

  try {
    const res = await fetch(`${API}/teachers/${teacherId}/achievements`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      closeModal();
      document.getElementById('ach-title').value = '';
      document.getElementById('ach-desc').value = '';
      document.getElementById('ach-file').value = '';
      loadAchievements();
    }
  } catch (err) {
    console.log('Error:', err);
  }
}

async function deleteAchievement(id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API}/teachers/${teacherId}/achievements/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) loadAchievements();
  } catch (err) {
    console.log('Error:', err);
  }
}

function openModal() {
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// حفظ teacherId في localStorage بعد الـ login
const urlTeacherId = new URLSearchParams(window.location.search).get('id');
if (urlTeacherId) localStorage.setItem('teacherId', urlTeacherId);

loadProfile();