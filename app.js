'use strict';

/* ============================================================
   app.js — Nabung Untuk Masa Depan v1.2 (Refactored)
   Tahap 3/3 — JavaScript only. HTML & CSS tidak diubah.
   ============================================================ */

/* ============================================================
   1. CONFIG & CONSTANTS
   ============================================================ */
var API_URL   = 'https://script.google.com/macros/s/AKfycbwt8HGwnDW5ZolvkzAtzLuyNGbJClTUQLWivSyANcs4vxWBIsZsFVp8n8DOKQVN-auV/exec';
var TOKEN_KEY = 'nabung_token';
var THEME_KEY = 'nabung_theme';
var SEEN_ACH_KEY = 'nabung_seen_achievements';

var TX_TYPE_LABEL = {
  INCOME:     ['badge-income',     'Pemasukan'],
  EXPENSE:    ['badge-expense',    'Pengeluaran'],
  SAVING:     ['badge-saving',     'Tabungan'],
  WITHDRAWAL: ['badge-withdrawal', 'Tarik'],
};

var TX_TYPE_COLOR = {
  INCOME: 'var(--success)', EXPENSE: 'var(--danger)',
  SAVING: 'var(--primary)', WITHDRAWAL: 'var(--secondary)',
};

var RARITY_RANK = { ARTIFACT: 6, MYTHIC: 5, EPIC: 4, RARE: 3, UNCOMMON: 2, COMMON: 1 };

/* Kategori achievement — dipakai untuk filter bar */
var ACH_CATEGORIES = [
  'SAVING', 'TARGET', 'TRANSACTION', 'INCOME', 'EXPENSE',
  'SIMULATOR', 'LEVEL', 'ACHIEVEMENT', 'SYSTEM', 'SECRET', 'COLLECTION',
];

var ACH_STATUS_FILTERS = [
  { key: 'all',      label: 'Semua',    icon: '📋' },
  { key: 'unlocked', label: 'Terbuka',  icon: '🔓' },
  { key: 'locked',   label: 'Terkunci', icon: '🔒' },
];

var ACH_CATEGORY_LABELS = {
  SAVING:      { label: 'Saving',      icon: '💰' },
  TARGET:      { label: 'Target',      icon: '🎯' },
  TRANSACTION: { label: 'Transaction', icon: '📝' },
  INCOME:      { label: 'Income',      icon: '💵' },
  EXPENSE:     { label: 'Expense',     icon: '🛒' },
  SIMULATOR:   { label: 'Simulator',   icon: '🧮' },
  LEVEL:       { label: 'Level',       icon: '⭐' },
  ACHIEVEMENT: { label: 'Achievement', icon: '🏅' },
  SYSTEM:      { label: 'System',      icon: '💾' },
  SECRET:      { label: 'Secret',      icon: '🦉' },
  COLLECTION:  { label: 'Collection',  icon: '🏆' },
};

/* ============================================================
   2. THEME SYSTEM
   ============================================================ */
var THEMES = [
  {
    id: 'rog-black', name: 'ROG Black', emoji: '🖤',
    preview: { bg:'#0A0A0A', sidebar:'#111111', primary:'#FFD600', secondary:'#00E5FF', card:'#161616' },
    vars: {
      '--bg':'#0A0A0A','--card':'#111111','--card2':'#161616','--primary':'#FFD600','--secondary':'#00E5FF',
      '--success':'#00FF9D','--danger':'#FF4D4D','--text':'#F5F5F5','--muted':'#888888',
      '--border':'rgba(255,255,255,0.07)','--border-h':'rgba(255,255,255,0.14)',
      '--sidebar-bg':'#111111','--sidebar-border':'rgba(255,255,255,0.07)','--input-bg':'#0d0d0d',
      '--modal-bg':'#111111','--modal-top':'#FFD600','--scrollbar-thumb':'#2a2a2a',
      '--accent-glow':'rgba(255,214,0,0.08)','--accent-glow2':'rgba(0,229,255,0.05)',
      '--nav-active-bg':'rgba(255,214,0,0.06)','--progress-track':'rgba(255,255,255,0.06)',
      '--table-hover':'rgba(255,255,255,0.02)','--toast-bg':'#161616','--btn-primary-hover':'#ffe033',
      '--card-radius':'10px','--sidebar-header-border':'rgba(255,255,255,0.07)'
    }
  },
  {
    id: 'tuf-military', name: 'TUF Military', emoji: '🪖',
    preview: { bg:'#0f1108', sidebar:'#161a0c', primary:'#a3be00', secondary:'#e8a000', card:'#1e2210' },
    vars: {
      '--bg':'#0f1108','--card':'#161a0c','--card2':'#1e2210','--primary':'#a3be00','--secondary':'#e8a000',
      '--success':'#7ac700','--danger':'#e05a1c','--text':'#e8e8d8','--muted':'#7a7a60',
      '--border':'rgba(163,190,0,0.12)','--border-h':'rgba(163,190,0,0.22)',
      '--sidebar-bg':'#161a0c','--sidebar-border':'rgba(163,190,0,0.12)','--input-bg':'#0c1008',
      '--modal-bg':'#161a0c','--modal-top':'#a3be00','--scrollbar-thumb':'#3a4020',
      '--accent-glow':'rgba(163,190,0,0.10)','--accent-glow2':'rgba(232,160,0,0.08)',
      '--nav-active-bg':'rgba(163,190,0,0.10)','--progress-track':'rgba(163,190,0,0.10)',
      '--table-hover':'rgba(163,190,0,0.04)','--toast-bg':'#1e2210','--btn-primary-hover':'#bcd800',
      '--card-radius':'4px','--sidebar-header-border':'rgba(163,190,0,0.15)'
    }
  },
  {
    id: 'cyberpunk-2077', name: 'Cyberpunk 2077', emoji: '⚡',
    preview: { bg:'#060a0f', sidebar:'#0a1018', primary:'#f9e000', secondary:'#00c8ff', card:'#0d1520' },
    vars: {
      '--bg':'#060a0f','--card':'#0a1018','--card2':'#0d1520','--primary':'#f9e000','--secondary':'#00c8ff',
      '--success':'#00e87a','--danger':'#ff2a6d','--text':'#e8f0ff','--muted':'#6080a0',
      '--border':'rgba(0,200,255,0.10)','--border-h':'rgba(0,200,255,0.20)',
      '--sidebar-bg':'#0a1018','--sidebar-border':'rgba(0,200,255,0.12)','--input-bg':'#060e18',
      '--modal-bg':'#0a1018','--modal-top':'#00c8ff','--scrollbar-thumb':'#1a3050',
      '--accent-glow':'rgba(249,224,0,0.10)','--accent-glow2':'rgba(0,200,255,0.10)',
      '--nav-active-bg':'rgba(0,200,255,0.08)','--progress-track':'rgba(0,200,255,0.08)',
      '--table-hover':'rgba(0,200,255,0.04)','--toast-bg':'#0d1520','--btn-primary-hover':'#fff200',
      '--card-radius':'2px','--sidebar-header-border':'rgba(0,200,255,0.15)'
    }
  },
  {
    id: 'rgb-spectrum', name: 'RGB Spectrum', emoji: '🌈',
    preview: { bg:'#080010', sidebar:'#0d0018', primary:'#ff00aa', secondary:'#00ffee', card:'#100020' },
    vars: {
      '--bg':'#080010','--card':'#0d0018','--card2':'#100020','--primary':'#ff00aa','--secondary':'#00ffee',
      '--success':'#00ff88','--danger':'#ff3355','--text':'#f0e8ff','--muted':'#7755aa',
      '--border':'rgba(255,0,170,0.12)','--border-h':'rgba(0,255,238,0.18)',
      '--sidebar-bg':'#0d0018','--sidebar-border':'rgba(255,0,170,0.12)','--input-bg':'#08000e',
      '--modal-bg':'#0d0018','--modal-top':'#ff00aa','--scrollbar-thumb':'#330044',
      '--accent-glow':'rgba(255,0,170,0.12)','--accent-glow2':'rgba(0,255,238,0.10)',
      '--nav-active-bg':'rgba(255,0,170,0.10)','--progress-track':'rgba(255,255,255,0.07)',
      '--table-hover':'rgba(255,0,170,0.04)','--toast-bg':'#100020','--btn-primary-hover':'#ff44cc',
      '--card-radius':'12px','--sidebar-header-border':'rgba(255,0,170,0.15)'
    }
  },
  {
    id: 'galaxy', name: 'Galaxy', emoji: '🌌',
    preview: { bg:'#04041a', sidebar:'#08083a', primary:'#a78bfa', secondary:'#60a5fa', card:'#0c0c3a' },
    vars: {
      '--bg':'#04041a','--card':'#08083a','--card2':'#0c0c48','--primary':'#a78bfa','--secondary':'#60a5fa',
      '--success':'#34d399','--danger':'#f87171','--text':'#e0e8ff','--muted':'#6070aa',
      '--border':'rgba(167,139,250,0.12)','--border-h':'rgba(167,139,250,0.22)',
      '--sidebar-bg':'#060630','--sidebar-border':'rgba(167,139,250,0.10)','--input-bg':'#04042a',
      '--modal-bg':'#08083a','--modal-top':'#a78bfa','--scrollbar-thumb':'#1a1a5a',
      '--accent-glow':'rgba(167,139,250,0.12)','--accent-glow2':'rgba(96,165,250,0.10)',
      '--nav-active-bg':'rgba(167,139,250,0.10)','--progress-track':'rgba(167,139,250,0.10)',
      '--table-hover':'rgba(167,139,250,0.04)','--toast-bg':'#0c0c48','--btn-primary-hover':'#c4b0ff',
      '--card-radius':'14px','--sidebar-header-border':'rgba(167,139,250,0.15)'
    }
  },
  {
    id: 'neon-purple', name: 'Neon Purple', emoji: '💜',
    preview: { bg:'#0a0010', sidebar:'#120018', primary:'#d400ff', secondary:'#aa00ff', card:'#160020' },
    vars: {
      '--bg':'#0a0010','--card':'#120018','--card2':'#160020','--primary':'#d400ff','--secondary':'#ff00ff',
      '--success':'#00ffa3','--danger':'#ff2255','--text':'#f0e0ff','--muted':'#886699',
      '--border':'rgba(212,0,255,0.12)','--border-h':'rgba(212,0,255,0.22)',
      '--sidebar-bg':'#0e0014','--sidebar-border':'rgba(212,0,255,0.12)','--input-bg':'#08000c',
      '--modal-bg':'#120018','--modal-top':'#d400ff','--scrollbar-thumb':'#2a003a',
      '--accent-glow':'rgba(212,0,255,0.12)','--accent-glow2':'rgba(170,0,255,0.10)',
      '--nav-active-bg':'rgba(212,0,255,0.10)','--progress-track':'rgba(212,0,255,0.10)',
      '--table-hover':'rgba(212,0,255,0.04)','--toast-bg':'#160020','--btn-primary-hover':'#ee44ff',
      '--card-radius':'10px','--sidebar-header-border':'rgba(212,0,255,0.15)'
    }
  },
  {
    id: 'matrix', name: 'Matrix', emoji: '🟩',
    preview: { bg:'#000800', sidebar:'#001000', primary:'#00ff41', secondary:'#00cc33', card:'#001500' },
    vars: {
      '--bg':'#000800','--card':'#001200','--card2':'#001800','--primary':'#00ff41','--secondary':'#00cc33',
      '--success':'#39ff14','--danger':'#ff4400','--text':'#ccffcc','--muted':'#336633',
      '--border':'rgba(0,255,65,0.10)','--border-h':'rgba(0,255,65,0.20)',
      '--sidebar-bg':'#000e00','--sidebar-border':'rgba(0,255,65,0.10)','--input-bg':'#000600',
      '--modal-bg':'#001200','--modal-top':'#00ff41','--scrollbar-thumb':'#003300',
      '--accent-glow':'rgba(0,255,65,0.10)','--accent-glow2':'rgba(0,204,51,0.08)',
      '--nav-active-bg':'rgba(0,255,65,0.08)','--progress-track':'rgba(0,255,65,0.08)',
      '--table-hover':'rgba(0,255,65,0.04)','--toast-bg':'#001800','--btn-primary-hover':'#44ff66',
      '--card-radius':'2px','--sidebar-header-border':'rgba(0,255,65,0.12)'
    }
  },
  {
    id: 'carbon-fiber', name: 'Carbon Fiber', emoji: '⚙️',
    preview: { bg:'#111111', sidebar:'#1a1a1a', primary:'#e0e0e0', secondary:'#aaaaaa', card:'#222222' },
    vars: {
      '--bg':'#111111','--card':'#1a1a1a','--card2':'#222222','--primary':'#e0e0e0','--secondary':'#aaaaaa',
      '--success':'#66bb6a','--danger':'#ef5350','--text':'#f5f5f5','--muted':'#777777',
      '--border':'rgba(255,255,255,0.08)','--border-h':'rgba(255,255,255,0.15)',
      '--sidebar-bg':'#161616','--sidebar-border':'rgba(255,255,255,0.07)','--input-bg':'#0e0e0e',
      '--modal-bg':'#1a1a1a','--modal-top':'#e0e0e0','--scrollbar-thumb':'#333333',
      '--accent-glow':'rgba(255,255,255,0.06)','--accent-glow2':'rgba(255,255,255,0.04)',
      '--nav-active-bg':'rgba(255,255,255,0.06)','--progress-track':'rgba(255,255,255,0.07)',
      '--table-hover':'rgba(255,255,255,0.03)','--toast-bg':'#222222','--btn-primary-hover':'#ffffff',
      '--card-radius':'6px','--sidebar-header-border':'rgba(255,255,255,0.07)'
    }
  },
  {
    id: 'phantom', name: 'Phantom', emoji: '👻',
    preview: { bg:'#0c0c14', sidebar:'#12121e', primary:'#c0c0ff', secondary:'#8888dd', card:'#18182a' },
    vars: {
      '--bg':'#0c0c14','--card':'#12121e','--card2':'#18182a','--primary':'#c0c0ff','--secondary':'#9090ee',
      '--success':'#80ffcc','--danger':'#ff7788','--text':'#e8e8ff','--muted':'#6868a0',
      '--border':'rgba(192,192,255,0.10)','--border-h':'rgba(192,192,255,0.18)',
      '--sidebar-bg':'#0e0e18','--sidebar-border':'rgba(192,192,255,0.08)','--input-bg':'#0a0a12',
      '--modal-bg':'#12121e','--modal-top':'#c0c0ff','--scrollbar-thumb':'#2a2a44',
      '--accent-glow':'rgba(192,192,255,0.08)','--accent-glow2':'rgba(144,144,238,0.07)',
      '--nav-active-bg':'rgba(192,192,255,0.08)','--progress-track':'rgba(192,192,255,0.08)',
      '--table-hover':'rgba(192,192,255,0.03)','--toast-bg':'#18182a','--btn-primary-hover':'#ddddff',
      '--card-radius':'12px','--sidebar-header-border':'rgba(192,192,255,0.10)'
    }
  },
  {
    id: 'dragon-fire', name: 'Dragon Fire', emoji: '🐉',
    preview: { bg:'#120500', sidebar:'#1e0800', primary:'#ff6600', secondary:'#ff2200', card:'#200a00' },
    vars: {
      '--bg':'#120500','--card':'#1e0800','--card2':'#200a00','--primary':'#ff6600','--secondary':'#ff2200',
      '--success':'#ffcc00','--danger':'#ff1100','--text':'#ffe8d0','--muted':'#885544',
      '--border':'rgba(255,102,0,0.12)','--border-h':'rgba(255,102,0,0.22)',
      '--sidebar-bg':'#180600','--sidebar-border':'rgba(255,102,0,0.12)','--input-bg':'#0e0300',
      '--modal-bg':'#1e0800','--modal-top':'#ff6600','--scrollbar-thumb':'#441100',
      '--accent-glow':'rgba(255,102,0,0.14)','--accent-glow2':'rgba(255,34,0,0.10)',
      '--nav-active-bg':'rgba(255,102,0,0.10)','--progress-track':'rgba(255,102,0,0.10)',
      '--table-hover':'rgba(255,102,0,0.04)','--toast-bg':'#200a00','--btn-primary-hover':'#ff8833',
      '--card-radius':'8px','--sidebar-header-border':'rgba(255,102,0,0.15)'
    }
  },
  {
    id: 'ocean-tech', name: 'Ocean Tech', emoji: '🌊',
    preview: { bg:'#010f18', sidebar:'#021828', primary:'#00d4ff', secondary:'#0088cc', card:'#031e30' },
    vars: {
      '--bg':'#010f18','--card':'#021828','--card2':'#031e30','--primary':'#00d4ff','--secondary':'#0099ee',
      '--success':'#00ffcc','--danger':'#ff4488','--text':'#c8eeff','--muted':'#4488aa',
      '--border':'rgba(0,212,255,0.10)','--border-h':'rgba(0,212,255,0.20)',
      '--sidebar-bg':'#021420','--sidebar-border':'rgba(0,212,255,0.10)','--input-bg':'#010c14',
      '--modal-bg':'#021828','--modal-top':'#00d4ff','--scrollbar-thumb':'#0a3048',
      '--accent-glow':'rgba(0,212,255,0.10)','--accent-glow2':'rgba(0,153,238,0.08)',
      '--nav-active-bg':'rgba(0,212,255,0.08)','--progress-track':'rgba(0,212,255,0.08)',
      '--table-hover':'rgba(0,212,255,0.04)','--toast-bg':'#031e30','--btn-primary-hover':'#44eeff',
      '--card-radius':'14px','--sidebar-header-border':'rgba(0,212,255,0.12)'
    }
  },
  {
    id: 'midnight-blue', name: 'Midnight Blue', emoji: '🌙',
    preview: { bg:'#040816', sidebar:'#081028', primary:'#4d9fff', secondary:'#2266cc', card:'#0a1430' },
    vars: {
      '--bg':'#040816','--card':'#081028','--card2':'#0a1430','--primary':'#4d9fff','--secondary':'#2266cc',
      '--success':'#44ddaa','--danger':'#ee4466','--text':'#d0e8ff','--muted':'#4466aa',
      '--border':'rgba(77,159,255,0.10)','--border-h':'rgba(77,159,255,0.18)',
      '--sidebar-bg':'#060c22','--sidebar-border':'rgba(77,159,255,0.10)','--input-bg':'#040818',
      '--modal-bg':'#081028','--modal-top':'#4d9fff','--scrollbar-thumb':'#102040',
      '--accent-glow':'rgba(77,159,255,0.10)','--accent-glow2':'rgba(34,102,204,0.08)',
      '--nav-active-bg':'rgba(77,159,255,0.08)','--progress-track':'rgba(77,159,255,0.08)',
      '--table-hover':'rgba(77,159,255,0.04)','--toast-bg':'#0a1430','--btn-primary-hover':'#77bbff',
      '--card-radius':'10px','--sidebar-header-border':'rgba(77,159,255,0.12)'
    }
  }
];

function applyTheme(themeId) {
  var theme = THEMES.find(function (t) { return t.id === themeId; }) || THEMES[0];
  var root = document.documentElement;
  Object.keys(theme.vars).forEach(function (prop) { root.style.setProperty(prop, theme.vars[prop]); });
  document.body.className = document.body.className.split(' ').filter(function (c) { return !c.startsWith('theme-'); }).join(' ');
  document.body.classList.add('theme-' + theme.id);
  localStorage.setItem(THEME_KEY, theme.id);
  if (window.Chart) {
    Chart.defaults.color = theme.vars['--muted'] || '#888';
    Chart.defaults.borderColor = theme.vars['--border'] || 'rgba(255,255,255,0.06)';
  }
  document.querySelectorAll('.theme-card').forEach(function (el) {
    el.classList.toggle('active-theme', el.dataset.themeId === theme.id);
  });
}

function buildThemeGrid() {
  var grid = $('#theme-grid');
  if (!grid) return;
  var current = localStorage.getItem(THEME_KEY) || 'rog-black';
  grid.innerHTML = THEMES.map(function (t) {
    var p = t.preview;
    return '<div class="theme-card ' + (t.id === current ? 'active-theme' : '') + '" data-theme-id="' + t.id + '">' +
      '<div class="theme-preview" style="background:' + p.bg + '">' +
        '<div class="theme-preview-sidebar" style="background:' + p.sidebar + ';border-right:1px solid rgba(255,255,255,0.06)"></div>' +
        '<div class="theme-preview-main">' +
          '<div class="theme-preview-bar" style="background:' + p.primary + ';width:70%"></div>' +
          '<div class="theme-preview-bar" style="background:' + p.secondary + ';width:50%;margin-top:2px;opacity:0.7"></div>' +
          '<div class="theme-preview-card-row">' +
            '<div class="theme-preview-mini-card" style="background:' + p.card + ';border:1px solid rgba(255,255,255,0.08)"></div>' +
            '<div class="theme-preview-mini-card" style="background:' + p.card + ';border:1px solid rgba(255,255,255,0.08)"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="theme-label" style="background:' + p.sidebar + ';color:' + p.primary + '">' + t.emoji + ' ' + t.name + '</div>' +
    '</div>';
  }).join('');
}

function onThemeGridClick(e) {
  var card = e.target.closest('.theme-card');
  if (!card) return;
  var tid = card.dataset.themeId;
  applyTheme(tid);
  buildThemeGrid();
  var theme = THEMES.find(function (t) { return t.id === tid; });
  showToast('Tema ' + (theme ? theme.name : '') + ' diterapkan ✨', 'success');
}

/* ============================================================
   3. DOM HELPERS
   ============================================================ */
function $(sel, scope) { return (scope || document).querySelector(sel); }
function $all(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHTML(id, html) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function setWidth(id, pct) {
  var el = document.getElementById(id);
  if (el) el.style.width = pct + '%';
}

/* ============================================================
   4. FORMATTERS
   ============================================================ */
function rp(num) { return 'Rp' + Number(num || 0).toLocaleString('id-ID'); }

function formatDate(str) {
  if (!str) return '—';
  var s = String(str).substring(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return str;
  var parts = s.split('-');
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function today() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function txBadge(tipe) {
  var pair = TX_TYPE_LABEL[tipe] || ['', tipe];
  return '<span class="badge ' + pair[0] + '">' + pair[1] + '</span>';
}

function txColor(tipe) { return TX_TYPE_COLOR[tipe] || 'var(--text)'; }
function txSign(tipe) { return (tipe === 'INCOME' || tipe === 'SAVING') ? '+' : '-'; }
function getNowMonthYear() { var d = new Date(); return { month: d.getMonth() + 1, year: d.getFullYear() }; }

/* ============================================================
   5. API LAYER
   ============================================================ */
async function api(action, data, showLoader) {
  data = data || {};
  if (showLoader) showLoading();
  var token = localStorage.getItem(TOKEN_KEY) || '';
  try {
    var form = new URLSearchParams();
    form.append('payload', JSON.stringify({ action: action, token: token, data: data }));
    var res = await fetch(API_URL, { method: 'POST', body: form });
    var json = await res.json();
    if (showLoader) hideLoading();
    return json;
  } catch (err) {
    if (showLoader) hideLoading();
    return { success: false, error: err.message };
  }
}

async function sha256(str) {
  var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  var bytes = Array.from(new Uint8Array(buf));
  return bytes.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
}

/* ============================================================
   6. AUTH
   ============================================================ */
async function initApp() {
  var token = localStorage.getItem(TOKEN_KEY);
  if (!token) { showLogin(); return; }
  var res = await api('validateToken');
  if (res.success) { showApp(res.data.username); loadDashboard(); }
  else { localStorage.removeItem(TOKEN_KEY); showLogin(); }
}

function showLogin() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function showApp(username) {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  var uname = username || 'admin';
  setText('sidebar-username', uname);
  setText('sidebar-avatar', uname.charAt(0).toUpperCase());
  setText('dash-date', new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
}

async function handleLoginSubmit() {
  var username = $('#login-username').value.trim();
  var password = $('#login-password').value;
  var errEl = $('#login-error');
  var btnEl = $('#btn-login');
  var txtEl = $('#login-btn-text');

  if (!username || !password) {
    errEl.textContent = 'Username dan kata sandi wajib diisi.';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';
  btnEl.disabled = true;
  txtEl.textContent = 'Memproses...';

  var hashed = await sha256(password);
  var res = await api('login', { username: username, password_hash: hashed });

  btnEl.disabled = false;
  txtEl.textContent = 'Masuk';

  if (res.success) {
    localStorage.setItem(TOKEN_KEY, res.data.token);
    showApp(username);
    loadDashboard();
  } else {
    errEl.textContent = res.error || 'Login gagal.';
    errEl.style.display = 'block';
  }
}

function handleLogout() {
  localStorage.removeItem(TOKEN_KEY);
  showLogin();
  showToast('Berhasil keluar.', 'info');
}

/* ============================================================
   7. NAVIGATION
   ============================================================ */
var PAGE_LOADERS = {
  dashboard: loadDashboard,
  transaksi: function () { txState.offset = 0; loadTransaksi(); },
  nabung: loadNabungPage,
  target: loadTargetPage,
  'hall-of-fame': loadHallOfFame,
  pencapaian: loadPencapaian,
  statistik: loadStatistik,
  simulator: function () {},
  riwayat: function () { riwayatState.offset = 0; loadRiwayat(); },
  pengaturan: buildThemeGrid,
};

function goTo(pageId) {
  $all('.nav-item').forEach(function (el) { el.classList.toggle('active', el.dataset.page === pageId); });
  $all('.page').forEach(function (el) { el.classList.toggle('active', el.id === 'page-' + pageId); });
  closeSidebar();
  if (PAGE_LOADERS[pageId]) PAGE_LOADERS[pageId]();
}

function closeSidebar() {
  $('#sidebar').classList.remove('open');
  $('#sidebar-overlay').classList.remove('open');
}

function openSidebar() {
  $('#sidebar').classList.add('open');
  $('#sidebar-overlay').classList.add('open');
}

/* ============================================================
   8. TOAST
   ============================================================ */
function showToast(msg, type, sub, duration) {
  type = type || 'info';
  sub = sub || '';
  duration = duration || 3500;
  var icons = { success: '✅', error: '❌', info: '💬', achievement: '🏆' };
  var el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = '<div class="toast-icon">' + (icons[type] || '💬') + '</div>' +
    '<div><div class="toast-msg">' + msg + '</div>' + (sub ? '<div class="toast-sub">' + sub + '</div>' : '') + '</div>';
  document.getElementById('toast-container').appendChild(el);
  setTimeout(function () { el.remove(); }, duration);
}

function showAchievementToasts(list) {
  if (!list || !list.length) return;
  list.forEach(function (a, i) {
    setTimeout(function () {
      showToast(a.icon + ' ' + a.nama, 'achievement', a.deskripsi, 5000);
    }, i * 800);
  });
  markAchievementsAsNew(list);
  showConfetti();
  playUnlockSound();
}

/* ============================================================
   9. LOADING OVERLAY
   ============================================================ */
function showLoading() { document.getElementById('loading-overlay').style.display = 'flex'; }
function hideLoading() { document.getElementById('loading-overlay').style.display = 'none'; }

/* ============================================================
   10. MODAL
   ============================================================ */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function onModalOverlayClick(e) {
  var ov = e.currentTarget;
  if (e.target === ov) ov.classList.remove('open');
}

/* ============================================================
   11. CONFIRM MODAL
   ============================================================ */
var _confirmCallback = null;

function openConfirm(title, msg, callback) {
  setText('confirm-title', title);
  setText('confirm-msg', msg);
  _confirmCallback = callback;
  openModal('modal-confirm');
}

function onConfirmOk() {
  closeModal('modal-confirm');
  if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
}

/* ============================================================
   12. DASHBOARD
   ============================================================ */
var chart7days = null;

async function loadDashboard() {
  var res = await api('getDashboard');
  if (!res.success) { showToast(res.error || 'Gagal memuat dashboard', 'error'); return; }
  var d = res.data;

  renderDashQuote(d.quote);
  renderDashTarget(d.target);
  renderDashLevel(d.level);
  setText('dash-streak', d.streak || 0);
  renderDashSummary30(d.summary_30days);
  renderDashAchSummary(d.unlocked_achievements, d.total_achievements);
  renderDashRecentAch(d.recent_achievements);

  buildChart7Days(d.chart_7days || []);
  buildCalendar(d.saving_dates || []);
}

function renderDashQuote(quote) {
  if (!quote) return;
  setText('quote-text', quote.quote);
  setText('quote-author', '— ' + quote.author);
}

function renderDashTarget(target) {
  if (target) {
    setText('dash-target-name', target.nama_target);
    setText('dash-target-nominal', rp(target.target_nominal));
    setText('dash-saving', rp(target.total_saving));
    setText('dash-persen', target.persen.toFixed(1) + '%');
    setWidth('dash-progress-bar', Math.min(target.persen, 100));
    setText('dash-kurang', rp(target.kurang));
    setText('dash-prediksi', target.prediksi_selesai ? formatDate(target.prediksi_selesai) : 'Belum bisa diprediksi');
  } else {
    setText('dash-target-name', 'Tidak ada target aktif');
    setText('dash-target-nominal', '—');
    setText('dash-saving', '—');
    setText('dash-persen', '0%');
    setWidth('dash-progress-bar', 0);
    setText('dash-kurang', '—');
    setText('dash-prediksi', '—');
  }
}

function renderDashLevel(level) {
  if (!level) return;
  setText('dash-level-icon', level.icon);
  setText('dash-level-name', level.nama);
  setText('dash-level-num', 'LVL ' + level.level);
  setWidth('dash-xp-bar', level.progress_persen);
  setText('dash-xp-persen', level.progress_persen.toFixed(0) + '%');
  setText('dash-level-next', level.next_nama ? '→ ' + level.next_nama : 'Level Maks!');
  setText('sidebar-level-label', 'Lvl ' + level.level + ' · ' + level.nama);
  setText('dash-total-xp', (level.total_xp || 0).toLocaleString('id-ID') + ' XP');
}

function renderDashSummary30(summary) {
  var s = summary || {};
  setText('dash-income30', rp(s.total_income || 0));
  setText('dash-expense30', rp(s.total_expense || 0));
  setText('dash-saving30', rp(s.total_saving || 0));
}

function renderDashAchSummary(unlocked, total) {
  setText('dash-ach-count', (unlocked || 0) + '/' + (total || 0));
  setText('dash-ach-sub', 'dari ' + (total || 0) + ' pencapaian');
}

function renderDashRecentAch(list) {
  var achList = document.getElementById('dash-ach-list');
  if (!achList) return;
  if (list && list.length) {
    achList.innerHTML = list.map(function (a) {
      var rarityClass = (a.rarity || 'common').toLowerCase();
      return '<div class="ach-recent-item">' +
        '<span class="ach-recent-icon">' + a.icon + '</span>' +
        '<div>' +
          '<div class="ach-recent-name">' + a.nama + '</div>' +
          '<div class="ach-recent-date">' +
            formatDate(a.tanggal_unlock) + ' · ' +
            '<span class="rarity-badge ' + rarityClass + '">' + (a.rarity || 'COMMON') + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="ach-recent-xp">+' + (a.xp_reward || 0) + ' XP</span>' +
      '</div>';
    }).join('');
  } else {
    achList.innerHTML = '<span style="font-size:0.85rem;color:var(--muted)">Belum ada pencapaian. Mulai nabung untuk membukanya!</span>';
  }
}

function buildChart7Days(data) {
  var canvas = document.getElementById('chart-7days');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (chart7days) chart7days.destroy();
  chart7days = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(function (d) {
        var parts = String(d.tanggal).split('-');
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      }),
      datasets: [
        { label: 'Pemasukan', data: data.map(function (d) { return d.income; }), backgroundColor: 'rgba(0,255,157,0.6)', borderRadius: 3 },
        { label: 'Pengeluaran', data: data.map(function (d) { return d.expense; }), backgroundColor: 'rgba(255,77,77,0.6)', borderRadius: 3 },
        { label: 'Nabung', data: data.map(function (d) { return d.saving; }), backgroundColor: 'rgba(255,214,0,0.7)', borderRadius: 3 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 12 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { ticks: { font: { size: 10 }, callback: function (v) { return 'Rp' + (v / 1000).toFixed(0) + 'k'; } } }
      }
    }
  });
}

function buildCalendar(savingDates) {
  var savingSet = new Set(savingDates);
  var todayStr = today();
  var DAYS = 90;
  var html = '<div class="cal-grid">';
  for (var i = DAYS - 1; i >= 0; i--) {
    var d = new Date(); d.setDate(d.getDate() - i);
    var s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    html += '<div class="cal-dot ' + (savingSet.has(s) ? 'active' : '') + ' ' + (s === todayStr ? 'today' : '') + '" title="' + s + '"></div>';
  }
  html += '</div>';
  setHTML('cal-container', html);
}

/* ============================================================
   13. TRANSAKSI PAGE
   ============================================================ */
var txState = { offset: 0, limit: 20, total: 0, filters: {} };
var _txRows = [];

async function loadTransaksi() {
  var f = txState.filters;
  var params = { limit: txState.limit, offset: txState.offset };
  if (f.tipe) params.tipe = f.tipe;
  if (f.dari) params.tanggal_mulai = f.dari;
  if (f.sampai) params.tanggal_selesai = f.sampai;

  var res = await api('getTransactions', params);
  if (!res.success) { showToast(res.error, 'error'); return; }
  txState.total = res.data.total;
  _txRows = res.data.transactions;
  renderTxTable(_txRows);
  renderTxPagination();
}

function renderTxTable(rows) {
  var tbody = document.getElementById('tx-tbody');
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📋</div><p>Tidak ada transaksi ditemukan</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = rows.map(function (r) {
    return '<tr>' +
      '<td style="white-space:nowrap;font-family:var(--font-mono);font-size:0.78rem">' + formatDate(r.tanggal) + '</td>' +
      '<td>' + txBadge(r.tipe) + '</td>' +
      '<td>' + r.kategori + '</td>' +
      '<td style="font-family:var(--font-num);font-size:1.1rem;color:' + txColor(r.tipe) + ';white-space:nowrap">' + txSign(r.tipe) + rp(r.nominal) + '</td>' +
      '<td style="color:var(--muted);font-size:0.8rem">' + (r.keterangan || '—') + '</td>' +
      '<td style="white-space:nowrap">' +
        '<button class="btn btn-ghost btn-sm btn-icon" data-action="edit-tx" data-id="' + r.id + '" title="Edit">✏</button>' +
        '<button class="btn btn-danger btn-sm btn-icon" data-action="del-tx" data-id="' + r.id + '" title="Hapus" style="margin-left:0.25rem">🗑</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function onTxTbodyClick(e) {
  var btn = e.target.closest('[data-action]');
  if (!btn) return;
  var id = btn.dataset.id;
  var action = btn.dataset.action;
  if (action === 'edit-tx') openEditTx(id);
  if (action === 'del-tx') deleteTx(id);
}

function renderTxPagination() {
  var from = txState.offset + 1;
  var to = Math.min(txState.offset + txState.limit, txState.total);
  setText('tx-pagination-info', txState.total ? (from + '–' + to + ' dari ' + txState.total + ' transaksi') : 'Tidak ada data');
  $('#btn-tx-prev').disabled = txState.offset === 0;
  $('#btn-tx-next').disabled = txState.offset + txState.limit >= txState.total;
}

function txGoPrev() {
  if (txState.offset === 0) return;
  txState.offset = Math.max(0, txState.offset - txState.limit);
  loadTransaksi();
}

function txGoNext() {
  if (txState.offset + txState.limit >= txState.total) return;
  txState.offset += txState.limit;
  loadTransaksi();
}

function applyTxFilter() {
  txState.filters = {
    tipe: $('#filter-tipe').value,
    dari: $('#filter-dari').value,
    sampai: $('#filter-sampai').value,
  };
  txState.offset = 0;
  loadTransaksi();
}

function resetTxFilter() {
  $('#filter-tipe').value = '';
  $('#filter-dari').value = '';
  $('#filter-sampai').value = '';
  txState.filters = {};
  txState.offset = 0;
  loadTransaksi();
}

function openAddTx() {
  $('#tx-edit-id').value = '';
  setText('modal-tx-title', 'Tambah Transaksi');
  $('#tx-tipe').value = 'INCOME';
  $('#tx-tanggal').value = today();
  $('#tx-kategori').value = '';
  $('#tx-nominal').value = '';
  $('#tx-keterangan').value = '';
  openModal('modal-tx');
}

function openEditTx(id) {
  var row = _txRows.find(function (r) { return String(r.id) === String(id); });
  if (!row) { showToast('Data tidak ditemukan', 'error'); return; }
  $('#tx-edit-id').value = row.id;
  setText('modal-tx-title', 'Edit Transaksi');
  $('#tx-tipe').value = row.tipe;
  $('#tx-tanggal').value = String(row.tanggal).substring(0, 10);
  $('#tx-kategori').value = row.kategori;
  $('#tx-nominal').value = row.nominal;
  $('#tx-keterangan').value = row.keterangan || '';
  openModal('modal-tx');
}

async function saveTx() {
  var id = $('#tx-edit-id').value;
  var tipe = $('#tx-tipe').value;
  var tanggal = $('#tx-tanggal').value;
  var kategori = $('#tx-kategori').value.trim();
  var nominal = $('#tx-nominal').value;
  var ket = $('#tx-keterangan').value.trim();

  if (!tanggal || !kategori || !nominal) { showToast('Semua kolom wajib diisi', 'error'); return; }
  if (Number(nominal) <= 0) { showToast('Nominal harus lebih dari 0', 'error'); return; }

  var btn = $('#btn-save-tx');
  btn.disabled = true;

  var res;
  if (id) {
    res = await api('editTransaction', { id: id, tipe: tipe, tanggal: tanggal, kategori: kategori, nominal: Number(nominal), keterangan: ket });
  } else {
    res = await api('addTransaction', { tipe: tipe, tanggal: tanggal, kategori: kategori, nominal: Number(nominal), keterangan: ket });
  }
  btn.disabled = false;

  if (res.success) {
    closeModal('modal-tx');
    showToast(id ? 'Transaksi berhasil diperbarui' : 'Transaksi berhasil ditambahkan', 'success');
    if (res.data && res.data.new_achievements) showAchievementToasts(res.data.new_achievements);
    txState.offset = 0;
    loadTransaksi();
  } else {
    showToast(res.error || 'Gagal menyimpan transaksi', 'error');
  }
}

function deleteTx(id) {
  openConfirm('Hapus Transaksi', 'Yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.', async function () {
    var res = await api('deleteTransaction', { id: id });
    if (res.success) { showToast('Transaksi berhasil dihapus', 'success'); loadTransaksi(); }
    else showToast(res.error || 'Gagal menghapus', 'error');
  });
}

/* ============================================================
   14. NABUNG & TARIK
   ============================================================ */
async function loadNabungPage() {
  $('#nabung-tanggal').value = today();
  $('#tarik-tanggal').value = today();

  var res = await api('getTarget');
  var el = document.getElementById('nabung-target-info');
  if (res.success && res.data) {
    var t = res.data;
    el.innerHTML =
      '<div class="flex-between mb-1">' +
        '<span style="font-family:var(--font-title);font-size:1rem;font-weight:700;color:var(--primary)">' + t.nama_target + '</span>' +
        '<span style="font-family:var(--font-num);font-size:1.5rem;color:var(--text)">' + t.persen.toFixed(1) + '%</span>' +
      '</div>' +
      '<div class="progress-wrap mb-1"><div class="progress-bar yellow" style="width:' + Math.min(t.persen, 100) + '%"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--muted)">' +
        '<span>Terkumpul: <span style="color:var(--primary)">' + rp(t.total_saving) + '</span></span>' +
        '<span>Target: <span style="color:var(--text)">' + rp(t.target_nominal) + '</span></span>' +
      '</div>' +
      '<div style="font-size:0.78rem;color:var(--muted);margin-top:0.25rem">Kurang: <span style="color:var(--danger)">' + rp(t.kurang) + '</span></div>';
  } else {
    el.innerHTML = '<span style="color:var(--muted)">Tidak ada target aktif. Buat target terlebih dahulu.</span>';
  }
}

async function doSaving(isSaving) {
  var prefix = isSaving ? 'nabung' : 'tarik';
  var nominal = $('#' + prefix + '-nominal').value;
  var tanggal = $('#' + prefix + '-tanggal').value;
  var kategori = $('#' + prefix + '-kategori').value.trim();
  var ket = $('#' + prefix + '-ket').value.trim();
  var btn = $('#btn-' + prefix);

  if (!nominal || !tanggal || !kategori) { showToast('Nominal, tanggal, dan kategori wajib diisi', 'error'); return; }
  if (Number(nominal) <= 0) { showToast('Nominal harus lebih dari 0', 'error'); return; }

  btn.disabled = true;

  var targetRes = await api('getTarget');
  if (!targetRes.success || !targetRes.data) {
    showToast('Tidak ada target aktif. Buat target terlebih dahulu.', 'error');
    btn.disabled = false;
    return;
  }
  var targetId = targetRes.data.id;

  var res = await api('addTransaction', {
    tipe: isSaving ? 'SAVING' : 'WITHDRAWAL',
    tanggal: tanggal, kategori: kategori,
    nominal: Number(nominal), keterangan: ket, target_id: String(targetId),
  }, true);
  btn.disabled = false;

  if (res.success) {
    showToast(isSaving ? 'Tabungan berhasil disimpan! 💰' : 'Penarikan berhasil dicatat.', 'success');
    if (res.data && res.data.new_achievements) showAchievementToasts(res.data.new_achievements);
    $('#' + prefix + '-nominal').value = '';
    $('#' + prefix + '-kategori').value = '';
    $('#' + prefix + '-ket').value = '';
    loadNabungPage();
  } else {
    showToast(res.error || 'Gagal menyimpan', 'error');
  }
}

/* ============================================================
   15. TARGET PAGE
   ============================================================ */
async function loadTargetPage() {
  var res = await api('getTarget');
  var section = document.getElementById('target-active-section');
  var noTarget = document.getElementById('target-no-target');

  if (!res.success || !res.data) {
    section.innerHTML = '';
    noTarget.style.display = 'block';
    return;
  }
  noTarget.style.display = 'none';
  var t = res.data;

  section.innerHTML =
    '<div class="target-card mb-3">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">' +
        '<div><div class="card-title">Target Aktif</div><div class="target-name">' + t.nama_target + '</div></div>' +
        '<button class="btn btn-ghost btn-sm" id="btn-edit-target">✏ Edit</button>' +
      '</div>' +
      '<div class="target-nominal">' + rp(t.target_nominal) + '</div>' +
      '<div class="target-progress-label">' +
        '<span style="font-size:0.85rem;color:var(--muted)">Terkumpul: <strong style="color:var(--text)">' + rp(t.total_saving) + '</strong></span>' +
        '<span class="target-persen">' + t.persen.toFixed(1) + '%</span>' +
      '</div>' +
      '<div class="progress-wrap mb-2"><div class="progress-bar yellow" style="width:' + Math.min(t.persen, 100) + '%"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-top:0.75rem">' +
        '<div class="stat-card c-red" style="padding:0.875rem"><div class="stat-label">Masih Kurang</div><div class="stat-value red" style="font-size:1.5rem">' + rp(t.kurang) + '</div></div>' +
        '<div class="stat-card c-cyan" style="padding:0.875rem"><div class="stat-label">Mulai Nabung</div><div class="stat-value cyan" style="font-size:1.5rem">' + formatDate(t.tanggal_mulai) + '</div></div>' +
      '</div>' +
      (t.persen >= 100
        ? '<div style="margin-top:1rem;padding:1rem;background:rgba(0,255,157,0.06);border:1px solid rgba(0,255,157,0.2);border-radius:8px;text-align:center">' +
            '<div style="font-size:1.5rem;margin-bottom:0.5rem">🎉</div>' +
            '<div style="font-family:var(--font-title);color:var(--success);font-weight:700">TARGET TERCAPAI!</div>' +
            '<p style="font-size:0.85rem;color:var(--muted);margin-top:0.4rem">Selamat! Tandai sebagai selesai.</p>' +
            '<button class="btn btn-success mt-2" id="btn-complete-target">🏆 Tandai Selesai</button>' +
          '</div>'
        : '') +
    '</div>' +
    '<div class="gap-row">' +
      (t.persen < 100 ? '<button class="btn btn-secondary" id="btn-nabung-now">💰 Nabung Sekarang</button>' : '') +
    '</div>';

  $('#btn-edit-target').addEventListener('click', function () {
    setText('modal-target-title', 'Edit Target');
    $('#target-nama').value = t.nama_target;
    $('#target-nominal-input').value = t.target_nominal;
    $('#btn-save-target').dataset.mode = 'edit';
    openModal('modal-target');
  });

  var completeBtn = document.getElementById('btn-complete-target');
  if (completeBtn) {
    completeBtn.addEventListener('click', function () {
      openConfirm('Tandai Target Selesai',
        'Tandai "' + t.nama_target + '" sebagai SELESAI dan simpan ke Papan Prestasi?',
        async function () {
          var r = await api('completeTarget', {}, true);
          if (r.success) {
            showToast('Selamat! 🎉 Target berhasil diselesaikan!', 'success');
            if (r.data && r.data.new_achievements) showAchievementToasts(r.data.new_achievements);
            loadTargetPage();
          } else {
            showToast(r.error || 'Gagal', 'error');
          }
        });
    });
  }

  var nabungNowBtn = document.getElementById('btn-nabung-now');
  if (nabungNowBtn) nabungNowBtn.addEventListener('click', function () { goTo('nabung'); });
}

function openCreateTargetModal() {
  setText('modal-target-title', 'Buat Target Baru');
  $('#target-nama').value = '';
  $('#target-nominal-input').value = '';
  $('#btn-save-target').dataset.mode = 'create';
  openModal('modal-target');
}

function onTargetPageClick(e) {
  if (e.target && e.target.id === 'btn-buat-target-empty') openCreateTargetModal();
}

async function saveTarget() {
  var nama = $('#target-nama').value.trim();
  var nominal = $('#target-nominal-input').value;
  var mode = $('#btn-save-target').dataset.mode || 'create';

  if (!nama || !nominal) { showToast('Nama target dan nominal wajib diisi', 'error'); return; }
  if (Number(nominal) <= 0) { showToast('Nominal harus lebih dari 0', 'error'); return; }

  var btn = $('#btn-save-target');
  btn.disabled = true;

  var res = mode === 'edit'
    ? await api('updateTarget', { nama_target: nama, target_nominal: Number(nominal) })
    : await api('createTarget', { nama_target: nama, target_nominal: Number(nominal) });

  btn.disabled = false;

  if (res.success) {
    closeModal('modal-target');
    showToast(mode === 'edit' ? 'Target berhasil diperbarui' : 'Target baru berhasil dibuat!', 'success');
    if (res.data && res.data.new_achievements) showAchievementToasts(res.data.new_achievements);
    loadTargetPage();
  } else {
    showToast(res.error || 'Gagal menyimpan target', 'error');
  }
}

/* ============================================================
   16. HALL OF FAME
   ============================================================ */
async function loadHallOfFame() {
  var res = await api('getHallOfFame');
  var container = document.getElementById('hof-list');
  if (!res.success) { showToast(res.error, 'error'); return; }
  var list = res.data.hall_of_fame || [];
  if (!list.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🏆</div><p>Belum ada target yang diselesaikan. Ayo semangat!</p></div>';
    return;
  }
  container.innerHTML = list.map(function (hof, i) {
    return '<div class="hof-card mb-2">' +
      '<div class="hof-rank ' + (i === 0 ? 'top1' : '') + '">' + (i + 1) + '</div>' +
      '<div class="hof-info">' +
        '<div class="hof-name">' + hof.nama_target + '</div>' +
        '<div class="hof-meta">' + formatDate(hof.tanggal_mulai) + ' → ' + formatDate(hof.tanggal_selesai) +
          ' &nbsp;·&nbsp; ' + hof.total_hari + ' hari &nbsp;·&nbsp; ' + hof.total_saving_tx + 'x nabung</div>' +
      '</div>' +
      '<div class="hof-nominal">' + rp(hof.target_nominal) + '</div>' +
    '</div>';
  }).join('');
}

/* ============================================================
   17. PENCAPAIAN (ACHIEVEMENT MODULE)
   Field backend: achievement_key, nama, clue, deskripsi, icon,
   category, rarity, xp_reward, display_order, is_secret,
   is_unlocked, tanggal_unlock, progress, target, progress_percent.
   Summary backend: opened_count, locked_count, total_xp,
   common_count..artifact_count.
   ============================================================ */
var _achData = [];
var _achStatusFilter = 'all';
var _achCategoryFilter = 'all';
var _achSummary = null;
var _newlyUnlockedKeys = [];

function getSeenAchievementKeys() {
  try {
    var raw = localStorage.getItem(SEEN_ACH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function markAchievementKeysSeen(keys) {
  try {
    var seen = new Set(getSeenAchievementKeys());
    keys.forEach(function (k) { seen.add(k); });
    localStorage.setItem(SEEN_ACH_KEY, JSON.stringify(Array.from(seen)));
  } catch (e) { /* ignore storage errors */ }
}

function markAchievementsAsNew(unlockedList) {
  _newlyUnlockedKeys = (unlockedList || []).map(function (a) { return a.achievement_key; });
}

async function loadPencapaian() {
  var res = await api('getAchievements');
  if (!res.success) { showToast(res.error, 'error'); return; }

  _achData = res.data.achievements || [];
  _achSummary = res.data.summary || {};
  var total = res.data.total || 0;
  var unlocked = _achSummary.opened_count || 0;

  setText('ach-count-display', unlocked + '/' + total);
  setText('ach-subtitle', unlocked + ' dari ' + total + ' pencapaian terbuka');
  setWidth('ach-main-progress', total > 0 ? ((unlocked / total) * 100) : 0);

  renderAchStatsRow(_achSummary, total, unlocked);
  buildAchFilterBar();
  renderAchGrid();

  // Achievement baru yang belum "dilihat" akan tetap mendapat badge NEW
  // saat halaman dibuka kembali (mis. setelah reload), berdasarkan
  // perbandingan dengan daftar key yang sudah pernah dilihat user.
  var seen = new Set(getSeenAchievementKeys());
  var freshlyUnlocked = _achData.filter(function (a) { return a.is_unlocked && !seen.has(a.achievement_key); });
  if (freshlyUnlocked.length && !_newlyUnlockedKeys.length) {
    _newlyUnlockedKeys = freshlyUnlocked.map(function (a) { return a.achievement_key; });
  }
}

function renderAchStatsRow(summary, total, unlocked) {
  var statsRow = document.getElementById('ach-stats-row');
  if (!statsRow) return;
  statsRow.innerHTML =
    makeAchStatChip(unlocked, 'Terbuka', 'var(--primary)') +
    makeAchStatChip(total - unlocked, 'Terkunci', 'var(--muted)') +
    makeAchStatChip((summary.total_xp || 0).toLocaleString('id-ID'), 'Total XP', 'var(--secondary)') +
    makeAchStatChip(summary.common_count || 0, 'Common', 'var(--rarity-common-color)') +
    makeAchStatChip(summary.uncommon_count || 0, 'Uncommon', 'var(--rarity-uncommon-color)') +
    makeAchStatChip(summary.rare_count || 0, 'Rare', 'var(--rarity-rare-color)') +
    makeAchStatChip(summary.epic_count || 0, 'Epic', 'var(--rarity-epic-color)') +
    makeAchStatChip(summary.mythic_count || 0, 'Mythic', 'var(--rarity-mythic-color)') +
    makeAchStatChip(summary.artifact_count || 0, 'Artifact', 'var(--rarity-artifact-color)');
}

function makeAchStatChip(val, lbl, color) {
  return '<div class="ach-stat-chip">' +
    '<div class="ach-stat-chip-val" style="color:' + color + '">' + val + '</div>' +
    '<div class="ach-stat-chip-lbl">' + lbl + '</div>' +
  '</div>';
}

/* Membangun icon filter secara fleksibel: emoji sekarang, PNG nanti tanpa ubah logika */
function buildFilterIconHTML(icon) {
  if (!icon) return '';
  if (/^https?:\/\//.test(icon) || /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(icon)) {
    return '<span class="filter-icon"><img src="' + icon + '" alt="" /></span>';
  }
  return '<span class="filter-icon">' + icon + '</span>';
}

function buildAchFilterBar() {
  var filterBar = document.getElementById('ach-filter-bar');
  if (!filterBar) return;

  var statusButtons = ACH_STATUS_FILTERS.map(function (f) {
    var active = f.key === _achStatusFilter ? ' active' : '';
    return '<button class="filter-btn' + active + '" data-filter-type="status" data-filter="' + f.key + '">' +
      buildFilterIconHTML(f.icon) +
      '<span class="filter-label">' + f.label + '</span>' +
    '</button>';
  }).join('');

  var categoryAll = '<button class="filter-btn' + (_achCategoryFilter === 'all' ? ' active' : '') + '" data-filter-type="category" data-filter="all">' +
    buildFilterIconHTML('🗂️') + '<span class="filter-label">Semua Kategori</span></button>';

  var categoryButtons = ACH_CATEGORIES.map(function (cat) {
    var meta = ACH_CATEGORY_LABELS[cat] || { label: cat, icon: '🏷️' };
    var active = _achCategoryFilter === cat ? ' active' : '';
    return '<button class="filter-btn' + active + '" data-filter-type="category" data-filter="' + cat + '">' +
      buildFilterIconHTML(meta.icon) +
      '<span class="filter-label">' + meta.label + '</span>' +
    '</button>';
  }).join('');

  filterBar.innerHTML = statusButtons + categoryAll + categoryButtons;
}

function onAchFilterBarClick(e) {
  var btn = e.target.closest('.filter-btn');
  if (!btn) return;
  var type = btn.dataset.filterType;
  var value = btn.dataset.filter;

  if (type === 'status') _achStatusFilter = value;
  else if (type === 'category') _achCategoryFilter = value;

  buildAchFilterBar();
  renderAchGrid();
}

function filterAchievements() {
  var list = _achData.slice();

  if (_achStatusFilter === 'unlocked') list = list.filter(function (a) { return a.is_unlocked; });
  else if (_achStatusFilter === 'locked') list = list.filter(function (a) { return !a.is_unlocked; });

  if (_achCategoryFilter !== 'all') list = list.filter(function (a) { return a.category === _achCategoryFilter; });

  list.sort(function (a, b) {
    if (a.is_unlocked && !b.is_unlocked) return -1;
    if (!a.is_unlocked && b.is_unlocked) return 1;
    var byDisplay = (a.display_order || 0) - (b.display_order || 0);
    if (byDisplay !== 0) return byDisplay;
    return (RARITY_RANK[b.rarity] || 0) - (RARITY_RANK[a.rarity] || 0);
  });

  return list;
}

function renderAchGrid() {
  var list = filterAchievements();
  var grid = document.getElementById('ach-grid');
  if (!grid) return;

  if (!list.length) {
    renderAchEmptyState(grid);
    return;
  }

  grid.innerHTML = list.map(buildAchCard).join('');

  // Tandai sebagai "dilihat" begitu grid dirender, lalu hapus highlight NEW
  // pada render berikutnya (badge tetap tampil untuk render ini).
  if (_newlyUnlockedKeys.length) {
    var keysToMark = _newlyUnlockedKeys.slice();
    markAchievementKeysSeen(keysToMark);
  }
}

function renderAchEmptyState(grid) {
  grid.innerHTML = '<div class="empty-state"><span class="empty-icon">🔍</span><p>Tidak ada pencapaian dalam kategori ini.</p></div>';
}

function buildAchCard(a) {
  var isLocked = !a.is_unlocked;
  var rarityClass = (a.rarity || 'COMMON').toLowerCase();
  var isNew = _newlyUnlockedKeys.indexOf(a.achievement_key) !== -1;

  var cardClasses = 'ach-card ' + (isLocked ? 'locked' : 'unlocked') + ' rarity-' + rarityClass + (isNew ? ' new-unlock' : '');

  var iconHTML = '<div class="ach-icon-wrap"><span class="ach-icon">' + (isLocked ? '🔒' : a.icon) + '</span></div>';

  var nameHTML = '<div class="ach-name">' + (isLocked ? '???' : a.nama) + (isNew ? '<span class="ach-new-badge">NEW</span>' : '') + '</div>';

  var descHTML = isLocked
    ? '<div class="ach-clue">' + (a.clue || 'Belum ada petunjuk untuk pencapaian ini.') + '</div>'
    : '<div class="ach-desc">' + a.deskripsi + '</div>';

  var rarityBadgeHTML = isLocked
    ? ''
    : '<span class="rarity-badge ' + rarityClass + '">' + (a.rarity || 'COMMON') + '</span>';

  var dateHTML = (!isLocked && a.tanggal_unlock) ? '<div class="ach-date">🗓 ' + formatDate(a.tanggal_unlock) + '</div>' : '';

  var xpHTML = !isLocked ? '<div class="ach-xp">+' + (a.xp_reward || 0) + ' XP</div>' : '';
  var lockHTML = isLocked ? '<div class="ach-lock-icon">🔒</div>' : '';

  var progressHTML = buildAchProgressHTML(a);

  return '<div class="' + cardClasses + '">' +
    xpHTML +
    lockHTML +
    iconHTML +
    nameHTML +
    descHTML +
    rarityBadgeHTML +
    dateHTML +
    progressHTML +
  '</div>';
}

function buildAchProgressHTML(a) {
  var hasProgress = a.progress !== null && a.progress !== undefined &&
    a.target !== null && a.target !== undefined && Number(a.target) > 0;

  if (!hasProgress) return '';

  var pct = a.progress_percent !== null && a.progress_percent !== undefined
    ? a.progress_percent
    : Math.min(100, (Number(a.progress) / Number(a.target)) * 100);

  if (a.is_unlocked) {
    return '<div class="ach-progress-wrap"><div class="ach-progress-fill" style="width:100%"></div></div>';
  }

  return '<div class="ach-progress-wrap"><div class="ach-progress-fill" style="width:' + pct.toFixed(1) + '%"></div></div>' +
    '<div class="ach-progress-label">' +
      '<span>' + Number(a.progress).toLocaleString('id-ID') + ' / ' + Number(a.target).toLocaleString('id-ID') + '</span>' +
      '<span>' + pct.toFixed(0) + '%</span>' +
    '</div>';
}

/* ── Confetti & Sound (achievement unlock feedback) ─────────── */
var _confettiPlaying = false;

function showConfetti() {
  if (_confettiPlaying) return;
  _confettiPlaying = true;

  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9998';
  container.style.overflow = 'hidden';

  var colors = ['#FFD600', '#00E5FF', '#00FF9D', '#FF4D4D', '#c084fc'];
  var pieceCount = 60;

  for (var i = 0; i < pieceCount; i++) {
    var piece = document.createElement('div');
    var color = colors[i % colors.length];
    var left = Math.random() * 100;
    var delay = Math.random() * 0.4;
    var duration = 2 + Math.random() * 1.2;
    var size = 6 + Math.random() * 6;

    piece.style.position = 'absolute';
    piece.style.top = '-20px';
    piece.style.left = left + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = (size * 0.4) + 'px';
    piece.style.background = color;
    piece.style.opacity = '0.9';
    piece.style.borderRadius = '2px';
    piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    piece.style.animation = 'confettiFall ' + duration + 's ease-in ' + delay + 's forwards';
    container.appendChild(piece);
  }

  if (!document.getElementById('confetti-keyframes')) {
    var style = document.createElement('style');
    style.id = 'confetti-keyframes';
    style.textContent = '@keyframes confettiFall {' +
      '0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }' +
      '100% { transform: translateY(100vh) rotate(540deg); opacity: 0; }' +
    '}';
    document.head.appendChild(style);
  }

  document.body.appendChild(container);
  setTimeout(function () {
    container.remove();
    _confettiPlaying = false;
  }, 3600);
}

var _unlockAudioCtx = null;

function playUnlockSound() {
  try {
    if (!_unlockAudioCtx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      _unlockAudioCtx = new AudioCtx();
    }
    var ctx = _unlockAudioCtx;
    if (ctx.state === 'suspended') ctx.resume().catch(function () {});

    var now = ctx.currentTime;
    var notes = [880, 1108.73, 1318.51];
    notes.forEach(function (freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      var startTime = now + i * 0.09;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.34);
    });
  } catch (e) {
    /* Browser memblokir autoplay audio atau Web Audio API tidak tersedia — abaikan dengan aman. */
  }
}

/* ============================================================
   18. STATISTIK BULANAN
   ============================================================ */
var chartExpensePie = null;
var chartStatDaily = null;
var chartTrend = null;
var _statData = null;
var _statKatTipe = 'EXPENSE';
var _trendMonths = 6;

function initStatFilters() {
  var now = getNowMonthYear();
  $('#stat-filter-bulan').value = now.month;
  $('#stat-filter-tahun').value = now.year;
}

async function loadStatistik() {
  initStatFilters();
  await fetchAndRenderStat();
  await fetchAndRenderTrend(_trendMonths);
}

async function fetchAndRenderStat() {
  var bulan = Number($('#stat-filter-bulan').value);
  var tahun = Number($('#stat-filter-tahun').value);
  if (!bulan || !tahun || tahun < 2000 || tahun > 2100) { showToast('Filter bulan/tahun tidak valid', 'error'); return; }

  var res = await api('getMonthlyStat', { bulan: bulan, tahun: tahun }, true);
  if (!res.success) { showToast(res.error || 'Gagal memuat statistik', 'error'); return; }

  _statData = res.data;
  renderStatSummary(res.data);
  renderPieChart(res.data);
  renderStatDailyChart(res.data);
  renderKatList(_statKatTipe);
}

function renderStatSummary(data) {
  var s = data.summary;
  setText('stat-income', rp(s.total_income));
  setText('stat-expense', rp(s.total_expense));
  setText('stat-saving', rp(s.total_saving));
  setText('stat-jumlah-tx', s.jumlah_tx);

  var saldoEl = document.getElementById('stat-saldo');
  saldoEl.textContent = rp(s.saldo_bersih);
  saldoEl.style.color = s.saldo_bersih >= 0 ? 'var(--secondary)' : 'var(--danger)';

  var netEl = document.getElementById('stat-net-saving');
  netEl.textContent = rp(s.net_saving);
  netEl.style.color = s.net_saving >= 0 ? 'var(--primary)' : 'var(--danger)';
}

function renderPieChart(data) {
  var pieWrap = document.getElementById('stat-pie-wrap');
  var pieEmpty = document.getElementById('stat-pie-empty');
  var pieLegend = document.getElementById('stat-pie-legend');
  var ctx = document.getElementById('chart-expense-pie').getContext('2d');
  var expData = (data.by_category && data.by_category.EXPENSE) ? data.by_category.EXPENSE : [];

  if (chartExpensePie) { chartExpensePie.destroy(); chartExpensePie = null; }
  if (!expData.length) { pieWrap.style.display = 'none'; pieEmpty.style.display = 'block'; pieLegend.innerHTML = ''; return; }

  pieWrap.style.display = 'flex';
  pieEmpty.style.display = 'none';
  var PALETTE = ['#FFD600', '#00E5FF', '#00FF9D', '#FF4D4D', '#a855f7', '#f97316', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
  var labels = expData.map(function (e) { return e.kategori; });
  var values = expData.map(function (e) { return e.total; });
  var colors = expData.map(function (_, i) { return PALETTE[i % PALETTE.length]; });

  chartExpensePie = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: labels, datasets: [{ data: values, backgroundColor: colors, borderColor: '#111', borderWidth: 2, hoverOffset: 6 }] },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function (c) { return ' ' + c.label + ': ' + rp(c.raw) + ' (' + expData[c.dataIndex].persentase + '%)'; } } }
      }
    }
  });

  pieLegend.innerHTML = expData.map(function (e, i) {
    return '<div class="kat-bar-row">' +
      '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + colors[i] + ';flex-shrink:0"></span>' +
      '<span class="kat-bar-label">' + e.kategori + '</span>' +
      '<div class="kat-bar-wrap"><div class="kat-bar-fill" style="width:' + e.persentase + '%;background:' + colors[i] + '"></div></div>' +
      '<span class="kat-bar-pct">' + e.persentase + '%</span>' +
    '</div>';
  }).join('');
}

function renderStatDailyChart(data) {
  var ctx = document.getElementById('chart-stat-daily').getContext('2d');
  if (chartStatDaily) { chartStatDaily.destroy(); chartStatDaily = null; }
  var daily = data.daily_data || [];

  chartStatDaily = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: daily.map(function (d) { return String(d.tanggal).split('-')[2]; }),
      datasets: [
        { label: 'Pemasukan', data: daily.map(function (d) { return d.income; }), backgroundColor: 'rgba(0,255,157,0.55)', borderRadius: 2 },
        { label: 'Pengeluaran', data: daily.map(function (d) { return d.expense; }), backgroundColor: 'rgba(255,77,77,0.55)', borderRadius: 2 },
        { label: 'Nabung', data: daily.map(function (d) { return d.saving; }), backgroundColor: 'rgba(255,214,0,0.65)', borderRadius: 2 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font: { size: 10 }, boxWidth: 10 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 } } },
        y: { ticks: { font: { size: 9 }, callback: function (v) { return 'Rp' + (v / 1000).toFixed(0) + 'k'; } } }
      }
    }
  });
}

function renderKatList(tipe) {
  _statKatTipe = tipe;
  var el = document.getElementById('stat-kat-list');
  if (!_statData) { el.innerHTML = '<div class="empty-state empty-state--sm"><p>Tidak ada data</p></div>'; return; }
  var cats = (_statData.by_category && _statData.by_category[tipe]) ? _statData.by_category[tipe] : [];
  if (!cats.length) { el.innerHTML = '<div class="empty-state empty-state--sm"><p>Tidak ada data pada periode ini.</p></div>'; return; }

  var COLORS = { INCOME: 'var(--success)', EXPENSE: 'var(--danger)', SAVING: 'var(--primary)', WITHDRAWAL: 'var(--secondary)' };
  var color = COLORS[tipe] || 'var(--primary)';

  el.innerHTML = cats.map(function (c) {
    return '<div class="kat-bar-row">' +
      '<span class="kat-bar-label">' + c.kategori + '</span>' +
      '<div class="kat-bar-wrap"><div class="kat-bar-fill" style="width:' + c.persentase + '%;background:' + color + '"></div></div>' +
      '<span style="font-family:var(--font-num);font-size:1rem;min-width:90px;text-align:right">' + rp(c.total) + '</span>' +
      '<span class="kat-bar-pct">' + c.persentase + '%</span>' +
      '<span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--muted);min-width:30px">' + c.jumlah_tx + 'x</span>' +
    '</div>';
  }).join('');
}

async function fetchAndRenderTrend(months) {
  _trendMonths = months;
  var res = await api('getMonthlyTrend', { months: months });
  if (!res.success) { showToast(res.error || 'Gagal memuat tren', 'error'); return; }
  renderTrendChart(res.data.trend || []);
}

function renderTrendChart(trend) {
  var ctx = document.getElementById('chart-trend').getContext('2d');
  if (chartTrend) { chartTrend.destroy(); chartTrend = null; }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

  chartTrend = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: trend.map(function (t) { return MONTHS[t.bulan - 1] + ' ' + t.tahun; }),
      datasets: [
        { label: 'Pemasukan', data: trend.map(function (t) { return t.income; }), backgroundColor: 'rgba(0,255,157,0.55)', borderRadius: 4 },
        { label: 'Pengeluaran', data: trend.map(function (t) { return t.expense; }), backgroundColor: 'rgba(255,77,77,0.55)', borderRadius: 4 },
        { label: 'Nabung', data: trend.map(function (t) { return t.saving; }), backgroundColor: 'rgba(255,214,0,0.65)', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font: { size: 11 }, boxWidth: 12 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { ticks: { font: { size: 10 }, callback: function (v) { return 'Rp' + (v / 1000).toFixed(0) + 'k'; } } }
      }
    }
  });
}

function onStatKatTabsClick(e) {
  var btn = e.target.closest('.tab-btn');
  if (!btn) return;
  $all('#stat-kat-tabs .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  renderKatList(btn.dataset.tipe);
}

async function onTrendTabGroupClick(e) {
  var btn = e.target.closest('.tab-btn');
  if (!btn) return;
  $all('#trend-tab-group .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  await fetchAndRenderTrend(Number(btn.dataset.months));
}

/* ============================================================
   19. SIMULATOR
   ============================================================ */
async function handleSimulasiHitung() {
  var errEl = $('#sim-error');
  errEl.style.display = 'none';

  var targetVal = $('#sim-target').value.trim();
  var currentVal = $('#sim-current').value.trim();
  var amountVal = $('#sim-amount').value.trim();
  var freq = $('#sim-freq').value;

  if (!targetVal || !amountVal) {
    errEl.textContent = 'Target nominal dan nominal menabung wajib diisi.';
    errEl.style.display = 'block';
    return;
  }

  var targetNum = Number(targetVal);
  var currentNum = currentVal === '' ? 0 : Number(currentVal);
  var amountNum = Number(amountVal);

  if (isNaN(targetNum) || targetNum <= 0) { errEl.textContent = 'Target nominal harus berupa angka > 0.'; errEl.style.display = 'block'; return; }
  if (isNaN(currentNum) || currentNum < 0) { errEl.textContent = 'Tabungan saat ini harus ≥ 0.'; errEl.style.display = 'block'; return; }
  if (isNaN(amountNum) || amountNum <= 0) { errEl.textContent = 'Nominal menabung harus berupa angka > 0.'; errEl.style.display = 'block'; return; }
  if (currentNum >= targetNum) { errEl.textContent = 'Tabungan saat ini ≥ target. Target sudah tercapai!'; errEl.style.display = 'block'; return; }

  var btn = $('#btn-sim-hitung');
  btn.disabled = true;

  var res = await api('simulateTarget', { target_nominal: targetNum, current_saving: currentNum, amount: amountNum, frequency: freq }, true);
  btn.disabled = false;

  if (!res.success) { errEl.textContent = res.error || 'Gagal menghitung.'; errEl.style.display = 'block'; return; }
  renderSimResult(res.data);
  if (res.data.new_achievements) showAchievementToasts(res.data.new_achievements);
}

function renderSimResult(data) {
  var FREQ_LABEL = { daily: 'hari', weekly: 'minggu', monthly: 'bulan' };
  var freqLabel = FREQ_LABEL[data.input.frequency] || data.input.frequency;

  setHTML('sim-result-wrap',
    '<div class="sim-result-card mb-3">' +
      '<div class="card-title" style="margin-bottom:1rem">📊 Hasil Estimasi</div>' +
      '<div class="grid-2 mb-2">' +
        '<div><div class="stat-label">Sisa yang Harus Ditabung</div>' +
          '<div style="font-family:var(--font-num);font-size:1.8rem;color:var(--danger)">' + rp(data.sisa_nominal) + '</div></div>' +
        '<div><div class="stat-label">Estimasi Selesai</div>' +
          '<div style="font-family:var(--font-num);font-size:1.8rem;color:var(--success)">' + formatDate(data.estimasi_selesai) + '</div></div>' +
      '</div>' +
      '<div class="grid-3">' +
        '<div class="stat-card c-yellow" style="padding:0.875rem"><div class="stat-label">Total Hari</div><div class="stat-value yellow" style="font-size:1.6rem">' + data.jumlah_hari + '</div></div>' +
        '<div class="stat-card c-cyan" style="padding:0.875rem"><div class="stat-label">Total Minggu</div><div class="stat-value cyan" style="font-size:1.6rem">' + data.jumlah_minggu + '</div></div>' +
        '<div class="stat-card c-green" style="padding:0.875rem"><div class="stat-label">Total Bulan</div><div class="stat-value green" style="font-size:1.6rem">' + data.jumlah_bulan + '</div></div>' +
      '</div>' +
      '<div style="margin-top:0.75rem;font-family:var(--font-mono);font-size:0.72rem;color:var(--muted)">Nabung ' + rp(data.input.amount) + ' per ' + freqLabel + ' · ' + data.jumlah_periode + ' kali nabung</div>' +
    '</div>' +
    '<div class="card">' +
      '<div class="card-title">🎯 Milestone Progress</div>' +
      (data.detail_per_milestone || []).map(function (m) {
        return '<div class="sim-milestone-row">' +
          '<span class="sim-milestone-pct">' + m.persen + '%</span>' +
          '<div class="sim-milestone-info"><span style="color:var(--text)">' + rp(m.nominal_milestone) + '</span> · ' + m.jumlah_hari + ' hari · ' + m.jumlah_periode + 'x nabung</div>' +
          '<span class="sim-milestone-date">' + formatDate(m.estimasi_tanggal) + '</span>' +
        '</div>';
      }).join('') +
    '</div>');
}

/* ============================================================
   20. RIWAYAT
   ============================================================ */
var riwayatState = { offset: 0, limit: 30, total: 0, filters: {} };

async function loadRiwayat() {
  var f = riwayatState.filters;
  var params = { limit: riwayatState.limit, offset: riwayatState.offset };
  if (f.tipe) params.tipe = f.tipe;
  if (f.dari) params.tanggal_mulai = f.dari;
  if (f.sampai) params.tanggal_selesai = f.sampai;

  var res = await api('getTransactions', params);
  if (!res.success) { showToast(res.error, 'error'); return; }

  riwayatState.total = res.data.total;
  var tbody = document.getElementById('riwayat-tbody');

  if (!res.data.transactions.length) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📋</div><p>Tidak ada transaksi ditemukan</p></div></td></tr>';
  } else {
    tbody.innerHTML = res.data.transactions.map(function (r) {
      return '<tr>' +
        '<td style="white-space:nowrap;font-family:var(--font-mono);font-size:0.78rem">' + formatDate(r.tanggal) + '</td>' +
        '<td>' + txBadge(r.tipe) + '</td>' +
        '<td>' + r.kategori + '</td>' +
        '<td style="font-family:var(--font-num);font-size:1.1rem;color:' + txColor(r.tipe) + ';white-space:nowrap">' + txSign(r.tipe) + rp(r.nominal) + '</td>' +
        '<td style="color:var(--muted);font-size:0.8rem">' + (r.keterangan || '—') + '</td>' +
      '</tr>';
    }).join('');
  }

  var from = riwayatState.offset + 1;
  var to = Math.min(riwayatState.offset + riwayatState.limit, riwayatState.total);
  setText('riwayat-pagination-info', riwayatState.total ? (from + '–' + to + ' dari ' + riwayatState.total) : 'Tidak ada data');
  $('#btn-riwayat-prev').disabled = riwayatState.offset === 0;
  $('#btn-riwayat-next').disabled = riwayatState.offset + riwayatState.limit >= riwayatState.total;
}

function riwayatGoPrev() {
  riwayatState.offset = Math.max(0, riwayatState.offset - riwayatState.limit);
  loadRiwayat();
}

function riwayatGoNext() {
  if (riwayatState.offset + riwayatState.limit < riwayatState.total) {
    riwayatState.offset += riwayatState.limit;
    loadRiwayat();
  }
}

function applyRiwayatFilter() {
  riwayatState.filters = {
    tipe: $('#riwayat-filter-tipe').value,
    dari: $('#riwayat-filter-dari').value,
    sampai: $('#riwayat-filter-sampai').value,
  };
  riwayatState.offset = 0;
  loadRiwayat();
}

function resetRiwayatFilter() {
  $('#riwayat-filter-tipe').value = '';
  $('#riwayat-filter-dari').value = '';
  $('#riwayat-filter-sampai').value = '';
  riwayatState.filters = {};
  riwayatState.offset = 0;
  loadRiwayat();
}

/* ============================================================
   21. PENGATURAN
   ============================================================ */
function openGantiPasswordModal() {
  $('#pw-lama').value = '';
  $('#pw-baru').value = '';
  $('#pw-konfirmasi').value = '';
  $('#pw-error').style.display = 'none';
  openModal('modal-pw');
}

async function saveGantiPassword() {
  var lama = $('#pw-lama').value;
  var baru = $('#pw-baru').value;
  var konfirmasi = $('#pw-konfirmasi').value;
  var errEl = $('#pw-error');

  if (!lama || !baru || !konfirmasi) { errEl.textContent = 'Semua kolom wajib diisi.'; errEl.style.display = 'block'; return; }
  if (baru.length < 6) { errEl.textContent = 'Kata sandi baru minimal 6 karakter.'; errEl.style.display = 'block'; return; }
  if (baru !== konfirmasi) { errEl.textContent = 'Konfirmasi kata sandi tidak cocok.'; errEl.style.display = 'block'; return; }

  errEl.style.display = 'none';
  var btn = $('#btn-save-pw');
  btn.disabled = true;

  var lamaHash = await sha256(lama);
  var baruHash = await sha256(baru);
  var res = await api('changePassword', { old_password_hash: lamaHash, new_password_hash: baruHash });
  btn.disabled = false;

  if (res.success) {
    closeModal('modal-pw');
    showToast('Kata sandi berhasil diubah. Silakan login ulang.', 'success');
    setTimeout(function () { localStorage.removeItem(TOKEN_KEY); showLogin(); }, 2000);
  } else {
    errEl.textContent = res.error || 'Gagal mengubah kata sandi.';
    errEl.style.display = 'block';
  }
}

async function handleBackup() {
  var res = await api('backup', {}, true);
  if (!res.success) { showToast(res.error || 'Gagal backup', 'error'); return; }

  var blob = new Blob([JSON.stringify(res.data.backup_data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'nabung-backup-' + today() + '.json';
  a.click();
  URL.revokeObjectURL(url);

  showToast('Backup berhasil diunduh 💾', 'success');
  if (res.data.new_achievements) showAchievementToasts(res.data.new_achievements);
}

function handleRestoreFileChange(e) {
  var file = e.target.files[0];
  if (!file) return;
  e.target.value = '';

  var reader = new FileReader();
  reader.onload = async function (ev) {
    var backupData;
    try { backupData = JSON.parse(ev.target.result); }
    catch (err) { showToast('File backup tidak valid (JSON rusak)', 'error'); return; }

    var isV2 = backupData.version && backupData.transactions && backupData.targets;
    if (!isV2) { showToast('Format backup tidak dikenali. Gunakan backup dari versi terbaru.', 'error'); return; }

    openConfirm(
      'Pulihkan Data',
      'Data akan direstore dari backup ini. Semua data di aplikasi akan DIGANTI. Lanjutkan?',
      async function () {
        var res = await api('restore', { backup_data: backupData }, true);
        if (res.success) {
          showToast('Restore berhasil! ' + (res.data.restored.transactions || 0) + ' transaksi dipulihkan.', 'success');
          if (res.data.new_achievements) showAchievementToasts(res.data.new_achievements);
          loadDashboard();
        } else {
          showToast(res.error || 'Gagal merestore data', 'error');
        }
      }
    );
  };
  reader.readAsText(file);
}

function handleOpenReset() {
  openConfirm(
    '⚠️ Reset Semua Data',
    'Tindakan ini akan menghapus SEMUA transaksi. Data tidak dapat dipulihkan! Apakah kamu benar-benar yakin?',
    async function () {
      showLoading();
      var res = await api('getTransactions', { limit: 99999, offset: 0 });
      if (!res.success) { hideLoading(); showToast('Gagal memuat data', 'error'); return; }
      var deleted = 0;
      for (var i = 0; i < res.data.transactions.length; i++) {
        var delRes = await api('deleteTransaction', { id: res.data.transactions[i].id });
        if (delRes.success) deleted++;
      }
      hideLoading();
      showToast(deleted + ' transaksi berhasil dihapus', 'success');
    }
  );
}

/* ============================================================
   22. EVENT BINDING (semua listener didaftarkan di sini)
   ============================================================ */
function bindEvents() {
  // Login
  $('#btn-login').addEventListener('click', handleLoginSubmit);
  $('#login-password').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('#btn-login').click(); });
  $('#login-username').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('#login-password').focus(); });
  $('#btn-logout').addEventListener('click', handleLogout);

  // Navigation
  $all('.nav-item').forEach(function (item) { item.addEventListener('click', function () { goTo(item.dataset.page); }); });
  $('#btn-hamburger').addEventListener('click', openSidebar);
  $('#sidebar-overlay').addEventListener('click', closeSidebar);

  // Modal overlays (generic close-on-backdrop-click)
  $all('.modal-overlay').forEach(function (ov) { ov.addEventListener('click', onModalOverlayClick); });
  $('#btn-confirm-ok').addEventListener('click', onConfirmOk);

  // Dashboard
  $('#btn-refresh-dash').addEventListener('click', loadDashboard);

  // Transaksi
  $('#tx-tbody').addEventListener('click', onTxTbodyClick);
  $('#btn-tx-prev').addEventListener('click', txGoPrev);
  $('#btn-tx-next').addEventListener('click', txGoNext);
  $('#btn-filter-tx').addEventListener('click', applyTxFilter);
  $('#btn-reset-filter').addEventListener('click', resetTxFilter);
  $('#btn-add-tx').addEventListener('click', openAddTx);
  $('#btn-save-tx').addEventListener('click', saveTx);

  // Nabung & Tarik
  $('#btn-nabung').addEventListener('click', function () { doSaving(true); });
  $('#btn-tarik').addEventListener('click', function () { doSaving(false); });

  // Target
  var btnBuatTargetEmpty = document.getElementById('btn-buat-target-empty');
  if (btnBuatTargetEmpty) btnBuatTargetEmpty.addEventListener('click', openCreateTargetModal);
  $('#page-target').addEventListener('click', onTargetPageClick);
  $('#btn-save-target').addEventListener('click', saveTarget);

  // Statistik
  $('#btn-stat-apply').addEventListener('click', fetchAndRenderStat);
  $('#stat-kat-tabs').addEventListener('click', onStatKatTabsClick);
  $('#trend-tab-group').addEventListener('click', onTrendTabGroupClick);

  // Simulator
  $('#btn-sim-hitung').addEventListener('click', handleSimulasiHitung);

  // Riwayat
  $('#btn-riwayat-prev').addEventListener('click', riwayatGoPrev);
  $('#btn-riwayat-next').addEventListener('click', riwayatGoNext);
  $('#btn-filter-riwayat').addEventListener('click', applyRiwayatFilter);
  $('#btn-reset-riwayat').addEventListener('click', resetRiwayatFilter);

  // Pengaturan
  $('#theme-grid').addEventListener('click', onThemeGridClick);
  $('#btn-open-ganti-pw').addEventListener('click', openGantiPasswordModal);
  $('#btn-save-pw').addEventListener('click', saveGantiPassword);
  $('#btn-backup').addEventListener('click', handleBackup);
  $('#restore-file').addEventListener('change', handleRestoreFileChange);
  $('#btn-open-reset').addEventListener('click', handleOpenReset);

  // Achievement filter bar (event delegation — dibangun ulang oleh JS jadi delegasi di parent statis)
  $('#ach-filter-bar').addEventListener('click', onAchFilterBarClick);
}

/* ============================================================
   23. BOOT
   ============================================================ */
window.goTo = goTo;       // dipakai oleh atribut onclick="goTo(...)" di HTML
window.closeModal = closeModal; // dipakai oleh atribut onclick="closeModal(...)" di HTML

bindEvents();
initApp();
