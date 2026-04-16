(function () {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-value]'));
  const revealTargets = Array.from(document.querySelectorAll('.reveal'));
  const filterButtons = Array.from(document.querySelectorAll('[data-filter-button]'));
  const filterCards = Array.from(document.querySelectorAll('[data-filter-card]'));

  const THEME_KEY = 'ddingpack-theme';
  const savedTheme = localStorage.getItem(THEME_KEY);
  const defaultTheme = savedTheme || 'dark';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeButtons.forEach((button) => {
      const isActive = button.dataset.themeValue === theme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  applyTheme(defaultTheme);

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.dataset.themeValue;
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
    });
  });

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  function closeMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      body.classList.toggle('menu-open', isOpen);
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.classList.contains('is-open')) return;
      const target = event.target;
      if (mobileMenu.contains(target) || menuToggle.contains(target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  const currentPath = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px'
    });

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filterButton;

      filterButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      filterCards.forEach((card) => {
        const category = card.dataset.filterCard;
        const shouldShow = filter === 'all' || category === filter;
        card.hidden = !shouldShow;
      });
    });
  });

  (function initBetaPopup() {
    const popup = document.getElementById('betaPopup');
    const closeButton = document.getElementById('betaPopupClose');
    const confirmButton = document.getElementById('betaPopupConfirm');
    const hideToday = document.getElementById('betaPopupHideToday');
    if (!popup || !closeButton || !confirmButton) return;

    const LEGACY_KEY = 'ddingpack-beta-popup-until';
    const KEY = 'ddingpack-main-beta-popup-v1-until';
    const now = Date.now();
    const hiddenUntil = Number(localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY) || '0');

    if (hiddenUntil <= now) {
      popup.hidden = false;
      popup.classList.add('is-open');
      body.classList.add('menu-open');
    }

    function closePopup() {
      if (hideToday && hideToday.checked) {
        const oneDay = 24 * 60 * 60 * 1000;
        localStorage.setItem(KEY, String(Date.now() + oneDay));
      }
      popup.classList.remove('is-open');
      popup.hidden = true;
      body.classList.remove('menu-open');
    }

    closeButton.addEventListener('click', closePopup);
    confirmButton.addEventListener('click', closePopup);
    popup.addEventListener('click', (event) => {
      if (event.target === popup) closePopup();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && popup.classList.contains('is-open')) {
        closePopup();
      }
    });
  })();

  (function initChannelTalk() {
    var w = window;
    if (w.ChannelIO) return;
    var ch = function () { ch.c(arguments); };
    ch.q = [];
    ch.c = function (args) { ch.q.push(args); };
    w.ChannelIO = ch;

    function loadScript() {
      if (w.ChannelIOInitialized) return;
      w.ChannelIOInitialized = true;
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }

    if (document.readyState === 'complete') loadScript();
    else {
      w.addEventListener('DOMContentLoaded', loadScript);
      w.addEventListener('load', loadScript);
    }

    w.ChannelIO('boot', {
      pluginKey: '5a172fdc-10ee-45ca-b437-b1c63541c969',
      language: 'ko'
    });
  })();
})();