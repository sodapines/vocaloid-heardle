// ── SETTINGS ──
// Each setting: key in localStorage, body class when off/on, default

const SETTINGS = {
  darkmode:     { key: 'vh-darkmode',     bodyClass: 'dark-mode',    default: false },
  danmaku:      { key: 'vh-danmaku',      bodyClass: 'no-danmaku',   default: true  },
  marquee:      { key: 'vh-marquee',      bodyClass: 'no-marquee',   default: true  },
  sidebar:      { key: 'vh-sidebar',      bodyClass: 'no-sidebar',   default: true  },
  autocomplete: { key: 'vh-autocomplete', bodyClass: 'no-autocomplete', default: true },
};

function getSetting(id) {
  const s = SETTINGS[id];
  const stored = localStorage.getItem(s.key);
  if (stored === null) return s.default;
  return stored === 'true';
}

function applySetting(id, value) {
  const s = SETTINGS[id];
  localStorage.setItem(s.key, value);

  if (id === 'darkmode') {
    document.documentElement.classList.toggle('dark-mode', value);
    document.body.classList.toggle('dark-mode', value);
  } else {
    // these settings add a class when OFF (inverted)
    document.body.classList.toggle(s.bodyClass, !value);
  }

  const btn = document.getElementById('setting-' + id);
  if (!btn) return;
  btn.textContent = value ? 'ON' : 'OFF';
  btn.classList.toggle('is-on', value);
  btn.setAttribute('aria-checked', value);
}

function applyDanmakuSpeed(value) {
  localStorage.setItem('vh-danmaku-speed', value);
  document.body.classList.remove('danmaku-slow', 'danmaku-fast');
  if (value === 'slow') document.body.classList.add('danmaku-slow');
  if (value === 'fast') document.body.classList.add('danmaku-fast');

  document.querySelectorAll('[data-setting="danmaku-speed"]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.value === value);
  });
}

// Apply all settings on load
function applyAllSettings() {
  Object.keys(SETTINGS).forEach(id => applySetting(id, getSetting(id)));
  const speed = localStorage.getItem('vh-danmaku-speed') || 'normal';
  applyDanmakuSpeed(speed);
}

applyAllSettings();

// Wire up toggle buttons
['darkmode', 'danmaku', 'marquee', 'sidebar', 'autocomplete'].forEach(id => {
  const btn = document.getElementById('setting-' + id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = getSetting(id);
    applySetting(id, !current);
  });
});

// Wire up speed buttons
document.querySelectorAll('[data-setting="danmaku-speed"]').forEach(btn => {
  btn.addEventListener('click', () => applyDanmakuSpeed(btn.dataset.value));
});
