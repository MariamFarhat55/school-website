const API = 'https://mediumaquamarine-wallaby-658287.hostingersite.com/api';

async function doRegister() {
  const name = document.getElementById('name').value;
  const subject = document.getElementById('subject').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const bio = document.getElementById('bio').value;
  const phone = document.getElementById('phone').value;
  const photo = document.getElementById('photo').files[0];

  const errEl = document.getElementById('err-msg');
  const errText = document.getElementById('err-text');
  const successEl = document.getElementById('success-msg');

  if (!name || !subject || !email || !password) {
    errText.textContent = 'من فضلك املأ كل الحقول المطلوبة';
    errEl.style.display = 'block';
    return;
  }

  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('subject', subject);
    formData.append('bio', bio);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('password', password);
    if (photo) formData.append('photo', photo);

    const teacherRes = await fetch(`${API}/teachers/register`, {
      method: 'POST',
      body: formData
    });

    const teacherData = await teacherRes.json();

    if (!teacherRes.ok) {
      errText.textContent = teacherData.message || 'حدث خطأ، حاول مرة أخرى';
      errEl.style.display = 'block';
      return;
    }

    errEl.style.display = 'none';
    successEl.style.display = 'block';

    // تفريغ الفورم
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 3000);

  } catch (err) {
    errText.textContent = 'حدث خطأ في الاتصال، حاول مرة أخرى';
    errEl.style.display = 'block';
  }
}