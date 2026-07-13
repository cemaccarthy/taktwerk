// app.js - Step 5: Dynamic movement sections (fully restored)
import { secondsToDecimalMMSS } from '/taktwerk/takt.js';

const DB_NAME = 'TaktwerkDB';
const DB_VERSION = 2;

let db;
let currentSongId = null;
let longPressTimer = null;
let activeContextMenu = null;

const audioPlayer = new Audio();
audioPlayer.preload = 'auto';

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" fill="currentColor"/><path d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" fill="currentColor"/><path opacity="0.1" d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" fill="currentColor"/><path d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const STANDARD_KEYS = [
  'C major', 'C minor', 'D♭ major', 'C♯ minor', 'D major', 'D minor',
  'E♭ major', 'E♭ minor', 'E major', 'E minor', 'F major', 'F minor',
  'G♭ major', 'F♯ minor', 'G major', 'G minor', 'A♭ major', 'G♯ minor',
  'A major', 'A minor', 'B♭ major', 'B♭ minor', 'B major', 'B minor'
];

const OBSCURE_KEYS = [
  'C♯ major', 'D♭ minor', 'F♯ major', 'G♭ minor',
  'C♭ major', 'B minor (enharmonic)', 'E♯ minor', 'F minor (enharmonic)',
  'B♯ major', 'C minor (enharmonic)', 'A♯ minor', 'B♭ minor (enharmonic)',
  'D♯ major', 'E♭ minor (enharmonic)', 'G♯ major', 'A♭ minor (enharmonic)',
  'D♯ minor', 'E♭ minor (enharmonic)', 'A♯ major', 'B♭ major (enharmonic)'
];

let playerBar, playerSongName, playerTimes, progressFill, progressContainer, playPauseBtn;
let renameOverlay, renameInput, renameSave, renameCancel;
let tabLibrary, tabAdd, viewLibrary, viewAdd;
let composerOverlay, compFirst, compLast, compCountry, compBirth, compDeath;
let catalogueList, addCatalogueBtn, composerCancel, composerSave;
let composerTrigger, composerDropdown, composerSearchWrap, composerSearchInput;
let composerListEl, composerAddNewBtn;
let pieceTitleInput, pieceSubtitleInput;
let keySigTrigger, keySigDropdown, keySigStandardList, keySigToggle, keySigObscureList;
let opusNumberInput, pieceNumberInput;
let catalogueField, catalogueSelect, catalogueNumberInput;
let catalogueAutoField, catalogueAutoName, catalogueAutoNumber;
let pieceSaveBtn, pieceStatusEl;
let movementsContainer;

let allComposers = [];
let selectedComposerId = null;
let selectedKeySignature = null;
let obscureKeysExpanded = false;
let movementCounter = 0;

// --- IndexedDB ---
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('songs')) db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('composers')) {
        const s = db.createObjectStore('composers', { keyPath: 'id', autoIncrement: true });
        s.createIndex('lastName', 'lastName', { unique: false });
        s.createIndex('firstName', 'firstName', { unique: false });
      }
      if (!db.objectStoreNames.contains('catalogues')) {
        const s = db.createObjectStore('catalogues', { keyPath: 'id', autoIncrement: true });
        s.createIndex('composerId', 'composerId', { unique: false });
      }
      if (!db.objectStoreNames.contains('pieces')) {
        const s = db.createObjectStore('pieces', { keyPath: 'id', autoIncrement: true });
        s.createIndex('composerId', 'composerId', { unique: false });
        s.createIndex('title', 'title', { unique: false });
      }
      if (!db.objectStoreNames.contains('movements')) {
        const s = db.createObjectStore('movements', { keyPath: 'id', autoIncrement: true });
        s.createIndex('pieceId', 'pieceId', { unique: false });
        s.createIndex('movementNumber', 'movementNumber', { unique: false });
      }
    };
    request.onsuccess = (event) => { db = event.target.result; resolve(db); };
    request.onerror = (event) => reject(event.target.error);
  });
}

// --- Composer CRUD ---
async function loadComposers() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['composers'], 'readonly');
    const req = tx.objectStore('composers').getAll();
    req.onsuccess = () => {
      resolve(req.result.sort((a, b) => {
        const cmp = a.lastName.localeCompare(b.lastName);
        return cmp !== 0 ? cmp : a.firstName.localeCompare(b.firstName);
      }));
    };
    req.onerror = () => reject(req.error);
  });
}

async function saveComposer(data) {
  return new Promise((resolve) => {
    db.transaction(['composers'], 'readwrite').objectStore('composers').add(data).onsuccess = (e) => resolve(e.target.result);
  });
}

async function saveCatalogue(data) {
  return new Promise((resolve) => {
    db.transaction(['catalogues'], 'readwrite').objectStore('catalogues').add(data).onsuccess = (e) => resolve(e.target.result);
  });
}

async function loadCataloguesForComposer(composerId) {
  return new Promise((resolve) => {
    const tx = db.transaction(['catalogues'], 'readonly');
    tx.objectStore('catalogues').index('composerId').getAll(composerId).onsuccess = (e) => resolve(e.target.result);
  });
}

// --- Piece & Movement CRUD ---
async function savePiece(data) {
  return new Promise((resolve) => {
    db.transaction(['pieces'], 'readwrite').objectStore('pieces').add(data).onsuccess = (e) => resolve(e.target.result);
  });
}

async function saveMovement(data) {
  return new Promise((resolve) => {
    db.transaction(['movements'], 'readwrite').objectStore('movements').add(data).onsuccess = (e) => resolve(e.target.result);
  });
}

// --- Songs CRUD ---
async function saveSongBlob(file) {
  return new Promise((r) => {
    db.transaction(['songs'], 'readwrite').objectStore('songs')
      .add({ name: file.name, blob: file, duration: null, addedAt: Date.now() })
      .onsuccess = e => r(e.target.result);
  });
}

async function updateSongName(id, name) {
  return new Promise((r) => {
    const tx = db.transaction(['songs'], 'readwrite');
    const s = tx.objectStore('songs');
    s.get(id).onsuccess = e => {
      const song = e.target.result;
      if (song) { song.name = name; s.put(song).onsuccess = () => r(); }
    };
  });
}

async function deleteSong(id) {
  return new Promise(r => {
    db.transaction(['songs'], 'readwrite').objectStore('songs').delete(id).onsuccess = () => r();
  });
}

async function extractAndUpdateDuration(id, file) {
  try {
    const t = new Audio();
    t.src = URL.createObjectURL(file);
    const d = await new Promise((r, j) => {
      t.onloadedmetadata = () => { URL.revokeObjectURL(t.src); r(t.duration); };
      t.onerror = () => { URL.revokeObjectURL(t.src); j(); };
    });
    const tx = db.transaction(['songs'], 'readwrite');
    const s = tx.objectStore('songs');
    s.get(id).onsuccess = e => {
      const song = e.target.result;
      if (song) { song.duration = d; s.put(song); }
    };
    renderLibrary(await loadSongs());
  } catch (e) {}
}

async function loadSongs() {
  return new Promise(r => {
    db.transaction(['songs'], 'readonly').objectStore('songs').getAll().onsuccess = e => r(e.target.result);
  });
}

// --- Tab Switching ---
function switchTab(tab) {
  if (tab === 'library') {
    tabLibrary.classList.add('active');
    tabAdd.classList.remove('active');
    viewLibrary.classList.add('active');
    viewAdd.classList.remove('active');
    loadSongs().then(renderLibrary);
  } else {
    tabAdd.classList.add('active');
    tabLibrary.classList.remove('active');
    viewAdd.classList.add('active');
    viewLibrary.classList.remove('active');
  }
}

// --- Player ---
function updatePlayerUI(el, rem, p) {
  playerTimes.textContent = `${secondsToDecimalMMSS(el)} / ${secondsToDecimalMMSS(el + rem)}`;
  progressFill.style.width = `${(p * 100).toFixed(2)}%`;
}

function updatePlayPauseIcon(p) {
  playPauseBtn.innerHTML = p ? PAUSE_ICON : PLAY_ICON;
  playPauseBtn.setAttribute('aria-label', p ? 'Pause' : 'Play');
}

async function playSong(id) {
  db.transaction(['songs'], 'readonly').objectStore('songs').get(id).onsuccess = e => {
    const s = e.target.result;
    if (s && s.blob) {
      if (audioPlayer.src) URL.revokeObjectURL(audioPlayer.src);
      audioPlayer.src = URL.createObjectURL(s.blob);
      audioPlayer.play().catch(console.error);
      currentSongId = id;
      playerSongName.textContent = s.name;
      playerBar.classList.add('active');
      updatePlayPauseIcon(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: s.name, artist: 'Taktwerk', album: 'Local Library' });
        navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
        navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
        navigator.mediaSession.setActionHandler('stop', () => {
          audioPlayer.pause();
          audioPlayer.currentTime = 0;
          playerBar.classList.remove('active');
          currentSongId = null;
          updatePlayPauseIcon(false);
          loadSongs().then(renderLibrary);
        });
      }
    }
  };
}

function togglePlayback(id) {
  currentSongId == id && !audioPlayer.paused ? audioPlayer.pause() : playSong(id);
}

// --- Context Menu ---
function dismissContextMenu() {
  if (activeContextMenu) { activeContextMenu.remove(); activeContextMenu = null; }
  document.querySelectorAll('.song-item.menu-open').forEach(e => e.classList.remove('menu-open'));
}

function showContextMenu(id, name, el) {
  dismissContextMenu();
  el.classList.add('menu-open');
  const m = document.createElement('div');
  m.className = 'context-menu';
  m.innerHTML = '<button data-action="rename">Rename</button><button data-action="delete" class="btn-danger">Delete</button>';
  el.parentNode.insertBefore(m, el.nextSibling);
  activeContextMenu = m;
  m.querySelector('[data-action="rename"]').onclick = async () => { dismissContextMenu(); showRenameModal(id, name); };
  m.querySelector('[data-action="delete"]').onclick = async () => {
    dismissContextMenu();
    if (currentSongId == id) {
      audioPlayer.pause();
      playerBar.classList.remove('active');
      currentSongId = null;
      updatePlayPauseIcon(false);
    }
    await deleteSong(id);
    renderLibrary(await loadSongs());
  };
}

document.addEventListener('click', e => {
  if (activeContextMenu && !activeContextMenu.contains(e.target) && !e.target.closest('.song-item')) dismissContextMenu();
});

// --- Rename Modal ---
let renameTargetId = null;

function showRenameModal(id, name) {
  renameTargetId = id;
  renameInput.value = name;
  renameOverlay.classList.add('active');
  setTimeout(() => { renameInput.focus(); renameInput.select(); }, 100);
}

function hideRenameModal() {
  renameOverlay.classList.remove('active');
  renameTargetId = null;
}

// --- Composer Modal ---
function openComposerModal() {
  compFirst.value = '';
  compLast.value = '';
  compCountry.value = '';
  compBirth.value = '';
  compDeath.value = '';
  catalogueList.innerHTML = '';
  composerOverlay.classList.add('active');
  setTimeout(() => compFirst.focus(), 100);
}

function closeComposerModal() {
  composerOverlay.classList.remove('active');
}

function addCatalogueInput() {
  const e = document.createElement('div');
  e.className = 'catalogue-entry';
  e.innerHTML = '<input type="text" placeholder="Catalogue name (e.g., Op., BWV)" autocomplete="off"><button type="button" class="catalogue-remove">✕</button>';
  e.querySelector('.catalogue-remove').onclick = () => e.remove();
  catalogueList.appendChild(e);
  e.querySelector('input').focus();
}

async function handleComposerSave() {
  const fn = compFirst.value.trim();
  const ln = compLast.value.trim();
  const co = compCountry.value.trim();
  const by = parseInt(compBirth.value, 10);
  const dy = parseInt(compDeath.value, 10);
  if (!fn || !ln || !co || isNaN(by) || isNaN(dy)) {
    pieceStatusEl.textContent = 'Please fill in all required composer fields.';
    return;
  }
  try {
    const cid = await saveComposer({ firstName: fn, lastName: ln, country: co, birthYear: by, deathYear: dy });
    let cc = 0;
    for (const inp of catalogueList.querySelectorAll('.catalogue-entry input')) {
      const n = inp.value.trim();
      if (n) { await saveCatalogue({ composerId: cid, name: n }); cc++; }
    }
    closeComposerModal();
    pieceStatusEl.textContent = `Composer "${ln}, ${fn}" added${cc > 0 ? ` with ${cc} catalogue${cc > 1 ? 's' : ''}` : ''}!`;
    await refreshComposerSelector();
    selectComposer(cid, `${ln}, ${fn}`);
  } catch (e) {
    console.error(e);
    pieceStatusEl.textContent = 'Error saving composer.';
  }
}

// --- Composer Selector ---
async function refreshComposerSelector() {
  allComposers = await loadComposers();
  renderComposerList(allComposers);
  composerSearchWrap.style.display = allComposers.length > 10 ? 'block' : 'none';
}

function renderComposerList(composers) {
  composerListEl.innerHTML = '';
  if (composers.length === 0) {
    composerListEl.innerHTML = '<div class="composer-empty">No composers found</div>';
    return;
  }
  composers.forEach(c => {
    const opt = document.createElement('div');
    opt.className = 'composer-option';
    opt.textContent = `${c.lastName}, ${c.firstName}`;
    opt.addEventListener('click', () => selectComposer(c.id, `${c.lastName}, ${c.firstName}`));
    composerListEl.appendChild(opt);
  });
}

async function selectComposer(id, displayName) {
  selectedComposerId = id;
  composerTrigger.textContent = displayName;
  composerTrigger.classList.remove('placeholder');
  closeComposerDropdown();
  await updateCatalogueFieldForComposer(id);
}

function openComposerDropdown() {
  refreshComposerSelector();
  const rect = composerTrigger.getBoundingClientRect();
  composerDropdown.style.top = `${rect.bottom + 4}px`;
  composerDropdown.style.left = `${rect.left}px`;
  composerDropdown.style.width = `${rect.width}px`;
  composerDropdown.classList.add('active');
  if (allComposers.length > 10) {
    composerSearchInput.value = '';
    setTimeout(() => composerSearchInput.focus(), 50);
  }
}

function closeComposerDropdown() {
  composerDropdown.classList.remove('active');
}

function filterComposers(query) {
  const q = query.toLowerCase().trim();
  if (!q) { renderComposerList(allComposers); return; }
  renderComposerList(allComposers.filter(c =>
    c.lastName.toLowerCase().includes(q) ||
    c.firstName.toLowerCase().includes(q) ||
    `${c.lastName}, ${c.firstName}`.toLowerCase().includes(q)
  ));
}

// --- Key Signature Dropdown ---
function buildKeySignatureLists() {
  keySigStandardList.innerHTML = '';
  STANDARD_KEYS.forEach(key => {
    const opt = document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', () => selectKeySignature(key));
    keySigStandardList.appendChild(opt);
  });
  keySigObscureList.innerHTML = '';
  OBSCURE_KEYS.forEach(key => {
    const opt = document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', () => selectKeySignature(key));
    keySigObscureList.appendChild(opt);
  });
}

function selectKeySignature(key) {
  selectedKeySignature = key;
  keySigTrigger.textContent = key;
  keySigTrigger.classList.remove('placeholder');
  closeKeySigDropdown();
}

function openKeySigDropdown() {
  const rect = keySigTrigger.getBoundingClientRect();
  keySigDropdown.style.top = `${rect.bottom + 4}px`;
  keySigDropdown.style.left = `${rect.left}px`;
  keySigDropdown.style.width = `${Math.max(rect.width, 280)}px`;
  keySigDropdown.classList.add('active');
}

function closeKeySigDropdown() {
  keySigDropdown.classList.remove('active');
  obscureKeysExpanded = false;
  keySigObscureList.classList.remove('visible');
  keySigToggle.classList.remove('expanded');
}

function toggleObscureKeys() {
  obscureKeysExpanded = !obscureKeysExpanded;
  keySigObscureList.classList.toggle('visible', obscureKeysExpanded);
  keySigToggle.classList.toggle('expanded', obscureKeysExpanded);
}

// --- Catalogue Field Logic ---
async function updateCatalogueFieldForComposer(composerId) {
  catalogueField.style.display = 'none';
  catalogueAutoField.style.display = 'none';
  catalogueSelect.innerHTML = '<option value="">Select catalogue...</option>';
  catalogueNumberInput.value = '';
  catalogueAutoNumber.value = '';
  if (!composerId) return;
  const catalogues = await loadCataloguesForComposer(composerId);
  if (catalogues.length === 0) return;
  if (catalogues.length === 1) {
    catalogueAutoField.style.display = 'block';
    catalogueAutoName.value = catalogues[0].name;
    catalogueAutoName.dataset.catalogueId = catalogues[0].id;
  } else {
    catalogueField.style.display = 'block';
    catalogues.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      catalogueSelect.appendChild(opt);
    });
  }
}

// --- Movement System ---
function getMovementCount() {
  return movementsContainer.querySelectorAll('.movement-outline').length;
}

function renumberMovements() {
  const outlines = movementsContainer.querySelectorAll('.movement-outline');
  outlines.forEach((outline, i) => {
    outline.dataset.movementIndex = i;
    outline.querySelector('.movement-title-label').textContent = `Movement No. ${i + 1}`;
  });
  updateDeleteButtonStates();
}

function updateDeleteButtonStates() {
  const count = getMovementCount();
  movementsContainer.querySelectorAll('.movement-delete-btn').forEach(btn => {
    count <= 4 ? btn.classList.add('locked') : btn.classList.remove('locked');
  });
}

function attachExpansionListener(outline) {
  const inputs = outline.querySelectorAll('input, select, button.movement-file-picker');
  const handler = () => {
    const outlines = movementsContainer.querySelectorAll('.movement-outline');
    const lastOutline = outlines[outlines.length - 1];
    if (outline === lastOutline) addMovementOutline();
    inputs.forEach(inp => inp.removeEventListener('input', handler));
    inputs.forEach(inp => inp.removeEventListener('change', handler));
    inputs.forEach(inp => inp.removeEventListener('click', handler));
  };
  inputs.forEach(inp => {
    inp.addEventListener('input', handler);
    inp.addEventListener('change', handler);
    if (inp.classList.contains('movement-file-picker')) inp.addEventListener('click', handler);
  });
}

function createMovementKeySigDropdown() {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'movement-key-sig-trigger placeholder';
  trigger.textContent = 'Select Key Signature';

  const dropdown = document.createElement('div');
  dropdown.className = 'key-sig-dropdown';

  const standardList = document.createElement('div');
  STANDARD_KEYS.forEach(key => {
    const opt = document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      trigger.textContent = key;
      trigger.classList.remove('placeholder');
      trigger.dataset.value = key;
      dropdown.classList.remove('active');
    });
    standardList.appendChild(opt);
  });

  const toggle = document.createElement('div');
  toggle.className = 'key-sig-toggle';
  toggle.innerHTML = '<span class="arrow">▸</span> Obscure or Theoretical Keys';

  const obscureList = document.createElement('div');
  obscureList.className = 'key-sig-obscure';
  OBSCURE_KEYS.forEach(key => {
    const opt = document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      trigger.textContent = key;
      trigger.classList.remove('placeholder');
      trigger.dataset.value = key;
      dropdown.classList.remove('active');
    });
    obscureList.appendChild(opt);
  });

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('expanded');
    obscureList.classList.toggle('visible');
  });

  dropdown.appendChild(standardList);
  dropdown.appendChild(toggle);
  dropdown.appendChild(obscureList);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.movement-outline .key-sig-dropdown.active').forEach(d => {
      if (d !== dropdown) d.classList.remove('active');
    });
    const rect = trigger.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${Math.max(rect.width, 260)}px`;
    dropdown.classList.toggle('active');
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(dropdown);
  return wrapper;
}

function addMovementOutline() {
  movementCounter++;
  const count = getMovementCount() + 1;
  const outline = document.createElement('div');
  outline.className = 'movement-outline';
  outline.dataset.movementIndex = count - 1;

  // Header
  const header = document.createElement('div');
  header.className = 'movement-header';

  const titleLabel = document.createElement('span');
  titleLabel.className = 'movement-title-label';
  titleLabel.textContent = `Movement No. ${count}`;

  const actions = document.createElement('div');
  actions.className = 'movement-actions';

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'movement-reset-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    outline.querySelectorAll('input[type="text"], input[type="number"]').forEach(inp => inp.value = '');
    const ksTrigger = outline.querySelector('.movement-key-sig-trigger');
    if (ksTrigger) {
      ksTrigger.textContent = 'Select Key Signature';
      ksTrigger.classList.add('placeholder');
      delete ksTrigger.dataset.value;
    }
    const fileInput = outline.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    const fileName = outline.querySelector('.movement-file-name');
    if (fileName) fileName.textContent = '';
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'movement-delete-btn locked';
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => {
    if (getMovementCount() <= 4) return;
    outline.remove();
    renumberMovements();
  });

  actions.appendChild(resetBtn);
  actions.appendChild(deleteBtn);
  header.appendChild(titleLabel);
  header.appendChild(actions);
  outline.appendChild(header);

  // Title field
  const titleLabelEl = document.createElement('label');
  titleLabelEl.className = 'movement-field-label';
  titleLabelEl.textContent = 'Movement Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'movement-input';
  titleInput.placeholder = 'Optional';
  titleInput.autocomplete = 'off';
  titleInput.dataset.field = 'title';
  outline.appendChild(titleLabelEl);
  outline.appendChild(titleInput);

  // Description field
  const descLabel = document.createElement('label');
  descLabel.className = 'movement-field-label';
  descLabel.textContent = 'Programmatic Description';
  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.className = 'movement-input';
  descInput.placeholder = 'Optional';
  descInput.autocomplete = 'off';
  descInput.dataset.field = 'description';
  outline.appendChild(descLabel);
  outline.appendChild(descInput);

  // Key Signature
  const ksLabel = document.createElement('label');
  ksLabel.className = 'movement-field-label';
  ksLabel.textContent = 'Key Signature';
  outline.appendChild(ksLabel);
  outline.appendChild(createMovementKeySigDropdown());

  // Audio File Picker
  const fileLabel = document.createElement('label');
  fileLabel.className = 'movement-field-label';
  fileLabel.textContent = 'Audio File *';
  const filePicker = document.createElement('input');
  filePicker.type = 'file';
  filePicker.accept = '.mp3,.aac,.wav,.aiff,.flac,.alac,audio/mpeg,audio/mp3,audio/aac,audio/wav,audio/flac,audio/aiff,audio/alac';
  filePicker.className = 'movement-file-picker';
  filePicker.dataset.field = 'audioFile';
  const fileNameDisplay = document.createElement('div');
  fileNameDisplay.className = 'movement-file-name';
  filePicker.addEventListener('change', () => {
    fileNameDisplay.textContent = filePicker.files.length > 0 ? filePicker.files[0].name : '';
  });
  outline.appendChild(fileLabel);
  outline.appendChild(filePicker);
  outline.appendChild(fileNameDisplay);

  movementsContainer.appendChild(outline);
  attachExpansionListener(outline);
  updateDeleteButtonStates();
}

function initializeMovements() {
  movementsContainer.innerHTML = '';
  movementCounter = 0;
  for (let i = 0; i < 4; i++) addMovementOutline();
}

// --- Piece Save ---
async function handlePieceSave() {
  const title = pieceTitleInput.value.trim();
  const subtitle = pieceSubtitleInput.value.trim();
  const opusNum = opusNumberInput.value.trim() ? parseInt(opusNumberInput.value, 10) : null;
  const pieceNum = pieceNumberInput.value.trim() ? parseInt(pieceNumberInput.value, 10) : null;

  if (!title) { pieceStatusEl.textContent = 'Piece title is required.'; return; }
  if (!selectedComposerHere is the fully restored `app.js` with all Step 5 functionality intact. Copy this entire file and replace your current test version:

```javascript
// app.js - Step 5: Dynamic movement sections (fully restored)
import { secondsToDecimalMMSS } from '/taktwerk/takt.js';

const DB_NAME = 'TaktwerkDB';
const DB_VERSION = 2;

let db;
let currentSongId = null;
let longPressTimer = null;
let activeContextMenu = null;

const audioPlayer = new Audio();
audioPlayer.preload = 'auto';

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" fill="currentColor"/><path d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" fill="currentColor"/><path opacity="0.1" d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" fill="currentColor"/><path d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Id) { pieceStatusEl.textContent = 'Composer is requiredZ" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const STANDARD_KEYS = [
  'C major', 'C minor', 'D♭ major', 'C♯ minor', 'D major', 'D.'; return; minor',
  'E♭ major', 'E♭ minor', 'E major', 'E minor', 'F major', }

  const outlines = movementsContainer.querySelectorAll('.movement-outline');
  const 'F minor', movementsWithAudio =
  'G♭ major', 'F♯ [];
  outlines minor', 'G.forEach((outline, major', 'G minor', 'A♭ major', 'G♯ i) => { minor',
  'A major', 'A minor', 'B♭ major', 'B♭ minor',
    const file 'B major',Input = outline.querySelector('input[type=" 'B minor'
];

const OBSCURE_KEYS = [
 file"]');
    if (file 'C♯Input && fileInput.files.length >  major', 'D0) {
♭ minor',      movementsWithAudio.push({ outline, 'F♯ major', 'G index: i, file: fileInput♭ minor',
  'C.files[0] });
    }♭ major',
  });

  if (mov 'B minor (enharmonic)', 'E♯ minor', 'FementsWithAudio.length === 0) minor (enhar {
    piecemonic)',
 StatusEl.textContent = 'B♯ 'At least one major', 'C movement must have an audio file.';
    return;
  }

  let catalogueId = null;
  let catalogueNumber = null;
  if (catalogueAutoField.style.display === 'block') {
    catalogueId = parseInt(catalogueAutoName.dataset.catalogueId, 10);
    const numVal = catalogueAutoNumber.value.trim();
    catalogueNumber = numVal ? parseInt(numVal, 10) : null;
  } else if (catalogueField.style.display === 'block') {
    const selVal = catalogueSelect.value;
    if (selVal) {
      catalogueId = parseInt(selVal, 10);
      const numVal = catalogueNumberInput.value.trim();
      catalogueNumber = numVal ? parseInt(numVal, 10) : null;
    }
  }

  try {
    const pieceId = await savePiece({
      title,
      subtitle: subtitle || null,
      composerId: selectedComposerId,
      keySignature: selectedKeySignature || null,
      opusNumber: opusNum,
      pieceNumber: pieceNum,
      catalogueId,
      catalogueNumber
    });

    let savedCount = 0;
    for (const mov of movementsWithAudio) {
      const outline = mov.outline;
      const movTitle = outline.querySelector('[data-field="title"]').value.trim();
      const movDesc = outline.querySelector('[data-field=" minor (enharmonic)', 'A♯ minor', 'B♭ minor (enharmonic)',
  'D♯ major', 'E♭ minor (enharmonic)', 'G♯ major', 'A♭ minor (enharmonic)',
  'D♯ minor', 'E♭ minor (enharmonic)', 'Adescription"]').value.trim();
      const ksTrigger = outline♯ major', 'B♭ major (enharmonic)'
];

let playerBar, playerSongName, playerTimes, progressFill, progressContainer, playPauseBtn;
let renameOverlay, renameInput, renameSave, renameCancel;
let tabLibrary, tabAdd, viewLibrary, viewAdd;
let composerOverlay, comp.querySelector('.movement-key-sig-trigger');
      const movKeySig = ksTrigger && ksTriggerFirst, compLast, compCountry, compBirth, compDeath;
let catalogueList, addCatalogueBtn, composerCancel, composerSave;
let composerTrigger, composerDropdown, composerSearchWrap, composerSearchInput;
let composerListEl, composerAddNewBtn;
let pieceTitleInput, pieceSubtitleInput;
let keySigTrigger.dataset.value ? ksTrigger.dataset.value : null;

     , keySigDropdown, keySigStandardList, keySigToggle, keySigObscureList;
let opusNumberInput, pieceNumberInput;
let catalogueField, catalogueSelect, catalogueNumberInput;
let catalogueAutoField, catalogueAutoName, catalogueAutoNumber;
let pieceSaveBtn, pieceStatusEl;
let movementsContainer;

let allComposers = await saveMovement({
        pieceId,
        movementNumber: savedCount + 1, [];
let selectedComposerId = null;
let selectedKeySignature = null;
let obscureKeysExpanded = false;
let movementCounter = 0;

// --- IndexedDB ---
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db =
        title: movTitle || null,
        description: movDesc || event.target.result;
      if (!db.objectStoreNames.contains('songs')) db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('composers')) {
        const s = db.createObjectStore('composers', { keyPath: 'id null,
        keySignature: movKeySig,
        audioBlob: mov.file,
', autoIncrement: true });
        s.createIndex('lastName', 'lastName', { unique: false });
        s.createIndex('firstName', 'firstName        duration: null', { unique: false });
      }
      if (!db.objectStoreNames.contains('catalogues')) {

      });
        const s = db.createObjectStore('      savedCount++;
    }

    pieceTitleInputcatalogues', {.value = '';
    pieceSubtitleInput keyPath: '.value = '';
id', autoIncrement    opusNumber: true });
Input.value = '';
    pieceNumber        s.createIndexInput.value = '';
    catalogueNumberInput.value = '';
    catalogueAutoNumber.value = '';
    selectedKeySignature = null;
    keySigTrigger.textContent = 'Select Key Signature';
    keySigTrigger.classList.add('placeholder');
    catalogueField.style.display = 'none';
    catalogueAutoField.style.display = 'none';
    initializeMovements();

    pieceStatusEl.textContent = `${savedCount}('composerId', Piece${savedCount 'composerId', > 1 ? { unique: false 's' : ''} Added!`;
  } });
      }
      if (!db.objectStoreNames catch (e) {
    console.contains('pieces')) {
        const.error(e);
    pieceStatusEl s = db.createObject.textContent = 'ErrorStore('pieces', { keyPath: 'id', autoIncrement: true });
        s.createIndex('composerId', 'composerId saving piece.';
  }
}

// --- Library Rendering ---
function renderLibrary(songs) {
  const el =', { unique: false });
        document.getElementById('library s.createIndex('-list');
 title', 'title el.innerHTML = '';', { unique:
  if (! false });
      }
      if (!db.objectStoreNames.contains('movsongs.length) {
    el.innerHTML = '<li style="text-align:center;padding:20px;color:#6e6e73;">No songs imported yet.<brements')) {
        const s =><br>Tap db.createObjectStore('movements', { keyPath: 'id', autoIncrement "Add Music" to get started.</li>';
    return;
  }
  songs: true });
.forEach(s => {        s.createIndex
    const li = document.createElement('li');
    li.className = 'song-item';
    const d = s.duration !== null ? secondsToDecimalMMSS(s.duration) : 'Loading...';
    li.innerHTML = `<div class="song-info"><span class('pieceId', 'pieceId', { unique: false });
        s.createIndex('movementNumber', 'movementNumber', { unique: false });
      }
    };
    request.onsuccess = (event) => { db = event.target.result; resolve(db); };
    request.onerror = (event) => reject(event.target.error);
  });="song-name">${
}

//s.name}</span --- Composer CRUD ---
async function load><span class="Composers()song-duration">${d {
  return}</span></div new Promise((resolve, reject) =>>`;
    li.addEventListener('touchstart', () => {
    const {
      li tx = db.transaction(['composers'], 'readonly');.classList.add('pressing');
      longPressTimer =
    const req = tx.objectStore setTimeout(() => {
        if (navigator.vibrate)('composers').getAll();
 navigator.vibrate(15);
    req.onsuccess = () =>        li.classList.remove {
      resolve('pressing');(req.result.sort((
        showContextMenua, b)(s.id, s => {
       .name, li); const cmp = a
      }, .lastName.localeCompare(b.lastName);
       400); return cmp !== 0 ? cmp : a.firstName.localeCompare
    });
    li.addEventListener('touchend', () => { clearTimeout(long(b.firstName);
PressTimer); li      }));
.classList.remove('pressing'); });
    li.addEventListener('touchcancel', () => { clearTimeout(longPressTimer); li.classList.remove('pressing'); });
    li.addEventListener('touchmove', ()    };
    req.onerror = () => reject(req.error);
  });
}

async function saveComposer(data) {
  return new Promise((resolve) => {
    db.transaction => { clearTimeout(long(['composersPressTimer); li'], 'readwrite.classList.remove('pressing'); });
').objectStore('    li.addEventListener('composers').add(data).onsclick', () =>uccess = (e {
      if) => resolve(e (activeContextMenu &&.target.result);
 li.classList.contains('  });
}menu-open')) { dismissContextMenu(); return

async function saveCatalogue(data); }
      {
  return togglePlayback(s.id new Promise((resolve) => {
);
    });
    el.appendChild    db.transaction(['(li);
 catalogues'], ' });
}

readwrite').object// --- Import (Store('catalogues').add(data).legacy) ---
async function handleImport(files) {
  const st = document.getElementById('status');
  if (!st) return;
  st.textContent = `onsuccess = (Importing ${files.length} songs...e) => resolve(e.target.result);
  });
}

async function loadCataloguesForComposer(composerId) {
  return new Promise((resolve) => {`;
  try
    const tx {
    const = db.transaction([' ids = [];
catalogues'], '    for (let i = 0readonly');
    tx.objectStore('; i < filescatalogues').index.length; i++)('composerId'). {
      constgetAll(composerId id = await save).onsuccess = (e) =>SongBlob(files[i resolve(e.target.result]);
      ids);
  });.push({ id, file: files[i
}

// --- Piece & Movement CRUD ---
async] });
      function savePiece(data) {
  st.textContent = `Saved ${i + return new Promise(( 1}/${files.length}`;
resolve) => {    }
   
    db.transaction st.textContent = 'Extracting metadata...(['pieces'], '';
    forreadwrite').object (const { idStore('pieces')., file } ofadd(data).ons ids) await extractuccess = (e) => resolve(eAndUpdateDuration(id,.target.result);
 file);
     });
} st.textContent = `Import complete! ${

async function savefiles.length} songMovement(data) {${files.length > 1 ? '
  return news' : '' Promise((resolve) => {
    db.transaction(['mov} added.`;ements'], 'read
    setTimeout(() => switchTab('write').objectStorelibrary'), 8('movements').00);
add(data).ons  } catch (e) {
uccess = (e    console.error(e) => resolve(e.target.result);
);
    st  });
}.textContent = 'Error

// --- Songs importing songs.';
  }
 CRUD ---
async}

// --- function saveSongBlob Init ---
async function initApp() {
  await initDB();

  playerBar = document.getElementById('player-bar');
  playerSongName = document.getElementById('player-song-name');
  playerTimes = document.getElementById('player-times');
  progressFill = document.getElementById('progress-fill');
  progressContainer = document.getElementById('progress-container');
  playPauseBtn = document.getElementById('play-pause-btn');
  renameOverlay = document.getElementById('rename-overlay');
  renameInput = document.getElementById('rename-input');
  renameSave = document.getElementById('rename-save');
  renameCancel = document.getElementById('rename-cancel');
  tabLibrary = document.getElementById('tab-library');
  tabAdd = document.getElementById('tab-add');
  viewLibrary = document.getElementById('view-library');
  viewAdd = document.getElementById('view-add');
  composerOverlay = document.getElementById('composer-overlay');
  compFirst = document.getElementById('comp-first');
  compLast = document.getElementById('comp-last');
  compCountry = document.getElementById('comp-country');
  compBirth = document.getElementById('comp-birth');
  compDeath = document.getElementById('comp-death');
  catalogueList = document.getElementById(file) {
  return new Promise((r) => {
    db.transaction(['songs'], 'readwrite').objectStore('songs')
      .add({ name: file.name, blob: file, duration: null, addedAt: Date.now() })
      .onsuccess = e => r(e.target.result);
  });
}

async function updateSongName(id, name) {
  return new Promise((r) => {
    const tx = db.transaction(['songs'], 'readwrite');
    const s = tx.objectStore('songs');
    s.get(id).onsuccess = e => {
      const song = e.target.result;
      if (song) { song.name = name; s.put(song).onsuccess = () => r(); }
    };
  });
}

async function deleteSong(id) {
  return new Promise(r => {
    db.transaction(['songs'], 'readwrite').objectStore('songs').delete(id).onsuccess = () => r();
  });
}

async function extractAndUpdateDuration(id, file) {
  try {
    const t = new Audio();
    t.src = URL('catalogue-list.createObjectURL(file);
    const d');
  add = await new PromiseCatalogueBtn = document.getElementById('add((r, j) => {
      t.onloadedmetadata = () => { URL.revokeObjectURL(t.src); r(t.duration); };
      t.onerror = () => { URL.revokeObjectURL(t.src); j(); };
    });
    const tx = db.transaction(['songs'], 'readwrite');
    const s = tx-catalogue-btn.objectStore('songs');
  composer');
    s.get(id).onsuccess = e => {
      constCancel = document.getElementById('composer-cancel');
  composerSave = document.getElementById(' song = e.targetcomposer-save');
  composerTrigger =.result;
      if (song) { song.duration = d; s.put document.getElementById('composer(song); }
-trigger');
  composerDropdown = document    };
   .getElementById('composer-dropdown');
  composerSearchWrap = document renderLibrary(await loadSongs());
  } catch (e.getElementById('composer-search-wrap');
 ) {}
}

async function loadSongs() {
  return new Promise(r => {
    db.transaction(['songs'], 'readonly composerSearchInput =').objectStore(' document.getElementById('composer-search-input');
  composerListElsongs').getAll(). = document.getElementById('composer-list');
onsuccess = e  composerAddNewBtn = document.getElementById => r(e.target('composer-add-new');
  piece.result);
 TitleInput = document });
}

// --- Tab Switching ---
function.getElementById('piece-title switchTab(tab)');
  pieceSubtitleInput = document {
  if.getElementById('piece-subtitle');
  (tab === ' keySigTrigger = document.getElementById('keylibrary') {
-sig-trigger');
  keySigDropdown = document.getElementById    tabLibrary.classList('key-sig-dropdown');
  keySigStandardList.add('active'); = document.getElementById('key-sig-standard
    tabAdd-list');
 .classList.remove('active keySigToggle = document.getElementById('key-sig-toggle');');
    view
  keySigObscureList = document.getElementById('Library.classList.add('key-sig-obscure-list');active');
   
  opus viewAdd.classList.removeNumberInput = document.getElementById('opus-number');
  piece('active');
NumberInput = document.getElementById('piece-number');
  catalogueField = document.getElementById('catalogue-field');
  catalogueSelect = document.getElementById    loadSongs().('catalogue-select');
  catalogueNumberInput = documentthen(renderLibrary);
  } else.getElementById('catalogue {
    tab-number');
 Add.classList.add('active');
    catalogueAutoField = tabLibrary.classList.remove('active');
    viewAdd.classList document.getElementById('catalog.add('active');
    viewLibrary.classList.remove('activeue-auto-field');');
  }
  catalogueAutoName = document.getElementById
}

//('catalogue-auto --- Player ---
function updatePlayerUI-name');
 (el, rem, catalogueAutoNumber = document.getElementById('catalogue-auto-number'); p) {

  pieceSave  playerTimes.textContentBtn = document.getElementById('piece-save-btn');
  piece = `${secondsToDecimalMMSS(el)} / ${secondsStatusEl = documentToDecimalMMSS(el + rem)}`;
  progressFill.style.width = `${(p * 100).toFixed(2)}%`;
}

function.getElementById('piece-status');
  movementsContainer = document.getElementById('movements-container');

  buildKeySignatureLists();
  initializeMovements();

  tabLibrary.onclick = e => { e.stopPropagation(); switchTab('library'); };
  tabAdd.onclick = e => { e.stopPropagation(); switchTab('add'); };

  composerTrigger.addEventListener('click', (e updatePlayPauseIcon(p) {
  playPauseBtn.innerHTML = p ? PAUSE_ICON : PLAY_ICON;
  playPauseBtn.setAttribute('aria-label', p ? 'Pause' : 'Play');
}) => {


async function play    e.stopPropagation();Song(id) {
    composerDropdown
  db.transaction.classList.contains('active(['songs'], 'readonly').objectStore') ? closeComposerDropdown() : open('songs').getComposerDropdown();
  });
 (id).onsuccess = e => {
    const s = e.target.result composerSearchInput.addEventListener('input', (e) => filter;
    ifComposers(e (s && s.blob) {
.target.value));
      if (audio  composerAddNewBtn.addEventListener('clickPlayer.src) URL.revokeObjectURL', () => {(audioPlayer.src); closeComposerDropdown(); openComposerModal(); });

  key
      audioPlayer.src = URL.createObjectSigTrigger.addEventListener('URL(s.blob);
      audioPlayer.play().catch(console.error);
      currentSongId =click', (e) => {
    e.stopPropagation();
    keySigDropdown.classList.contains(' id;
     active') ? close playerSongName.textContentKeySigDropdown() : openKeySigDropdown();
  });
  keySigToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleObscureKeys(); });

  document.addEventListener('click', = s.name;
      playerBar.classList.add('active');
      updatePlayPauseIcon(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title (e) =>: s.name, {
    if (composerDropdown.classList artist: 'Taktwerk', album.contains('active'): 'Local Library' });
        navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
        navigator.mediaSession.setActionHandler('pause', && !composerDropdown.contains(e.target) && e.target !== composerTrigger) closeComposerDropdown();
    if (keySigDropdown.classList.contains('active') && !keySigDropdown () => audioPlayer.pause());
       .contains(e.target) navigator.mediaSession.setAction && e.target !==Handler('stop', keySigTrigger) () => {
          audioPlayer.pause();
          audioPlayer.currentTime = 0;
          playerBar.classList.remove closeKeySigDropdown();
    document.querySelectorAll('.movement-outline .key-sig-dropdown.active').forEach('active');
(d => {
      if (!d          currentSongId.contains(e.target) = null;
 && !d.previous          updatePlayPauseElementSibling.contains(eIcon(false);
          loadSongs()..target)) d.classListthen(renderLibrary);.remove('active');
        });

    });
  });

       }
    composerCancel.onclick = }
  }; closeComposerModal;
}

function togglePlayback(id) {
  current
  composerOverlay.onclick = e =>SongId == id { if (e.target === composerOverlay && !audioPlayer.paused ? audioPlayer.pause() : playSong(id);
}

// ---) closeComposerModal Context Menu ---
function dismissContextMenu()(); };
  addCatalogueBtn.onclick = addCatalogueInput;
  composerSave.onclick = handleComposerSave {
  if;
  piece (activeContextMenu)SaveBtn.addEventListener('click', handlePiece { activeContextMenu.removeSave);

 (); activeContextMenu = null; }
  document.querySelectorAll('. renameCancel.onclick = hideRenameModal;
  renameOverlaysong-item.menu-open').forEach(e =>.onclick = e => e.classList.remove('menu-open'));
 { if (e}

function show.target === renameOverlayContextMenu(id, name) hideRenameModal(); };
 , el) { renameSave.onclick =
  dismissContextMenu async () => {();
  el
    const n.classList.add('menu = renameInput.value-open');
 .trim();
    const m = document if (n && renameTargetId !==.createElement('div');
  m.className null) {
 = 'context-menu';
  m.innerHTML = '<button      await updateSongName(renameTargetId, n data-action="rename);
      if">Rename</button (currentSongId><button data-action == renameTargetId="delete" class) {
       ="btn-danger"> playerSongName.textContentDelete</button>'; = n;

  el.parentNode        if ('mediaSession' in navigator.insertBefore(m, el.nextSibling);
 ) navigator.mediaSession activeContextMenu = m.metadata = new Media;
  m.querySelector('[data-actionMetadata({ title:="rename"]').onclick n, artist: = async () => 'Taktwerk', album: ' { dismissContextMenu();Local Library' }); showRenameModal(id, name); };
      }

  m.querySelector      renderLibrary(await loadSongs());
('[data-action="delete"]').onclick =    }
    async () => { hideRenameModal();
  };

    dismissContextMenu();
    if  renameInput.on (currentSongIdkeydown = e => {
    if (e.key === 'Enter') { e.preventDefault(); renameSave.click(); }
    if (e.key === ' == id) {Escape') hideRename
      audioPlayer.pause();
     Modal();
  };

  progress playerBar.classList.remove('active');
      currentSongId = null;
      updatePlayPauseIcon(false);
    }
    await deleteSong(id);
    renderContainer.onclick = e => {
    if (!audioPlayerLibrary(await loadSongs.duration) return;());
  };
    const r = progressContainer.getBoundingClientRect
}

document();
    audio.addEventListener('click', e => {
  if (activeContextMenu && !activePlayer.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left)ContextMenu.contains(e.target / r.width)) * audioPlayer.duration;
  };
  playPauseBtn.onclick = () => {
    if (currentSongId === null) return;
   ) && !e.target.closest('.song-item')) dismissContextMenu();
});

// --- Rename Modal ---
let renameTargetId = null;

function showRenameModal(id, name) {
  rename audioPlayer.paused ?TargetId = id audioPlayer.play().;
  renamecatch(console.error)Input.value = name;
  rename : audioPlayer.pauseOverlay.classList.add('();
  };
  audioPlayeractive');
 .ontimeupdate = () => { setTimeout(() => { renameInput.focus(); renameInput.select();
    if (! }, 10audioPlayer.duration) return;
   0);
} updatePlayerUI(audio

function hideRenamePlayer.currentTime, audioModal() {
Player.duration - audio  renameOverlay.classListPlayer.currentTime, audio.remove('active');Player.currentTime / audio
  renameTargetId = null;Player.duration);

}

//  };
  --- Composer Modal --- audioPlayer.onplay = () => { playerBar.classList.add
function openComposerModal() {
('active'); update  compFirst.valuePlayPauseIcon(true = '';
  compLast.value =); };
  '';
  comp audioPlayer.onpauseCountry.value = '';
  compBirth.value = '';
  compDeath.value = '';
  catalogueList.innerHTML = '';
  composerOverlay.classList.add('active');
  setTimeout(() => compFirst.focus(), 100); = () => updatePlayPauseIcon(false);
  audioPlayer.onended = () => {
    playerBar.classList.remove('active');
    currentSongId = null;
    updatePlayPauseIcon(false);
    loadSongs().then(renderLibrary
}

function);
  };

  const ib closeComposerModal() {
  composer = document.getElementById('importBtn');Overlay.classList.remove('active');
}
  const ap

function addCatalog = document.getElementById('ueInput() {audioPicker');

  const e = document.createElement('  if (ibdiv');
  && ap) {
    ib.onclick = () => ap e.className = 'catalogue-entry';.click();
   
  e.innerHTML ap.onchange = = '<input type async e => {="text" placeholder="Catalogue name
      if ( (e.g., Op., BWVe.target.files.length > 0))" autocomplete="off"><button type="button {
        await handleImport(Array.from(e.target.files));" class="catalog
        e.target.value = '';
ue-remove">      }
   ✕</button>'; };
  }

  document.on
  e.querySelector('.catalogue-removevisibilitychange = ()').onclick = () => {
    => e.remove(); if (!document.hidden
  catalogueList.appendChild(e);
  e.querySelector(' && !audioPlayer.paused && currentSongId) audioPlayerinput').focus();.play().catch(()
}

async => {});
 function handleComposerSave  };

 () {
  updatePlayPauseIcon const fn = compFirst.value.trim();
  const ln = compLast.value(false);
 .trim();
  const co = compCountry.value.trim();
  const by = parseInt(compBirth.value, 10);
  const dy = parseInt(compDeath.value, 10);
  if (!fn || !ln || !co || isNaN(by) || isNaN(dy)) {
    pieceStatusEl.textContent = 'Please fill in all required composer fields.';
    return;
  }
  try {
    const cid = await saveComposer({ firstName: fn, lastName: ln, country: co, birthYear: by, deathYear: dy });
    let cc = 0;
    for (const inp of catalogueList.querySelectorAll('.catalogue-entry input')) {
      const n = inp.value.trim();
      if (n) { await saveCatalogue({ composerId: cid, name: n }); cc++; }
    }
    closeComposerModal();
    pieceStatusEl.textContent = `Composer "${ln}, ${fn}" added${cc > 0 ? ` with <LaTex>id_1</LaTex>{cc > 1 ? 's' : ''}` : ''}!`;
    await refreshComposerSelector();
    selectComposer(cid, `${ln}, ${fn}`);
  } catch (e) {
    console.error(e);
    pieceStatusEl.textContent = 'Error saving composer.';
  }
}

// --- Composer Selector ---
async function refreshComposerSelector() {
  allComposers = await loadComposers();
  renderComposerList(allComposers);
  composerSearchWrap.style.display = allComposers.length > 10 ? 'block' : 'none';
}

function renderComposerList(composers) {
  composerListEl.innerHTML = '';
  if (composers.length === 0) {
    composerListEl.innerHTML = '<div class="composer-empty">No composers found</div>';
    return;
  }
  composers.forEach(c => {
    const opt = document.createElement('div');
    opt.className = 'composer-option';
    opt.textContent = `${c.lastName}, ${c.firstName}`;
    opt.addEventListener('click', () => selectComposer(c.id, `${c.lastName}, ${c.firstName}`));
    composerListEl.appendChild(opt);
  });
}

async function selectComposer(id, displayName) {
  selectedComposerId = id;
  composerTrigger.textContent = displayName;
  composerTrigger.classList.remove('placeholder');
  closeComposerDropdown();
  await updateCatalogueFieldForComposer(id);
}

function openComposerDropdown() {
  refreshComposerSelector();
  const rect = composerTrigger.getBoundingClientRect();
  composerDropdown.style.top = `${rect.bottom + 4}px`;
  composerDropdown.style.left = `${rect.left}px`;
  composerDropdown.style.width = `${rect.width}px`;
  composerDropdown.classList.add('active');
  if (allComposers.length > 10) {
    composerSearchInput.value = '';
    setTimeout(() => composerSearchInput.focus(), 50);
  }
}

function closeComposerDropdown() {
  composerDropdown.classList.remove('active');
}

function filterComposers(query) {
  const q = query.toLowerCase().trim();
  if (!q) { renderComposerList(allComposers); return; }
  renderComposerList(allComposers.filter(c =>
    c.lastName.toLowerCase().includes(q) ||
    c.firstName.toLowerCase().includes(q) ||
    `${c.lastName}, ${c.firstName}`.toLowerCase().includes(q)
  ));
}

// --- Key Signature renderLibrary(await load Dropdown ---
function buildKeySignatureLists() {
  keySigStandardList.innerHTML = '';
  STANDARD_KEYS.forEach(key => {
    const opt =Songs());
  document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', () => selectKeySignature(key));
    keySigStandardList.appendChild(opt);
  });
  keySigObscureList.innerHTML = '';
  OBSCURE_KEYS.forEach(key => {
    const opt = document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', () => selectKeySignature(key));
    keySigObscureList.appendChild(opt);
  });
}

function selectKeySignature(key) {
  selectedKeySignature = key;
  keySigTrigger.textContent = key;
  keySigTrigger.classList.remove('placeholder');
  closeKeySigDropdown();
}

function openKeySigDropdown() {
  const rect = keySigTrigger.getBoundingClientRect();
  keySigDropdown.style.top = `${rect.bottom + 4}px`;
  keySigDropdown.style.left = `${rect.left}px`;
  keySigDropdown.style.width = `${Math.max(rect.width, 280)}px`;
  keySigDropdown.classList.add('active');
}

function closeKeySigDropdown() {
  keySigDropdown.classList.remove('active');
  obscureKeysExpanded = false;
  keySigObscureList.classList.remove('visible');
  keySigToggle.classList.remove('expanded');
}

function toggleObscureKeys() {
  obscureKeysExpanded = !obscureKeysExpanded;
  keySigObscureList.classList.toggle('visible', obscureKeysExpanded);
  keySigToggle.classList.toggle('expanded', obscureKeysExpanded);
}

// --- Catalogue Field Logic ---
async function updateCatalogueFieldForComposer(composerId) {
  catalogueField.style.display = 'none';
  catalogueAutoField.style.display = 'none';
  catalogueSelect.innerHTML = '<option value="">Select catalogue...</option>';
  catalogueNumberInput.value = '';
  catalogueAutoNumber.value = '';
  if (!composerId) return;
  const catalogues = await loadCataloguesForComposer(composerId);
  if (catalogues.length === 0) return;
  if (catalogues.length === 1) {
    catalogueAutoField.style.display = 'block';
    catalogueAutoName.value = catalogues[0].name;
    catalogueAutoName.dataset.catalogueId = catalogues[0].id;
  } else {
    catalogueField.style.display = 'block';
    catalogues.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      catalogueSelect.appendChild(opt);
    });
  }
}

// --- Movement System ---
function getMovementCount() {
  return movementsContainer.querySelectorAll('.movement-outline').length;
}

function renumberMovements() {
  const outlines = movementsContainer.querySelectorAll('.movement-outline');
  outlines.forEach((outline, i) => {
    outline.dataset.movementIndex = i;
    outline.querySelector('.movement-title-label').textContent = `Movement No. ${i + 1}`;
  });
  updateDeleteButtonStates();
}

function updateDeleteButtonStates() {
  const count = getMovementCount();
  movementsContainer.querySelectorAll('.movement-delete-btn').forEach(btn => {
    count <= 4 ? btn.classList.add('locked') : btn.classList.remove('locked');
  });
}

function attachExpansionListener(outline) {
  const inputs = outline.querySelectorAll('input, select, button.movement-file-picker');
  const handler = () => {
    const outlines = movementsContainer.querySelectorAll('.movement-outline');
    const lastOutline = outlines[outlines.length - 1];
    if (outline === lastOutline) addMovementOutline();
    inputs.forEach(inp => inp.removeEventListener('input', handler));
    inputs.forEach(inp => inp.removeEventListener('change', handler));
    inputs.forEach(inp => inp.removeEventListener('click', handler));
  };
  inputs.forEach(inp => {
    inp.addEventListener('input', handler);
    inp.addEventListener('change', handler);
    if (inp.classList.contains('movement-file-picker')) inp.addEventListener('click', handler);
  });
}

function createMovementKeySigDropdown() {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'movement-key-sig-trigger placeholder';
  trigger.textContent = 'Select Key Signature';

  const dropdown = document.createElement('div');
  dropdown.className = 'key-sig-dropdown';

  const standardList = document.createElement('div');
  STANDARD_KEYS.forEach(key => {
    const opt = document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      trigger.textContent = key;
      trigger.classList.remove('placeholder');
      trigger.dataset.value = key;
      dropdown.classList.remove('active');
    });
    standardList.appendChild(opt);
  console.log('[T });

  constaktwerk] Step toggle = document.createElement('div');
  toggle.className = 'key-sig-toggle';
  toggle.innerHTML = '<span class="arrow">▸</span> Obscure or Theoretical Keys';

  const obscureList = document.createElement('div');
  obscureList.className = 'key-sig-obscure';
  OBSCURE_KEYS.forEach(key => {
    const opt = document.createElement('div');
    opt.className = 'key-sig-option';
    opt.textContent = key;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      trigger.textContent = key;
      trigger.classList.remove('placeholder');
      trigger.dataset.value = key;
      dropdown.classList.remove('active');
    });
    obscureList.appendChild(opt);
  });

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('expanded');
    obscureList.classList.toggle('visible');
  });

  dropdown.appendChild(standardList);
  dropdown.appendChild(toggle);
  dropdown.appendChild(obscureList);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.movement-outline .key-sig-dropdown.active').forEach(d => {
      if (d !== dropdown) d.classList.remove('active');
    });
    const rect = trigger.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${Math.max(rect.width, 260)}px`;
    dropdown.classList.toggle('active');
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(dropdown);
  return wrapper;
}

function addMovementOutline() {
  movementCounter++;
  const count = getMovementCount() + 1;
  const outline = document.createElement('div');
  outline.className = 'movement-outline';
  outline.dataset.movementIndex = count - 1;

  // Header
  const header = document.createElement('div');
  header.className = 'movement-header';

  const titleLabel = document.createElement('span');
  titleLabel.className = 'movement-title-label';
  titleLabel.textContent = `Movement No. ${count}`;

  const actions = document.createElement('div');
  actions.className = 'movement-actions';

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'movement-reset-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    outline.querySelectorAll('input[type="text"], input[type="number"]').forEach(inp => inp.value = '');
    const ksTrigger = outline.querySelector('.movement-key-sig-trigger');
    if (ksTrigger) {
      ksTrigger.textContent = 'Select Key Signature';
      ksTrigger.classList.add('placeholder');
      delete ksTrigger.dataset.value;
    }
    const fileInput = outline.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
    const fileName = outline.querySelector('.movement-file-name');
    if (fileName) fileName.textContent = '';
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'movement-delete-btn locked';
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => {
    if (getMovementCount() <= 4) return;
    outline.remove();
    renumberMovements();
  });

  actions.appendChild(resetBtn);
  actions.appendChild(deleteBtn);
  header.appendChild(titleLabel);
  header.appendChild(actions);
  outline.appendChild(header);

  // Title field
  const titleLabelEl = document.createElement('label');
  titleLabelEl.className = 'movement-field-label';
  titleLabelEl.textContent = 'Movement Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'movement-input';
  titleInput.placeholder = 'Optional';
  titleInput.autocomplete = 'off';
  titleInput.dataset.field = 'title';
  outline.appendChild(titleLabelEl);
  outline.appendChild(titleInput);

  // Description field
  const descLabel = document.createElement('label');
  descLabel.className = 'movement-field-label';
  descLabel.textContent = 'Programmatic Description';
  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.className = 'movement-input';
  descInput.placeholder = 'Optional';
  descInput.aut 5: Dynamic movements ready');
ocomplete = 'off';
  descInput.dataset.field = 'description';
  outline.appendChild(descLabel);
  outline.appendChild(descInput);

  // Key Signature
  const ksLabel = document.createElement('label');
  ksLabel.className = 'movement-field-label';
  ksLabel.textContent = 'Key Signature';
  outline.appendChild(ksLabel);
  outline.appendChild(createMovementKeySigDropdown());

  // Audio File Picker
  const fileLabel = document.createElement('label');
  fileLabel.className = 'movement-field-label';
  fileLabel.textContent = 'Audio File *';
  const filePicker = document.createElement('input');
  filePicker.type = 'file';
  filePicker.accept = '.mp3,.aac,.wav,.aiff,.flac,.alac,audio/mpeg,audio/mp3,audio/aac,audio/wav,audio/flac,audio/aiff,audio/alac';
  filePicker.className = 'movement-file-picker';
  filePicker.dataset.field = 'audioFile';
  const fileNameDisplay = document.createElement('div');
  fileNameDisplay.className = 'movement-file-name';
  filePicker.addEventListener('change', () => {
    fileNameDisplay.textContent = filePicker.files.length > 0 ? filePicker.files[0].name : '';
  });
  outline.appendChild(fileLabel);
  outline.appendChild(filePicker);
  outline.appendChild(fileNameDisplay);

  movementsContainer.appendChild(outline);
  attachExpansionListener(outline);
  updateDeleteButtonStates();
}

function initializeMovements() {
  movementsContainer.innerHTML = '';
  movementCounter = 0;
  for (let i = 0; i < 4; i++) addMovementOutline();
}

// --- Piece Save ---
async function handlePieceSave() {
  const title = pieceTitleInput.value.trim();
  const subtitle = pieceSubtitleInput.value.trim();
  const opusNum = opusNumberInput.value.trim() ? parseInt(opusNumberInput.value, 10) : null;
  const pieceNum = pieceNumberInput.value.trim() ? parseInt(pieceNumberInput.value, 10) : null;

  if (!title) { pieceStatusEl.textContent = 'Piece title is required.'; return; }
  if (!selectedComposerId) { pieceStatusEl.textContent = 'Composer is required.'; return; }

  const outlines = movementsContainer.querySelectorAll('.movement-outline');
  const movementsWithAudio = [];
  outlines.forEach((outline, i) => {
    const fileInput = outline.querySelector('input[type="file"]');
    if (fileInput && fileInput.files.length > 0) {
      movementsWithAudio.push({ outline, index: i, file: fileInput.files[0] });
    }
  });

  if (movementsWithAudio.length === 0) {
    pieceStatusEl.textContent = 'At least one movement must have an audio file.';
    return;
  }

  let catalogueId = null;
  let catalogueNumber = null;
  if (catalogueAutoField.style.display === 'block') {
    catalogueId = parseInt(catalogueAutoName.dataset.catalogueId, 10);
    const numVal = catalogueAutoNumber.value.trim();
    catalogueNumber = numVal ? parseInt(numVal, 10) : null;
  } else if (catalogueField.style.display === 'block') {
    const selVal = catalogueSelect.value;
    if (selVal) {
      catalogueId = parseInt(selVal, 10);
      const numVal = catalogueNumberInput.value.trim();
      catalogueNumber = numVal ? parseInt(numVal, 10) : null;
    }
  }

  try {
    const pieceId = await savePiece({
      title,
      subtitle: subtitle || null,
      composerId: selectedComposerId,
      keySignature: selectedKeySignature || null,
      opusNumber: opusNum,
      pieceNumber: pieceNum,
      catalogueId,
      catalogueNumber
    });

    let savedCount = 0;
    for (const mov of movementsWithAudio) {
      const outline = mov.outline;
      const movTitle = outline.querySelector('[data-field="title"]').value.trim();
      const movDesc = outline.querySelector('[data-field="description"]').value.trim();
      const ksTrigger = outline.querySelector('.movement-key-sig-trigger');
      const movKeySig = ksTrigger && ksTrigger.dataset.value ? ksTrigger.dataset.value : null;

      await saveMovement({
        pieceId,
        movementNumber: savedCount + 1,
        title: movTitle || null,
        description: movDesc || null,
        keySignature: movKeySig,
        audioBlob: mov.file,
        duration: null
      });
      savedCount++;
    }

    pieceTitleInput.value = '';
    pieceSubtitleInput.value = '';
    opusNumberInput.value = '';
    pieceNumberInput.value = '';
    catalogueNumberInput.value = '';
    catalogueAutoNumber.value = '';
    selectedKeySignature = null;
    keySigTrigger.textContent = 'Select Key Signature';
    keySigTrigger.classList.add('placeholder');
    catalogueField.style.display = 'none';
    catalogueAutoField.style.display = 'none';
    initializeMovements();

    pieceStatusEl.textContent = `${savedCount} Piece${savedCount > 1 ? 's' : ''} Added!`;
  } catch (e) {
    console.error(e);
    pieceStatusEl.textContent = 'Error saving piece.';
  }
}

// --- Library Rendering ---
function renderLibrary(songs) {
  const el = document.getElementById('library-list');
  el.innerHTML = '';
  if (!songs.length) {
    el.innerHTML = '<li style="text-align:center;padding:20px;color:#6e6e73;">No songs imported yet.<br><br>Tap "Add Music" to get started.</li>';
    return;
  }
  songs.forEach(s => {
    const li = document.createElement('li');
    li.className = 'song-item';
    const d = s.duration !== null ? secondsToDecimalMMSS(s.duration) : 'Loading...';
    li.innerHTML = `<div class="song-info"><span class="song-name">${s.name}</span><span class="song-duration">${d}</span></div>`;
    li.addEventListener('touchstart', () => {
      li.classList.add('pressing');
      longPressTimer = setTimeout(() => {
        if (navigator.vibrate) navigator.vibrate(15);
        li.classList.remove('pressing');
        showContextMenu(s.id, s}

initApp.name, li);();
