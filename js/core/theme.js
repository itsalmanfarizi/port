/* =========================================================
   GLOBAL THEME SYSTEM (LIGHT / DARK)
   Tab color selalu mengikuti tema web
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const themeMeta = document.querySelector('meta[name="theme-color"]') || createThemeMeta();
  const toggleBtn = document.getElementById('toggle-theme');

  // ===============================
  // 1. DETEKSI TEMA AWAL
  // ===============================
  const storedTheme = localStorage.getItem('theme');
  const devicePrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDark = storedTheme
    ? storedTheme === 'dark'
    : devicePrefersDark;

  // ===============================
  // 2. FUNSI UNTUK MEMASTIKAN META ADA
  // ===============================
  function createThemeMeta() {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    return meta;
  }

  // ===============================
  // 3. FUNSI UPDATE TAB COLOR
  // ===============================
  function updateTabColor() {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', isDark ? '#0a0a0a' : '#fafafa');
  }

  // ===============================
  // 4. FUNSI APPLY TEMA
  // ===============================
  function applyTheme() {
    document.body.classList.toggle('dark-mode', isDark);
    updateTabColor();

    if (toggleBtn) {
      toggleBtn.innerHTML = `<i data-feather="${isDark ? 'sun' : 'moon'}"></i>`;
      if (window.feather) feather.replace();
    }
  }

  // ===============================
  // 5. TOGGLE BUTTON MANUAL
  // ===============================
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isDark = !isDark;
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyTheme();
    });
  }

  // ===============================
  // 6. SISTEM DARK/LIGHT MODE OTOMATIS
  // ===============================
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', e => {
    if (!storedTheme) {
      isDark = e.matches;
      applyTheme();
    }
  });

  // ===============================
  // 7. APPLY TEMA AWAL
  // ===============================
  applyTheme();
});

// ===============================
// DESKTOP SYSTEM THEME HANDLER
// ===============================

const isDesktop = window.matchMedia('(pointer: fine)').matches;
const desktopThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

if (isDesktop) {
  if (!localStorage.getItem('theme')) {
    const isDark = desktopThemeQuery.matches;

    document.body.classList.toggle('dark-mode', isDark);

    const themeMeta =
      document.querySelector('meta[name="theme-color"]') ||
      (() => {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
        return meta;
      })();

    themeMeta.setAttribute('content', isDark ? '#0a0a0a' : '#fafafa');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('themeSource', 'system');
  }

  desktopThemeQuery.addEventListener('change', e => {
    if (localStorage.getItem('themeSource') === 'system') {
      const isDark = e.matches;

      document.body.classList.toggle('dark-mode', isDark);

      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', isDark ? '#0a0a0a' : '#fafafa');
      }

      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  });
}