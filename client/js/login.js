const API = 'http://localhost:5000/api';

async function doLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('login-err');

  if (!email || !password) {
    errEl.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errEl.style.display = 'block';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userName', data.name);

    if (data.role === 'admin') {
      localStorage.setItem('adminToken', data.token);
      window.location.href = 'admin.html';
    } else if (data.role === 'teacher') {
      window.location.href = `teacher.html?id=${data.teacherId}`;
    }

  } catch (err) {
    errEl.style.display = 'block';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});