async function loadNews() {
  const staticNews = [
    {
      title: 'اجتماع مدير المدرسة بالهيئة التعليمية',
      desc: 'عُقد الاجتماع لمناقشة سير العملية التعليمية واستعراض أبرز المستجدات نحو بيئة تعليمية متميزة',
      date: '1447/10/28',
      img: 'https://res.cloudinary.com/dcasjbmt2/image/upload/q_auto/f_auto/v1777151351/a2b53af3-2f0f-40f4-b193-95b804747561_seus4o.jpg'
    },
    {
      title: 'معلم الشهر — الأستاذ عبدالله حسن الحارثي',
      desc: 'تكريم معلم الشهر نموذج للعطاء والإخلاص في ميدان التعليم',
      date: '1447/11/3',
      img: 'https://res.cloudinary.com/dcasjbmt2/image/upload/q_auto/f_auto/v1777151421/a4e2f772-160d-4597-83ed-372c9aad7648_kkjevc.jpg'
    },
    {
      title: 'موظف الشهر — الأستاذ يحيى أحمد الزهراني',
      desc: 'تكريم موظف الشهر تقديراً لجهوده المباركة وعطائه المستمر في خدمة العمل',
      date: '1447/11/3',
      img: 'https://res.cloudinary.com/dcasjbmt2/image/upload/q_auto/f_auto/v1777151467/03bd2d1c-08b9-4c09-b0ca-7587fd9a32cd_n3esoo.jpg'
    },
    {
      title: 'تكريم وتحفيز — أبطال التايكوندو',
      desc: 'كرمت إدارة المدرسة الطالبين عصمت وزين فلمبان لحصولهم على بطولات محلية ودولية',
      date: '1447/11/4',
      img: 'https://res.cloudinary.com/dcasjbmt2/image/upload/q_auto/f_auto/v1777151478/8efdc53e-5f35-41d9-9fd0-bc13071ac3a4_bhpav5.jpg'
    },
    {
      title: 'تفوق وتميز — مسابقة نافس',
      desc: 'تبارك المدرسة للطالبين أحمد مرجان وحسن الديري تفوقهما في مسابقة نافس',
      date: '1447/11/4',
      img: 'https://res.cloudinary.com/dcasjbmt2/image/upload/q_auto/f_auto/v1777151487/99aee77d-9134-4a24-be0d-006ee7d47edb_kc0gui.jpg'
    },
    {
      title: 'اجتماع فريق التقويم الذاتي',
      desc: 'عُقد اجتماع مع مدير المدرسة وأعضاء فريق التقويم الذاتي الداخلي للتعريف بالفريق وآلية عمله',
      date: '1447/11/5',
      img: 'https://res.cloudinary.com/dcasjbmt2/image/upload/q_auto/f_auto/v1777151496/e299fc8d-9f75-481c-902c-f4a41af1f703_tkq9vs.jpg'
    },
    {
      title: 'شكر وتقدير من إدارة التعليم',
      desc: 'حصلت المدرسة على شكر وتقدير من الإدارة العامة للتعليم بمنطقة مكة المكرمة على تفعيل يوم التأسيس',
      date: '1447/11/5',
      img: 'https://res.cloudinary.com/dcasjbmt2/image/upload/q_auto/f_auto/v1777151510/97696249-9246-4a6a-9772-19a63cb62446_q1rf8o.jpg'
    }
  ];

   let allNews = [...staticNews];

  try {
    const res = await fetch(`${API}/achievements`);
    const achievements = await res.json();
    const withImages = achievements
      .filter(a => a.image)
      .slice(0, 3)
      .map(a => ({
        title: a.title,
        desc: a.description,
        date: new Date(a.date).toLocaleDateString('ar-SA-u-nu-latn'),
        img: a.image
      }));
    allNews = [...withImages, ...staticNews];
  } catch (e) {}

  const container = document.getElementById('news-container');
  if (!container) return;

  container.innerHTML = allNews.map(n => `
    <div class="col-md-6 col-lg-4 fade-in">
      <div class="news-card">
        <img src="${n.img}" alt="${n.title}" class="news-img"/>
        <div class="news-body">
          <h6>${n.title}</h6>
          <p>${n.desc}</p>
          <span class="news-date"><i class="bi bi-calendar3 me-1"></i>${n.date}</span>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

loadNews();


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
              ? `<img src="${t.photo}" alt="${t.name}"/>`
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