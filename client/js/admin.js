const API = 'https://mediumaquamarine-wallaby-658287.hostingersite.com/api';

// Login
window.onload = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  showDashboard();
};

// Logout
function doLogout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = 'login.html';
}

// Show dashboard
function showDashboard() {
  localStorage.setItem('role', 'admin');
  localStorage.setItem('token', localStorage.getItem('adminToken'));
  document.getElementById('dashboard').style.display = 'block';
  showTab('achievements');
}
// Tabs
function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).style.display = 'block';
  document.getElementById(`btn-${tab}`).classList.add('active');

  if (tab === 'achievements') loadAchievements();
  if (tab === 'videos') loadVideos();
  if (tab === 'teachers') loadTeachers();
}

// ===== ACHIEVEMENTS =====
async function loadAchievements() {
  try {
    const res = await fetch(`${API}/achievements`);
    const achievements = await res.json();
    const container = document.getElementById('achievements-list');

    if (achievements.length === 0) {
      container.innerHTML = `<p style="color: var(--text-mid); text-align:center;">لا توجد إنجازات بعد</p>`;
      return;
    }

    container.innerHTML = achievements.map(a => `
      <div class="ach-list-item" id="ach-${a._id}">
        <div>
          <h6>${a.title}</h6>
          <p>${a.description}</p>
        </div>
        <button class="btn-delete" onclick="deleteAchievement('${a._id}')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `).join('');
  } catch (err) {
    console.log('Error:', err);
  }
}

async function addAchievement() {
  const token = localStorage.getItem('adminToken');
  const title = document.getElementById('ach-title').value;
  const desc = document.getElementById('ach-desc').value;
  const date = document.getElementById('ach-date').value;
  const image = document.getElementById('ach-image').files[0];

  if (!title || !desc || !date) {
    alert('من فضلك املأ كل الحقول');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', desc);
  formData.append('date', date);
  if (image) formData.append('image', image);

  try {
    const res = await fetch(`${API}/achievements`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      showSuccess('ach-success');
      document.getElementById('ach-title').value = '';
      document.getElementById('ach-desc').value = '';
      document.getElementById('ach-date').value = '';
      document.getElementById('ach-image').value = '';
      loadAchievements();
    }
  } catch (err) {
    console.log('Error:', err);
  }
}

async function deleteAchievement(id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  const token = localStorage.getItem('adminToken');

  try {
    const res = await fetch(`${API}/achievements/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) document.getElementById(`ach-${id}`)?.remove();
  } catch (err) {
    console.log('Error:', err);
  }
}

// ===== VIDEOS =====
async function loadVideos() {
  try {
    const res = await fetch(`${API}/videos`);
    const videos = await res.json();
    const container = document.getElementById('videos-list');

    if (videos.length === 0) {
      container.innerHTML = `<p style="color: var(--text-mid); text-align:center;">لا توجد فيديوهات بعد</p>`;
      return;
    }

    container.innerHTML = videos.map(v => `
      <div class="ach-list-item" id="vid-${v._id}">
        <div>
          <h6>${v.title}</h6>
          <p>${v.description}</p>
        </div>
        <button class="btn-delete" onclick="deleteVideo('${v._id}')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `).join('');
  } catch (err) {
    console.log('Error:', err);
  }
}

async function addVideo() {
  const token = localStorage.getItem('adminToken');
  const title = document.getElementById('vid-title').value;
  const desc = document.getElementById('vid-desc').value;
  const file = document.getElementById('vid-file').files[0];

  if (!title || !file) {
    alert('من فضلك أضف العنوان والفيديو');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', desc);
  formData.append('video', file);

  try {
    const res = await fetch(`${API}/videos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      showSuccess('vid-success');
      document.getElementById('vid-title').value = '';
      document.getElementById('vid-desc').value = '';
      document.getElementById('vid-file').value = '';
      loadVideos();
    }
  } catch (err) {
    console.log('Error:', err);
  }
}

async function deleteVideo(id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  const token = localStorage.getItem('adminToken');

  try {
    const res = await fetch(`${API}/videos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) document.getElementById(`vid-${id}`)?.remove();
  } catch (err) {
    console.log('Error:', err);
  }
}
// ===== TEACHERS =====
async function loadTeachers() {
  try {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API}/auth/teachers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const teachers = await res.json();
    const container = document.getElementById('teachers-list');

    if (teachers.length === 0) {
      container.innerHTML = `<p style="color: var(--text-mid); text-align:center;">لا يوجد معلمون مسجلون بعد</p>`;
      return;
    }

    container.innerHTML = teachers.map(t => `
      <div class="ach-list-item" id="teacher-${t._id}">
        <div style="display:flex; align-items:center; gap:1rem;">
          <div style="width:44px;height:44px;border-radius:50%;background:var(--cream-dark);display:flex;align-items:center;justify-content:center;overflow:hidden;">
            ${t.teacherId?.photo
              ? `<img src="${t.teacherId?.photo}" style="width:100%;height:100%;object-fit:cover;"/>`
              : `<i class="bi bi-person-fill" style="color:var(--gold);"></i>`}
          </div>
          <div>
            <h6>${t.name}</h6>
            <p>${t.teacherId?.subject || 'غير محدد'}</p>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <span style="font-size:0.8rem; padding:0.25rem 0.75rem; border-radius:20px; font-weight:600;
            background:${t.status === 'approved' ? 'rgba(25,135,84,0.1)' : t.status === 'rejected' ? 'rgba(220,53,69,0.1)' : 'rgba(255,193,7,0.1)'};
            color:${t.status === 'approved' ? '#198754' : t.status === 'rejected' ? '#dc3545' : '#856404'};">
            ${t.status === 'approved' ? 'مقبول' : t.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
          </span>
          ${t.status === 'pending' ? `
            <button class="btn-delete" style="border-color:#198754; color:#198754;" onclick="approveTeacher('${t._id}')">
              <i class="bi bi-check-lg"></i>
            </button>
            <button class="btn-delete" onclick="rejectTeacher('${t._id}')">
              <i class="bi bi-x-lg"></i>
            </button>
          ` : ''}
          ${t.teacherId?._id ? `
            <a href="teacher.html?id=${t.teacherId._id}" 
              style="font-size:0.85rem; color:var(--gold); text-decoration:none; border:1.5px solid var(--gold); padding:0.35rem 0.8rem; border-radius:8px;">
              <i class="bi bi-eye"></i>
           </a>
          ` : ''}
         <button class="btn-delete" onclick="deleteTeacher('${t.teacherId?._id}')">
          <i class="bi bi-trash"></i>
        </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.log('Error:', err);
  }
}

async function approveTeacher(id) {
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`${API}/auth/approve/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) loadTeachers();
  } catch (err) {
    console.log('Error:', err);
  }
}

async function rejectTeacher(id) {
  if (!confirm('هل أنت متأكد من رفض هذا المعلم؟')) return;
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`${API}/auth/reject/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) loadTeachers();
  } catch (err) {
    console.log('Error:', err);
  }
}

async function deleteTeacher(id) {
  if (!confirm('هل أنت متأكد من حذف المعلم؟')) return;
  const token = localStorage.getItem('adminToken');
  try {
    const res = await fetch(`${API}/teachers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) document.getElementById(`teacher-${id}`)?.remove();
  } catch (err) {
    console.log('Error:', err);
  }
}

async function addTeacher() {
  const token = localStorage.getItem('adminToken');
  const name = document.getElementById('t-name').value;
  const subject = document.getElementById('t-subject').value;
  const email = document.getElementById('t-email').value;
  const password = document.getElementById('t-password').value;
  const bio = document.getElementById('t-bio').value;
  const phone = document.getElementById('t-phone').value;

  if (!name || !subject || !email || !password) {
    alert('من فضلك املأ الاسم والمادة والإيميل والباسورد');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('subject', subject);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('bio', bio);
  formData.append('phone', phone);

  try {
    const res = await fetch(`${API}/teachers/register`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      // Approve teacher automatically
      await fetch(`${API}/auth/approve-by-teacher/${data.teacherId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      showSuccess('teacher-success');
      document.getElementById('t-name').value = '';
      document.getElementById('t-subject').value = '';
      document.getElementById('t-email').value = '';
      document.getElementById('t-password').value = '';
      document.getElementById('t-bio').value = '';
      document.getElementById('t-phone').value = '';
      loadTeachers();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log('Error:', err);
  }
}

// Helper
function showSuccess(id) {
  const el = document.getElementById(id);
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});