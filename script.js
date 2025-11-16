(() => {
  
  const navbarHTML = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
  <div class="container">
    <a class="navbar-brand fw-bold fs-4" href="index.html">SAMSUNG</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="topNav">
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <li class="nav-item"><a class="nav-link" href="index.html">Главная</a></li>
        <li class="nav-item"><a class="nav-link" href="about.html">О компании</a></li>
        <li class="nav-item"><a class="nav-link" href="product.html">Продукты</a></li>
        <li class="nav-item"><a class="nav-link" href="team.html">Команда</a></li>
        <li class="nav-item"><a class="nav-link" href="contact.html">Контакты</a></li>
        <li class="nav-item ms-3">
          <button id="themeToggle" class="btn btn-sm btn-outline-light"><i class="bi bi-moon"></i></button>
        </li>
      </ul>
    </div>
  </div>
</nav>`;

  const footerHTML = `
<footer class="bg-dark text-white-50">
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
      <div>
        <strong>Samsung</strong> — Инновации, дизайн и качество.
        <div class="small text-muted">© 2025 Samsung. Все права защищены.</div>
      </div>
      <div class="text-end small">
        <a href="./confiden.html" class="text-white-50">Политика конфиденциальности</a>
      </div>
    </div>
  </div>
</footer>`;

  const navbarRoot = document.getElementById('navbar');
  const footerRoot = document.getElementById('footer');
  if (navbarRoot) navbarRoot.innerHTML = navbarHTML;
  if (footerRoot) footerRoot.innerHTML = footerHTML;

  
  const navLinks = document.querySelectorAll('.navbar .nav-link');
  navLinks.forEach(a => {
    if (location.pathname.endsWith(a.getAttribute('href'))) {
      a.classList.add('active');
    }
  });

  
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (dark) => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('darkMode', dark ? '1' : '0');
    if (themeToggle) themeToggle.innerHTML = dark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
  };

  const stored = localStorage.getItem('darkMode');
  setTheme(stored === '1' || (stored === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));
  if (themeToggle) themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));

  
  const reveals = () => {
    const nodes = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('show');
      });
    }, { threshold: 0.12 });
    nodes.forEach(n => obs.observe(n));
  };
  reveals();

 
  const ensureQuickModal = () => {
    if (document.getElementById('quickViewModal')) return;
    const tpl = document.createElement('div');
    tpl.innerHTML = `
<div class="modal fade" id="quickViewModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body p-0">
        <div class="row g-0">
          <div class="col-md-6">
            <img id="quickViewImg" src="" alt="" class="img-fluid w-100 h-100 object-cover">
          </div>
          <div class="col-md-6 p-4">
            <h4 id="quickViewTitle"></h4>
            <p id="quickViewDesc" class="text-muted"></p>
            <div class="mt-3">
              <button class="btn btn-primary me-2">Купить</button>
              <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Закрыть</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(tpl);
  };
  ensureQuickModal();

  window.openQuickView = (btn) => {
    const data = btn.getAttribute('data-product');
    if (!data) return;
    const product = JSON.parse(data);
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewDesc').textContent = product.desc;
    document.getElementById('quickViewImg').src = product.img;
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
  };

  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const productsGrid = document.getElementById('productsGrid');

  if (searchInput && productsGrid) {
    const items = Array.from(productsGrid.querySelectorAll('.product-item'));
    const doFilter = () => {
      const q = searchInput.value.trim().toLowerCase();
      const cat = filterSelect ? filterSelect.value : 'all';
      items.forEach(item => {
        const title = (item.querySelector('h5')?.textContent || '').toLowerCase();
        const matchesQ = !q || title.includes(q);
        const matchesCat = (cat === 'all') || (item.dataset.category === cat);
        item.style.display = (matchesQ && matchesCat) ? '' : 'none';
      });
    };
    searchInput.addEventListener('input', doFilter);
    if (filterSelect) filterSelect.addEventListener('change', doFilter);
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
   
      const successModalEl = document.getElementById('successModal');
      if (successModalEl) {
        const modal = new bootstrap.Modal(successModalEl);
        modal.show();
        contactForm.reset();
      } else {
        // fallback toast
        const toastEl = document.getElementById('actionToast');
        if (toastEl) new bootstrap.Toast(toastEl).show();
        contactForm.reset();
      }
    });
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('a[href^="#"]');
    if (t) {
      e.preventDefault();
      const id = t.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.matches('.navbar .nav-link')) {
      const collapse = document.querySelector('.navbar-collapse');
      if (collapse && collapse.classList.contains('show')) {
        new bootstrap.Collapse(collapse).hide();
      }
    }
  });


})();

const themeToggle = document.getElementById('themeToggle');
const body = document.body;


const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.dataset.bsTheme = savedTheme;
  if (savedTheme === 'dark') themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
  else themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
}


themeToggle.addEventListener('click', () => {
  const currentTheme = body.dataset.bsTheme === 'dark' ? 'light' : 'dark';
  body.dataset.bsTheme = currentTheme;
  localStorage.setItem('theme', currentTheme);
  themeToggle.innerHTML =
    currentTheme === 'dark'
      ? '<i class="bi bi-sun"></i>'
      : '<i class="bi bi-moon"></i>';
});
