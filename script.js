(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const year = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');

  if (year) year.textContent = String(new Date().getFullYear());

  function setTheme(next) {
    if (next === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('theme', next);
    } catch (_) {}
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  setTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isLight = root.getAttribute('data-theme') === 'light';
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  function setMobileNavOpen(open) {
    if (!mobileNav) return;
    mobileNav.hidden = !open;
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (!mobileNav) return;
      setMobileNavOpen(Boolean(mobileNav.hidden));
    });
  }

  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      const target = e.target;
      if (target && target.tagName === 'A') setMobileNavOpen(false);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get('name') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const message = String(fd.get('message') || '').trim();

      const text = [
        '[Portfolio Contact]',
        'Name: ' + name,
        'Email: ' + email,
        'Message:',
        message,
      ].join('\n');

      try {
        await navigator.clipboard.writeText(text);
        alert('메시지를 클립보드에 복사했어요. 메일/메신저에 붙여넣어 보내면 됩니다.');
        contactForm.reset();
      } catch (_) {
        alert('클립보드 복사에 실패했어요. 브라우저 권한을 확인하거나 HTTPS 환경에서 다시 시도해주세요.');
      }
    });
  }
})();
