// app" stroke="currentColor" stroke-width=".js - Step 5: Dynamic movement sections
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
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" fill="currentColor"/><path opacity="0.1" d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" fill="currentColor"/><path d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" stroke="currentColor" stroke-width="2" stroke-line2" stroke-linecap="round"cap="round" stroke-linejoin=" stroke-linejoin="round"/></svg>`round"/></svg>`;

const STANDARD_KEYS = [
;

const STANDARD_KEYS = [
  'C major', 'C minor  'C major', 'C minor', 'D', 'D♭ major', '♭ major', 'C♯ minorC♯ minor', 'D major', 'D major', 'D minor', 'D minor',
  '',
  'E♭ majorE♭ major', 'E', 'E♭ minor', 'E major', '♭ minor', 'E major', 'E minor', 'E minor', 'F major', 'F major', 'F minor',
F minor',
  'G  'G♭ major', '♭ major', 'F♯ minorF♯ minor', 'G major', 'G major', 'G minor', 'G minor', 'A', 'A♭ major', '♭ major', 'G♯ minorG♯ minor',
  '',
  'A major', 'A major', 'A minor', 'A minor', 'B♭ majorB♭ major', 'B', 'B♭ minor', 'B major', '♭ minor', 'B major', 'B minor'
B minor'
];

const OB];

const OBSCURE_KEYS =SCURE_KEYS = [
  ' [
  'C♯ majorC♯ major', 'D', 'D♭ minor', '♭ minor', 'F♯ majorF♯ major', 'G', 'G♭ minor',
♭ minor',
  'C  'C♭ major', '♭ major', 'B minor (enB minor (enharmonic)', 'harmonic)', 'E♯ minorE♯ minor', 'F minor', 'F minor (enharmonic (enharmonic)',
  ')',
  'B♯ majorB♯ major', 'C minor', 'C minor (enharmonic (enharmonic)', 'A)', 'A♯ minor', '♯ minor', 'B♭ minorB♭ minor (enharmonic (enharmonic)',
  ')',
  'D♯ majorD♯ major', 'E', 'E♭ minor (en♭ minor (enharmonic)', 'harmonic)', 'G♯ majorG♯ major', 'A', 'A♭ minor (en♭ minor (enharmonic)',
harmonic)',
  'D  'D♯ minor', '♯ minor', 'E♭ minorE♭ minor (enharmonic (enharmonic)', 'A)', 'A♯ major', '♯ major', 'B♭ majorB♭ major (enharmonic (enharmonic)'
];

)'
];

// DOM references
// DOM references
let playerBar,let playerBar, playerSongName, playerSongName, playerTimes, progress playerTimes, progressFill, progressContainerFill, progressContainer, playPauseBtn, playPauseBtn;
let rename;
let renameOverlay, renameInputOverlay, renameInput, renameSave,, renameSave, renameCancel;
 renameCancel;
let tabLibrary,let tabLibrary, tabAdd, view tabAdd, viewLibrary, viewAddLibrary, viewAdd;
let composer;
let composerOverlay, compFirstOverlay, compFirst, compLast, compCountry, comp, compLast, compCountry, compBirth, compDeathBirth, compDeath;
let catalogue;
let catalogueList, addCatalogueBtn, composerList, addCatalogueBtn, composerCancel, composerSaveCancel, composerSave;
let composer;
let composerTrigger, composerDropdownTrigger, composerDropdown, composerSearchWrap, composerSearchWrap, composerSearchInput;
let composer, composerSearchInput;
let composerListEl, composerListEl, composerAddNewBtn;AddNewBtn;
let pieceTitle
let pieceTitleInput, pieceInput, pieceSubtitleInput;
SubtitleInput;
let keySigTriggerlet keySigTrigger, keySigDropdown, keySigDropdown, keySigStandard, keySigStandardList, keySigList, keySigToggle, keySigToggle, keySigObscureListObscureList;
let op;
let opusNumberInput,usNumberInput, pieceNumberInput; pieceNumberInput;
let catalogueField
let catalogueField, catalogueSelect,, catalogueSelect, catalogueNumberInput; catalogueNumberInput;
let catalogueAuto
let catalogueAutoField, catalogueAutoField, catalogueAutoName, catalogueAutoName, catalogueAutoNumber;
letNumber;
let pieceSaveBtn, pieceSaveBtn, pieceStatusEl; pieceStatusEl;
let movementsContainer
let movementsContainer;

let all;

let allComposersComposers = [];
let = [];
let selectedComposerId = selectedComposerId = null;
let selectedKeySignature = null;
let selectedKeySignature = null;
let obscureKeysExpanded = null;
let obscureKeysExpanded = false;
let false;
let movementCounter movementCounter = 0; = 0;

// --- Indexed

// --- IndexedDB ---
asyncDB ---
async function initDB() function initDB() {
  return new Promise((resolve {
  return new Promise((resolve, reject) =>, reject) => {
    const {
    const request = indexedDB request = indexedDB.open(DB_NAME,.open(DB_NAME, DB_VERSION);
 DB_VERSION);
    request.onup    request.onupgradeneeded =gradeneeded = (event) => (event) => {
      const {
      const db = event.target db = event.target.result;
     .result;
      if (!db.object if (!db.objectStoreNames.contains('StoreNames.contains('songs')) db.createObjectsongs')) db.createObjectStore('songs',Store('songs', { keyPath: { keyPath: 'id', auto 'id', autoIncrement: true });Increment: true });
      if (!
      if (!db.objectStoreNamesdb.objectStoreNames.contains('compos.contains('composers')) {
ers')) {
        const s =        const s = db.createObjectStore(' db.createObjectStore('composers', { keyPath:composers', { keyPath: 'id', auto 'id', autoIncrement: true });Increment: true });
        s.create
        s.createIndex('lastName',Index('lastName', 'lastName', { 'lastName', { unique: false }); unique: false });
        s.create
        s.createIndex('firstName',Index('firstName', 'firstName', { 'firstName', { unique: false }); unique: false });
      }

      }
      if (!db      if (!db.objectStoreNames.contains.objectStoreNames.contains('catalogues'))('catalogues')) {
        const s = db.createObject {
        const s = db.createObjectStore('cataloguesStore('catalogues', { keyPath', { keyPath: 'id',: 'id', autoIncrement: true autoIncrement: true });
        s });
        s.createIndex('composer.createIndex('composerId', 'composerId', 'composerId', { uniqueId', { unique: false });
: false });
      }
           }
      if (!db.object if (!db.objectStoreNames.contains('StoreNames.contains('pieces')) {
pieces')) {
        const s =        const s = db.createObjectStore(' db.createObjectStore('pieces', { keypieces', { keyPath: 'idPath: 'id', autoIncrement:', autoIncrement: true });
        true });
        s.createIndex(' s.createIndex('composerId', 'composerId', {composerId', 'composerId', { unique: false }); unique: false });
        s.create
        s.createIndex('title',Index('title', 'title', { 'title', { unique: false }); unique: false });
      }

      }
      if (!db      if (!db.objectStoreNames.contains.objectStoreNames.contains('movements'))('movements')) {
        const {
        const s = db.createObject s = db.createObjectStore('movementsStore('movements', { keyPath', { keyPath: 'id',: 'id', autoIncrement: true autoIncrement: true });
        s });
        s.createIndex('piece.createIndex('pieceId', 'pieceId', 'pieceId', { uniqueId', { unique: false });
: false });
        s.createIndex        s.createIndex('movementNumber',('movementNumber', 'movementNumber', 'movementNumber', { unique: false { unique: false });
      } });
      }
    };
    };
    request.
    request.onsuccess = (onsuccess = (event) => {event) => { db = event.target db = event.target.result; resolve(db.result; resolve(db); };
   ); };
    request.onerror = ( request.onerror = (event) => rejectevent) => reject(event.target.error);(event.target.error);
  });

  });
}

// ---}

// --- Composer CRUD ---
 Composer CRUD ---
async function loadComasync function loadComposers() {posers() {
  return new Promise((resolve,
  return new Promise((resolve, reject) => {
    const tx reject) => {
    const tx = db.transaction([' = db.transaction(['composers'],composers'], 'readonly');
 'readonly');
    const req =    const req = tx.objectStore(' tx.objectStore('composers').composers').getAll();
   getAll();
    req.onsuccess req.onsuccess = () => { = () => {
      resolve
      resolve(req.result.sort((a, b)(req.result.sort((a, b) => {
        => {
        const cmp = a const cmp = a.lastName.localeCompare(b.lastName.localeCompare(b.lastName);
       .lastName);
        return cmp !==  return cmp !== 0 ? cmp :0 ? cmp : a.firstName.localeCompare a.firstName.localeCompare(b.firstName);
(b.firstName);
      }));
      }));
    };
       };
    req.onerror = () req.onerror = () => reject(req.error => reject(req.error);
  }););
  });
}

async
}

async function saveComposer(data function saveComposer(data) {
 ) {
  return new Promise(( return new Promise((resolve) => {resolve) => {
    const tx
    const tx = db.transaction([' = db.transaction(['composers'],composers'], 'readwrite'); 'readwrite');
    tx.object
    tx.objectStore('composStore('composers').add(dataers').add(data).onsuccess =).onsuccess = (e) => (e) => resolve(e.target.result resolve(e.target.result);
  }););
  });
}

async
}

async function saveCatalogue function saveCatalogue(data) {
(data) {
  return new Promise  return new Promise((resolve) =>((resolve) => {
    const {
    const tx = db.transaction tx = db.transaction(['catalogues'],(['catalogues'], 'readwrite'); 'readwrite');
    tx.object
    tx.objectStore('cataloguesStore('catalogues').add(data).').add(data).onsuccess = (onsuccess = (e) => resolvee) => resolve(e.target.result);(e.target.result);
  });

  });
}

async function}

async function loadCataloguesForComposer(composerId loadCataloguesForComposer(composerId) {
  return new Promise(() {
  return new Promise((resolve) => {
   resolve) => {
    const tx = db const tx = db.transaction(['catalogues.transaction(['catalogues'], 'readonly');'], 'readonly');
    const req
    const req = tx.objectStore = tx.objectStore('catalogues').('catalogues').index('composerIdindex('composerId').getAll(composer').getAll(composerId);
   Id);
    req.onsuccess req.onsuccess = () => resolve = () => resolve(req.result);
(req.result);
  });
}  });
}

// --- Piece

// --- Piece & Movement CRUD --- & Movement CRUD ---

async function savePieceasync function savePiece(data) {
(data) {
  return new Promise  return new Promise((resolve) =>((resolve) => {
    const {
    const tx = db.transaction tx = db.transaction(['pieces'], '(['pieces'], 'readwrite');
readwrite');
    tx.objectStore    tx.objectStore('pieces').add('pieces').add(data).onsuccess(data).onsuccess = (e) = (e) => resolve(e.target => resolve(e.target.result);
 .result);
  });
}

 });
}

async function saveMovementasync function saveMovement(data) {
  return new Promise(data) {
  return new Promise((resolve) =>((resolve) => {
    const {
    const tx = db.transaction tx = db.transaction(['movements'],(['movements'], 'readwrite');
    tx.object 'readwrite');
    tx.objectStore('movementsStore('movements').add(data).').add(data).onsuccess = (onsuccess = (e) => resolvee) => resolve(e.target.result);(e.target.result);
  });

  });
}

// ---}

// --- Songs CRUD ---
 Songs CRUD ---
async function saveSongasync function saveSongBlob(file) {Blob(file) {
  return new
  return new Promise((r Promise((r) => {
    db) => {
    db.transaction(['songs'],.transaction(['songs'], 'readwrite'). 'readwrite').objectStore('songsobjectStore('songs')')
      .add
      .add({ name: file({ name: file.name, blob:.name, blob: file, duration: file, duration: null, addedAt: Date.now() null, addedAt: Date.now() })
      . })
      .onsuccess = eonsuccess = e => r(e.target => r(e.target.result);
 .result);
  });
}

 });
}

async function updateSongasync function updateSongName(id, nameName(id, name) {
 ) {
  return new Promise(( return new Promise((r) => {r) => {
    const tx
    const tx = db.transaction([' = db.transaction(['songs'], 'readsongs'], 'readwrite');
   write');
    const s = tx const s = tx.objectStore('songs.objectStore('songs');
    s');
    s.get(id).ons.get(id).onsuccess = e =>uccess = e => { const song = { const song = e.target.result; e.target.result; if (song) if (song) { song.name = { song.name = name; s.put name; s.put(song).onsuccess(song).onsuccess = () => r = () => r(); } };
(); } };
  });
}  });
}

async function delete

async function deleteSong(id) {Song(id) {
  return new
  return new Promise(r => { Promise(r => { db.transaction(['songs db.transaction(['songs'], 'readwrite'], 'readwrite').objectStore('').objectStore('songs').delete(idsongs').delete(id).onsuccess =).onsuccess = () => r(); () => r(); });
}

 });
}

async function extractAndUpdateasync function extractAndUpdateDuration(id, fileDuration(id, file) {
 ) {
  try {
    try {
    const t = new const t = new Audio(); t.src Audio(); t.src = URL.createObjectURL = URL.createObjectURL(file);
   (file);
    const d = await const d = await new Promise((r new Promise((r, j) =>, j) => { t.onloaded { t.onloadedmetadata = () =>metadata = () => { URL.revoke { URL.revokeObjectURL(t.srcObjectURL(t.src); r(t.duration); r(t.duration); }; t.onerror); }; t.onerror = () => { = () => { URL.revokeObject URL.revokeObjectURL(t.src);URL(t.src); j(); }; }); j(); }; });
    const tx
    const tx = db.transaction([' = db.transaction(['songs'], 'readsongs'], 'readwrite'); const swrite'); const s = tx.objectStore = tx.objectStore('songs');
('songs');
    s.get(id    s.get(id).onsuccess =).onsuccess = e => { const e => { const song = e.target song = e.target.result; if (.result; if (song) { song.duration = d; s.put(song);song) { song.duration = d; s.put(song); } };
    renderLibrary(await load } };
    renderLibrary(await loadSongs());
  } catch (eSongs());
  } catch (e) {}
}) {}
}

async function load

async function loadSongs() {
  return new PromiseSongs() {
  return new Promise(r => { db(r => { db.transaction(['songs'],.transaction(['songs'], 'readonly').object 'readonly').objectStore('songs').Store('songs').getAll().onsuccessgetAll().onsuccess = e => r = e => r(e.target.result);(e.target.result); });
}

 });
}

// --- Tab Switch// --- Tab Switching ---
functioning ---
function switchTab(tab) switchTab(tab) {
  if {
  if (tab === ' (tab === 'library') {
library') {
    tabLibrary.classList    tabLibrary.classList.add('active');.add('active'); tabAdd.classList.remove tabAdd.classList.remove('active');
('active');
    viewLibrary.classList    viewLibrary.classList.add('active');.add('active'); viewAdd.classList.remove viewAdd.classList.remove('active');
('active');
    loadSongs().    loadSongs().then(renderLibrary);then(renderLibrary);
  } else
  } else {
    tab {
    tabAdd.classList.add('Add.classList.add('active'); tabLibraryactive'); tabLibrary.classList.remove('active.classList.remove('active');
    view');
    viewAdd.classList.add('Add.classList.add('active'); viewLibraryactive'); viewLibrary.classList.remove('active.classList.remove('active');
  }');
  }
}

//
}

// --- Player ---
 --- Player ---
function updatePlayerUIfunction updatePlayerUI(el, rem,(el, rem, p) {
 p) {
  playerTimes.textContent  playerTimes.textContent = `<LaTex>id_1</LaTex>{secondsToDecimalMMSS(elDecimalMMSS(el)} / ${seconds)} / ${secondsToDecimalMMSSToDecimalMMSS(el + rem)(el + rem)}`;}`;
  progressFill
  progressFill.style.width = `<LaTex>id_2</LaTex>{(p * (p * 10100).toFixed(0).toFixed(2)}%`;2)}%`;
}

function
}

function updatePlayPause updatePlayPauseIcon(p) {Icon(p) {
  playPause
  playPauseBtn.innerHTML = pBtn.innerHTML = p ? PAUSE_ICON ? PAUSE_ICON : PLAY_ICON; : PLAY_ICON;
  playPause
  playPauseBtn.setAttribute('ariaBtn.setAttribute('aria-label', p ?-label', p ? 'Pause' : 'Pause' : 'Play');
 'Play');
}

async function}

async function playSong(id) playSong(id) {
  db {
  db.transaction(['songs'],.transaction(['songs'], 'readonly').object 'readonly').objectStore('songs').Store('songs').get(id).onsget(id).onsuccess = e =>uccess = e => {
    const {
    const s = e.target s = e.target.result;
   .result;
    if (s && if (s && s.blob) { s.blob) {
      if (
      if (audioPlayer.src)audioPlayer.src) URL.revokeObject URL.revokeObjectURL(audioPlayer.srcURL(audioPlayer.src);
      audio);
      audioPlayer.src = URLPlayer.src = URL.createObjectURL(s.blob.createObjectURL(s.blob);
      audio);
      audioPlayer.play().catchPlayer.play().catch(console.error);
(console.error);
      currentSongId      currentSongId = id;
 = id;
      playerSongName      playerSongName.textContent = s.name;
      player.textContent = s.name;
      playerBar.classList.add('active');
     Bar.classList.add('active');
      updatePlayPauseIcon updatePlayPauseIcon(true);
     (true);
      if ('mediaSession if ('mediaSession' in navigator)' in navigator) {
        navigator {
        navigator.mediaSession.metadata =.mediaSession.metadata = new MediaMetadata({ new MediaMetadata({ title: s.name title: s.name, artist: ', artist: 'Taktwerk',Taktwerk', album: 'Local album: 'Local Library' });
 Library' });
        navigator.mediaSession        navigator.mediaSession.setActionHandler('play.setActionHandler('play', () => audio', () => audioPlayer.play());
Player.play());
        navigator.mediaSession        navigator.mediaSession.setActionHandler('pause.setActionHandler('pause', () => audio', () => audioPlayer.pause());
Player.pause());
        navigator.mediaSession        navigator.mediaSession.setActionHandler('stop.setActionHandler('stop', () => {', () => {
          audioPlayer
          audioPlayer.pause(); audioPlayer.pause(); audioPlayer.currentTime = 0.currentTime = 0;
          player;
          playerBar.classList.remove('Bar.classList.remove('active'); currentSongactive'); currentSongId = null;Id = null;
          updatePlay
          updatePlayPauseIcon(false);PauseIcon(false); loadSongs().then loadSongs().then(renderLibrary);
(renderLibrary);
        });
             });
      }
    } }
    }
  };

  };
}

function toggle}

function togglePlayback(id) {Playback(id) {
  currentSong
  currentSongId == id &&Id == id && !audioPlayer.paused !audioPlayer.paused ? audioPlayer.pause ? audioPlayer.pause() : playSong() : playSong(id);
}(id);
}

// --- Context

// --- Context Menu ---
function Menu ---
function dismissContextMenu() { dismissContextMenu() {
  if (
  if (activeContextMenu) {activeContextMenu) { activeContextMenu.remove(); activeContextMenu.remove(); activeContextMenu = null activeContextMenu = null; }
 ; }
  document.querySelectorAll('.song document.querySelectorAll('.song-item.menu-open').forEach(e => e-item.menu-open').forEach(e => e.classList.remove('menu.classList.remove('menu-open'));
}-open'));
}

function showContextMenu

function showContextMenu(id, name,(id, name, el) {
  dismissContextMenu(); el) {
  dismissContextMenu();
  el.classList
  el.classList.add('menu-open.add('menu-open');
  const');
  const m = document.createElement m = document.createElement('div');
('div');
  m.className =  m.className = 'context-menu'; 'context-menu';
  m.innerHTML
  m.innerHTML = '<button data = '<button data-action="rename">-action="rename">Rename</button>Rename</button><button data-action="<button data-action="delete" class="delete" class="btn-danger">Deletebtn-danger">Delete</button>';
</button>';
  el.parentNode.insertBefore  el.parentNode.insertBefore(m, el.nextSibling(m, el.nextSibling);
  active);
  activeContextMenu = m;ContextMenu = m;
  m.querySelector
  m.querySelector('[data-action="('[data-action="rename"]').onclick =rename"]').onclick = async () => { async () => { dismissContextMenu(); show dismissContextMenu(); showRenameModal(id,RenameModal(id, name); };
 name); };
  m.querySelector('[  m.querySelector('[data-action="deletedata-action="delete"]').onclick = async"]').onclick = async () => {
 () => {
    dismissContextMenu();    dismissContextMenu();
    if (
    if (currentSongId ==currentSongId == id) { audio id) { audioPlayer.pause(); playerPlayer.pause(); playerBar.classList.remove('Bar.classList.remove('active'); currentSongactive'); currentSongId = null;Id = null; updatePlayPauseIcon updatePlayPauseIcon(false); }
(false); }
    await deleteSong    await deleteSong(id); renderLibrary(id); renderLibrary(await loadSongs());(await loadSongs());
  };

  };
}

document.addEventListener}

document.addEventListener('click', e('click', e => {
  => {
  if (activeContextMenu if (activeContextMenu && !activeContextMenu && !activeContextMenu.contains(e.target).contains(e.target) && !e.target && !e.target.closest('.song-item.closest('.song-item')) dismissContextMenu();')) dismissContextMenu();
});

//
});

// --- Rename ---
 --- Rename ---
let renameTargetIdlet renameTargetId = null;
 = null;
function showRenameModalfunction showRenameModal(id, name)(id, name) {
  rename {
  renameTargetId = idTargetId = id; renameInput.value; renameInput.value = name;
 = name;
  renameOverlay.classList  renameOverlay.classList.add('active');.add('active');
  setTimeout(()
  setTimeout(() => { renameInput => { renameInput.focus(); renameInput.focus(); renameInput.select(); }, 100);.select(); }, 100);
}
function
}
function hideRenameModal() hideRenameModal() { renameOverlay.classList { renameOverlay.classList.remove('active');.remove('active'); renameTargetId = renameTargetId = null; }

 null; }

// --- Composer Modal// --- Composer Modal ---
function open ---
function openComposerModal() {ComposerModal() {
  compFirst
  compFirst.value = ''; comp.value = ''; compLast.value = '';Last.value = ''; compCountry.value = compCountry.value = '';
  comp '';
  compBirth.value = ''; compDeath.value =Birth.value = ''; compDeath.value = '';
  catalogue '';
  catalogueList.innerHTML = '';List.innerHTML = '';
  composerOverlay
  composerOverlay.classList.add('active.classList.add('active');
  setTimeout');
  setTimeout(() => compFirst(() => compFirst.focus(), 1.focus(), 100);
00);
}

function close}

function closeComposerModal() {ComposerModal() { composerOverlay.classList.remove composerOverlay.classList.remove('active'); }('active'); }

function addCatalog

function addCatalogueInput() {ueInput() {
  const e
  const e = document.createElement(' = document.createElement('div');
 div');
  e.className = ' e.className = 'catalogue-entry';catalogue-entry';
  e.innerHTML
  e.innerHTML = '<input type = '<input type="text" placeholder="text" placeholder="Catalogue name="Catalogue name (e.g., (e.g., Op., BWV Op., BWV)" autocomplete="off)" autocomplete="off"><button type=""><button type="button" class="button" class="catalogue-remove">catalogue-remove">✕</button✕</button>';
  e>';
  e.querySelector('.catalogue.querySelector('.catalogue-remove').onclick =-remove').onclick = () => e.remove () => e.remove();
  catalogue();
  catalogueList.appendChild(e);List.appendChild(e);
  e.querySelector
  e.querySelector('input').focus('input').focus();
}

();
}

async function handleComposerasync function handleComposerSave() {
Save() {
  const fn =  const fn = compFirst.value.trim compFirst.value.trim(), ln = comp(), ln = compLast.value.trim(),Last.value.trim(), co = compCountry co = compCountry.value.trim();
.value.trim();
  const by =  const by = parseInt(compBirth.value parseInt(compBirth.value, 10, 10), dy = parseInt), dy = parseInt(compDeath.value,(compDeath.value, 10); 10);
  if (!
  if (!fn || !lnfn || !ln || !co || || !co || isNaN(by) || isNaN(by) || isNaN(dy)) { isNaN(dy)) {
    pieceStatus
    pieceStatusEl.textContent = 'El.textContent = 'Please fill in allPlease fill in all required composer fields.' required composer fields.';
    return;
    return;
  };
  }
  try {
  try {
    const cid
    const cid = await saveComposer = await saveComposer({ firstName: fn({ firstName: fn, lastName: ln, lastName: ln, country: co, country: co, birthYear:, birthYear: by, deathYear by, deathYear: dy });
: dy });
    let cc =    let cc = 0;
 0;
    for (const    for (const inp of catalogueList inp of catalogueList.querySelectorAll('.catalogue.querySelectorAll('.catalogue-entry input')) {-entry input')) {
      const n
      const n = inp.value.trim = inp.value.trim();
      if();
      if (n) { (n) { await saveCatalogue await saveCatalogue({ composerId:({ composerId: cid, name: cid, name: n }); cc++; n }); cc++; }
    } }
    }
    closeComposer
    closeComposerModal();
   Modal();
    pieceStatusEl.textContent pieceStatusEl.textContent = `Composer "<LaTex>id_3</LaTex>{ln}, ${fnln}, ${fn}" added${cc}" added${cc > 0 ? > 0 ? ` with <LaTex>id_4</LaTex>{cc} catalogue${cc} catalogue${cc > 1 ? > 1 ? 's' : 's' : ''}` : '' ''}` : ''}!`;
}!`;
    await refreshComposer    await refreshComposerSelector();
   Selector();
    selectComposer(cid, selectComposer(cid, `<LaTex>id_5</LaTex>{ `${ln}, ${fn}`);
fn}`);
  } catch (  } catch (e) { consolee) { console.error(e); pieceStatusEl.textContent =.error(e); pieceStatusEl.textContent = 'Error saving composer 'Error saving composer.'; }
.'; }
}

// ---}

// --- Composer Selector ---
 Composer Selector ---
async function refreshComposerasync function refreshComposerSelector() {
Selector() {
  allComposers = await load  allComposers = await loadComposers();Composers();
  renderComposer
  renderComposerList(allComposList(allComposers);
 ers);
  composerSearchWrap.style composerSearchWrap.style.display = allCom.display = allComposers.length >posers.length > 10 ? 10 ? 'block' : 'block' : 'none';
 'none';
}

function render}

function renderComposerList(composComposerList(composers) {
ers) {
  composerListEl  composerListEl.innerHTML = '';
.innerHTML = '';
  if (com  if (composers.length ===posers.length === 0) { 0) {
    composerList
    composerListEl.innerHTML = 'El.innerHTML = '<div class="composer<div class="composer-empty">No composers-empty">No composers found</div>'; found</div>';
    return;
    return;
  }

  }
  composers.forEach(c  composers.forEach(c => {
    => {
    const opt = document const opt = document.createElement('div');.createElement('div');
    opt.className
    opt.className = 'composer-option = 'composer-option';
    opt';
    opt.textContent = `<LaTex>id_6</LaTex>{c.lastName}, ${c.lastName}, ${c.firstName}`;
.firstName}`;
    opt.addEventListener('    opt.addEventListener('click', () => selectComposer(c.idclick', () => selectComposer(c.id, `<LaTex>id_7</LaTex>{c.lastName}, ${c.firstName}, ${c.firstName}`));
   }`));
    composerListEl.appendChild composerListEl.appendChild(opt);
 (opt);
  });
}

 });
}

async function selectComposer(id, displayName)async function selectComposer(id, displayName) {
  selected {
  selectedComposerId = idComposerId = id;
  composer;
  composerTrigger.textContent = displayNameTrigger.textContent = displayName;
  composer;
  composerTrigger.classList.remove('Trigger.classList.remove('placeholder');
 placeholder');
  closeComposerDropdown(); closeComposerDropdown();
  await update
  await updateCatalogueFieldForCatalogueFieldForComposer(id);
Composer(id);
}

function open}

function openComposerDropdown() {ComposerDropdown() {
  refreshComposer
  refreshComposerSelector();
 Selector();
  const rect = composer const rect = composerTrigger.getBoundingClientRect();
Trigger.getBoundingClientRect();
  composerDropdown.style  composerDropdown.style.top = `<LaTex>id_8</LaTex>{rect.bottom + 4.bottom + 4}px`;
 }px`;
  composerDropdown.style.left composerDropdown.style.left = `<LaTex>id_9</LaTex>{rect.left}px`;
 }px`;
  composerDropdown.style.width composerDropdown.style.width = `<LaTex>id_10</LaTex>{rect.width}px`;
 }px`;
  composerDropdown.classList.add composerDropdown.classList.add('active');
('active');
  if (all  if (allComposers.lengthComposers.length > 10 > 10) {
   ) {
    composerSearchInput.value composerSearchInput.value = '';
    = '';
    setTimeout(() => composer setTimeout(() => composerSearchInput.focus(), 50);SearchInput.focus(), 50);
  }
}

function close
  }
}

function closeComposerDropdown() {ComposerDropdown() { composerDropdown.classList.remove composerDropdown.classList.remove('active'); }('active'); }

function filterCom

function filterComposers(query)posers(query) {
  const {
  const q = query.toLowerCase q = query.toLowerCase().trim();
().trim();
  if (!q  if (!q) { renderComposer) { renderComposerList(allComposList(allComposers); return;ers); return; }
  render }
  renderComposerList(allComComposerList(allComposers.filter(cposers.filter(c =>
    c =>
    c.lastName.toLowerCase().includes.lastName.toLowerCase().includes(q) ||
(q) ||
    c.firstName.toLowerCase    c.firstName.toLowerCase().includes(q)().includes(q) ||
    `<LaTex>id_11</LaTex>{c.lastName}, ${c.lastName}, ${c.firstName}`.c.firstName}`.toLowerCase().includes(qtoLowerCase().includes(q)
  ));)
  ));
}

//
}

// --- Key Signature Dropdown --- Key Signature Dropdown ---
function build ---
function buildKeySignatureLists()KeySignatureLists() {
  key {
  keySigStandardList.innerHTMLSigStandardList.innerHTML = '';
  = '';
  STANDARD_KEYS.forEach(key STANDARD_KEYS.forEach(key => {
    => {
    const opt = document const opt = document.createElement('div');.createElement('div');
    opt.className
    opt.className = 'key-s = 'key-sig-option';
ig-option';
    opt.textContent =    opt.textContent = key;
    key;
    opt.addEventListener('click opt.addEventListener('click', () => select', () => selectKeySignature(key));KeySignature(key));
    keySig
    keySigStandardList.appendChild(optStandardList.appendChild(opt);
  }););
  });
  keySig
  keySigObscureListObscureList.innerHTML = '';
.innerHTML = '';
  OBSCURE  OBSCURE_KEYS.forEach(key =>_KEYS.forEach(key => {
    const {
    const opt = document.createElement opt = document.createElement('div');
('div');
    opt.className =    opt.className = 'key-sig 'key-sig-option';
   -option';
    opt.textContent = key opt.textContent = key;
    opt;
    opt.addEventListener('click',.addEventListener('click', () => selectKey () => selectKeySignature(key));
Signature(key));
    keySigObs    keySigObscureList.appendChildcureList.appendChild(opt);
 (opt);
  });
}

 });
}

function selectKeySignaturefunction selectKeySignature(key) {
(key) {
  selectedKeySignature  selectedKeySignature = key;
 = key;
  keySigTrigger  keySigTrigger.textContent = key;.textContent = key;
  keySig
  keySigTrigger.classList.remove('Trigger.classList.remove('placeholder');
 placeholder');
  closeKeySigDropdown closeKeySigDropdown();
}

();
}

function openKeySigfunction openKeySigDropdown() {
Dropdown() {
  const rect =  const rect = keySigTrigger.getBoundingClientRect keySigTrigger.getBoundingClientRect();
  key();
  keySigDropdown.style.topSigDropdown.style.top = `<LaTex>id_12</LaTex>{rect.bottom + 4}px + 4}px`;
  key`;
  keySigDropdown.style.leftSigDropdown.style.left = `<LaTex>id_13</LaTex>{rect.left}px`;
 }px`;
  keySigDropdown.style keySigDropdown.style.width = `<LaTex>id_14</LaTex>{Math.max(rect.width, 280.max(rect.width, 280)}px`;
)}px`;
  keySigDropdown  keySigDropdown.classList.add('active.classList.add('active');
}

');
}

function closeKeySigfunction closeKeySigDropdown() {
Dropdown() {
  keySigDropdown  keySigDropdown.classList.remove('active.classList.remove('active');
  obscure');
  obscureKeysExpanded = falseKeysExpanded = false;
  keySigObscure;
  keySigObscureList.classList.remove('List.classList.remove('visible');
 visible');
  keySigToggle.classList keySigToggle.classList.remove('expanded');.remove('expanded');
}

function
}

function toggleObscure toggleObscureKeys() {
Keys() {
  obscureKeysExpanded  obscureKeysExpanded = !obsc = !obscureKeysExpanded;ureKeysExpanded;
  keySig
  keySigObscureListObscureList.classList.toggle('visible.classList.toggle('visible', obscureKeysExpanded', obscureKeysExpanded);
  key);
  keySigToggle.classList.toggleSigToggle.classList.toggle('expanded', obscure('expanded', obscureKeysExpanded);
KeysExpanded);
}

// ---}

// --- Catalogue Field Logic Catalogue Field Logic ---
async function ---
async function updateCatalogueField updateCatalogueFieldForComposer(composerForComposer(composerId) {
Id) {
  catalogueField.style  catalogueField.style.display = 'none.display = 'none';
  catalogue';
  catalogueAutoField.style.displayAutoField.style.display = 'none'; = 'none';
  catalogueSelect
  catalogueSelect.innerHTML = '<option.innerHTML = '<option value="">Select catalogue value="">Select catalogue...</option>';
...</option>';
  catalogueNumberInput  catalogueNumberInput.value = '';
.value = '';
  catalogueAutoNumber  catalogueAutoNumber.value = '';
.value = '';
  if (!composer  if (!composerId) return;Id) return;
  const catalog
  const catalogues = await loadues = await loadCataloguesForComposerCataloguesForComposer(composerId);(composerId);
  if (
  if (catalogues.length ===catalogues.length === 0) return 0) return;
  if;
  if (catalogues.length (catalogues.length === 1) === 1) {
    catalogue {
    catalogueAutoField.style.displayAutoField.style.display = 'block'; = 'block';
    catalogueAuto
    catalogueAutoName.value = catalogName.value = catalogues[0].ues[0].name;
   name;
    catalogueAutoName.dataset catalogueAutoName.dataset.catalogueId =.catalogueId = catalogues[0 catalogues[0].id;
].id;
  } else {  } else {
    catalogueField
    catalogueField.style.display = '.style.display = 'block';
   block';
    catalogues.forEach(cat catalogues.forEach(cat => {
      => {
      const opt = document const opt = document.createElement('option');.createElement('option');
      opt.value
      opt.value = cat.id; = cat.id; opt.textContent = cat opt.textContent = cat.name;
     .name;
      catalogueSelect.appendChild(opt catalogueSelect.appendChild(opt);
    }););
    });
  }

  }
}

// ---}

// --- Movement System ---
 Movement System ---
function getfunction getMovementCount() {MovementCount() {
  return movements
  return movementsContainer.querySelectorAll('.movementContainer.querySelectorAll('.movement-outline').length;-outline').length;
}

function
}

function re renumberMovements() {
numberMovements() {
  const outlines =  const outlines = movementsContainer.querySelectorAll('. movementsContainer.querySelectorAll('.movement-outline');
movement-outline');
  outlines.forEach((  outlines.forEach((outline, i)outline, i) => {
 => {
    outline.dataset.movementIndex    outline.dataset.movementIndex = i;
 = i;
    outline    outline.querySelector('.movement-title-label').textContent =.querySelector('.movement-title-label').textContent = `Movement No. `Movement No. ${i +  ${i + 1}`;
1}`;
  });
   });
  updateDeleteButtonStates updateDeleteButtonStates();
}();
}

function updateDelete

function updateDeleteButtonStates() {ButtonStates() {
  const count
  const count = getMovementCount = getMovementCount();
  movements();
  movementsContainer.querySelectorAll('.movementContainer.querySelectorAll('.movement-delete-btn').forEach-delete-btn').forEach(btn => {
(btn => {
    if (count    if (count <= 4) <= 4) {
      btn {
      btn.classList.add('locked.classList.add('locked');
    }');
    } else {
      else {
      btn.classList.remove(' btn.classList.remove('locked');
   locked');
    }
  }); }
  });
}

function
}

function attachExpansionListener(out attachExpansionListener(outline) {
line) {
  const inputs =  const inputs = outline.querySelectorAll('input outline.querySelectorAll('input, select, button, select, button.m.movement-file-picker');ovement-file-picker');
  const
  const handler = () => handler = () => {
    const {
    const outlines = movementsContainer outlines = movementsContainer.querySelectorAll('.movement-outline.querySelectorAll('.movement-outline');
    const');
    const lastOutline = outlines lastOutline = outlines[outlines.length -[outlines.length - 1];
 1];
    if (outline    if (outline === lastOutline) === lastOutline) {
      add {
      addMovementOutline();
MovementOutline();
    }
       }
    // Remove listeners // Remove listeners after first trigger to after first trigger to prevent prevent duplicate expansion
    inputs.forEach(inp duplicate expansion
    inputs.forEach(inp => inp.removeEventListener(' => inp.removeEventListener('input', handler));input', handler));
    inputs.forEach
    inputs.forEach(inp => inp.removeEventListener(inp => inp.removeEventListener('change', handler('change', handler));
    inputs));
    inputs.forEach(inp => inp.forEach(inp => inp.removeEventListener('click',.removeEventListener('click', handler));
  handler));
  };
  inputs };
  inputs.forEach(inp => {.forEach(inp => {
   
    inp.addEventListener('input inp.addEventListener('input', handler);
', handler);
    inp.addEventListener('    inp.addEventListener('change', handler);change', handler);
    if (
    if (inp.classListinp.classList.contains('movement-file.contains('movement-file-picker')) {
-picker')) {
      inp.addEventListener('      inp.addEventListener('click', handler);click', handler);
    }

    }
  });
}  });
}

function createMovement

function createMovementKeyKeySigDropdown(movementSigDropdown(movementId) {Id) {
  const wrapper = document.createElement('
  const wrapper = document.createElement('div');
 div');
  wrapper.style.position = wrapper.style.position = 'relative';

 'relative';

  const trigger =  const trigger = document.createElement('button');
  trigger document.createElement('button');
  trigger.type = 'button.type = 'button';
  trigger';
  trigger.className = 'movement.className = 'movement-key-sig-trigger-key-sig-trigger placeholder';
  placeholder';
  trigger.textContent = ' trigger.textContent = 'Select Key Signature';Select Key Signature';
  trigger.dataset
  trigger.dataset.field = 'key.field = 'keySig';

 Sig';

  const dropdown = document const dropdown = document.createElement('div');.createElement('div');
  dropdown.className
  dropdown.className = 'key-s = 'key-sig-dropdown';

  const standardListig-dropdown';

  const standardList = document.createElement(' = document.createElement('div');
 div');
  STANDARD_KEYS.forEach(key STANDARD_KEYS.forEach(key => {
    => {
    const opt = document const opt = document.createElement('div');.createElement('div');
    opt.className
    opt.className = 'key-s = 'key-sig-option';
ig-option';
    opt.textContent =    opt.textContent = key;
    key;
    opt.addEventListener('click opt.addEventListener('click', (e)', (e) => {
      => {
      e.stopPropagation();
 e.stopPropagation();
      trigger.textContent =      trigger.textContent = key;
      key;
      trigger.classList.remove(' trigger.classList.remove('placeholder');
     placeholder');
      trigger.dataset.value trigger.dataset.value = key;
 = key;
      dropdown.classList.remove      dropdown.classList.remove('active');
('active');
    });
       });
    standardList.appendChild(opt);
  }); standardList.appendChild(opt);
  });

  const toggle

  const toggle = document.createElement(' = document.createElement('div');
 div');
  toggle.className = ' toggle.className = 'key-sig-toggle';
  togglekey-sig-toggle';
  toggle.innerHTML = '<span.innerHTML = '<span class="arrow"> class="arrow">▸</span▸</span> Obscure> Obscure or Theoretical Keys or Theoretical Keys';

';

  const obscureList  const obscureList = document.createElement(' = document.createElement('div');
 div');
  obscureList.className = obscureList.className = 'key-sig 'key-sig-obscure';-obscure';
  OBSC
  OBSCURE_KEYS.forEach(keyURE_KEYS.forEach(key => {
    => {
    const opt = document const opt = document.createElement('div');.createElement('div');
    opt.className
    opt.className = 'key-s = 'key-sig-option';
ig-option';
    opt.textContent =    opt.textContent = key;
    key;
    opt.addEventListener('click opt.addEventListener('click', (e)', (e) => {
      => {
      e.stopPropagation();
 e.stopPropagation();
      trigger.textContent =      trigger.textContent = key;
      key;
      trigger.classList.remove(' trigger.classList.remove('placeholder');
     placeholder');
      trigger.dataset.value = trigger.dataset.value = key;
      key;
      dropdown.classList.remove(' dropdown.classList.remove('active');
   active');
    });
    obscure });
    obscureList.appendChild(opt);List.appendChild(opt);
  });


  });

  toggle.addEventListener('  toggle.addEventListener('click', (eclick', (e) => {
) => {
    e.stopPropagation();    e.stopPropagation();
    toggle.classList
    toggle.classList.toggle('expanded');.toggle('expanded');
    obscureList.classList.toggle('visible');
  });

  dropdown.appendChild(standardList);
  dropdown.appendChild(toggle);

    obscureList.classList.toggle('visible');
  });

  dropdown.appendChild(standardList);
  dropdown.appendChild(toggle);
  dropdown.appendChild(obscureList);  dropdown.appendChild(obscureList);

  trigger.addEventListener

  trigger.addEventListener('click', (('click', (e) => {e) => {
    e.stopPropagation
    e.stopPropagation();
    //();
    // Close all other Close all other movement key sig dropdowns
    document movement key sig dropdowns
    document.querySelectorAll('.movement-outline.querySelectorAll('.movement-outline .key-sig .key-sig-dropdown.active').forEach-dropdown.active').forEach(d => {
(d => {
      if (d      if (d !== dropdown) d !== dropdown) d.classList.remove('active.classList.remove('active');
    });');
    });
    const rect
    const rect = trigger.getBoundingClientRect(); = trigger.getBoundingClientRect();
    dropdown.style
    dropdown.style.top = `<LaTex>id_15</LaTex>{rect.bottom + 4.bottom + 4}px`;
   }px`;
    dropdown.style.left = dropdown.style.left = `<LaTex>id_16</LaTex>{rect.left}px`;
    dropdown`;
    dropdown.style.width = `<LaTex>id_17</LaTex>{Math.max(rect.widthMath.max(rect.width, 26, 260)}px`;0)}px`;
    dropdown.classList
    dropdown.classList.toggle('active');.toggle('active');
  });


  });

  wrapper.appendChild(trigger);
  wrapper  wrapper.appendChild(trigger);
  wrapper.appendChild(dropdown);.appendChild(dropdown);
  return wrapper
  return wrapper;
}

;
}

function addMovementOutlinefunction addMovementOutline() {
 () {
  movementCounter++;
 movementCounter++;
  const count =  const count = getMovementCount() getMovementCount() + 1; + 1;
  const outline
  const outline = document.createElement(' = document.createElement('div');div');
  outline.className
  outline.className = 'movement-outline = 'movement-outline';
  outline';
  outline.dataset.movementIndex.dataset.movementIndex = count -  = count - 1;

 1;

  // Header
  // Header
  const header = document const header = document.createElement('div');.createElement('div');
  header.className
  header.className = 'movement-header = 'movement-header';

  const';

  const titleLabel = document.createElement titleLabel = document.createElement('span');
('span');
  titleLabel.className =  titleLabel.className = 'movement-title-label 'movement-title-label';
  titleLabel';
  titleLabel.textContent = `Movement.textContent = `Movement No. ${count No. ${count}`;

 }`;

  const actions = document const actions = document.createElement('div');.createElement('div');
  actions.className
  actions.className = 'movement-actions = 'movement-actions';

  const';

  const resetBtn = document resetBtn = document.createElement('button');
  resetBtn.createElement('button');
  resetBtn.type = 'button';
  reset.type = 'button';
  resetBtn.className = 'Btn.className = 'movement-reset-btn';movement-reset-btn';
  resetBtn
  resetBtn.textContent = 'Reset.textContent = 'Reset';
  reset';
  resetBtn.addEventListener('clickBtn.addEventListener('click', () => {', () => {
    outline
    outline.querySelectorAll('input[type.querySelectorAll('input[type="text="text"], input[type=""], input[type="number"]').forEach(inpnumber"]').forEach(inp => inp.value = => inp.value = '');
    const '');
    const ksTrigger = outline.querySelector('.movement-key ksTrigger = outline.querySelector('.movement-key-sig-trigger');-sig-trigger');
    if
    if (ksTrigger) (ksTrigger) { ksTrigger.textContent { ksTrigger.textContent = 'Select Key = 'Select Key Signature'; ksTrigger Signature'; ksTrigger.classList.add('placeholder.classList.add('placeholder'); delete'); delete ksTrigger.dataset.value ksTrigger.dataset.value; }
   ; }
    const fileInput = const fileInput = outline.querySelector('input outline.querySelector('input[type="file"][type="file"]');
    if');
    if (fileInput) (fileInput) fileInput.value = fileInput.value = '';
    const '';
    const fileName = fileName = outline.querySelector('.movement outline.querySelector('.movement-file-name');
-file-name');
    if (fileName    if (fileName) fileName.textContent =) fileName.textContent = '';
  }); '';
  });

  const delete

  const deleteBtn = document.createElementBtn = document.createElement('button');
('button');
  deleteBtn.type  deleteBtn.type = 'button'; = 'button';
  deleteBtn
  deleteBtn.className = 'movement.className = 'movement-delete-btn locked';-delete-btn locked';
  deleteBtn
  deleteBtn.textContent = '.textContent = '✕';
 ✕';
  deleteBtn.addEventListener(' deleteBtn.addEventListener('click', () =>click', () => {
    if {
    if (getMovementCount (getMovementCount() <= 4() <= 4) return;
) return;
    outline.remove();    outline.remove();
    renumber
    renumberMovements();
Movements();
  });

   });

  actions.appendChild(reset actions.appendChild(resetBtn);
 Btn);
  actions.appendChild(deleteBtn actions.appendChild(deleteBtn);
  header);
  header.appendChild(titleLabel);.appendChild(titleLabel);
  header.appendChild
  header.appendChild(actions);
 (actions);
  outline.appendChild(header); outline.appendChild(header);

  // Title

  // Title field field
  const titleLabelEl
  const titleLabelEl = document.createElement(' = document.createElement('label');
 label');
  titleLabelEl.className = titleLabelEl.className = 'movement-field-label 'movement-field-label';
  titleLabelEl.textContent = '';
  titleLabelEl.textContent = 'Movement Title';
Movement Title';
  const titleInput  const titleInput = document.createElement(' = document.createElement('input');
 input');
  titleInput.type = titleInput.type = 'text';
 'text';
  titleInput.className = 'movement-input  titleInput.className = 'movement-input';
  title';
  titleInput.placeholder = 'Input.placeholder = 'Optional';
 Optional';
  titleInput.autocomplete titleInput.autocomplete = 'off'; = 'off';
  titleInput
  titleInput.dataset.field = '.dataset.field = 'title';
 title';
  outline.appendChild(titleLabel outline.appendChild(titleLabelEl);
 El);
  outline.appendChild(titleInput outline.appendChild(titleInput);

  //);

  // Description field
  const descLabel = Description field
  const descLabel = document.createElement('label document.createElement('label');
  desc');
  descLabel.className = 'Label.className = 'movement-field-label';movement-field-label';
  descLabel
  descLabel.textContent = 'Program.textContent = 'Programmatic Description';
matic Description';
  const descInput  const descInput = document.createElement(' = document.createElement('input');
 input');
  descInput.type = descInput.type = 'text';
 'text';
  descInput.className  descInput.className = 'movement-input = 'movement-input';
  desc';
  descInput.placeholder = 'Input.placeholder = 'Optional';
 Optional';
  descInput.autocomplete descInput.autocomplete = 'off'; = 'off';
  descInput
  descInput.dataset.field = '.dataset.field = 'description';
 description';
  outline.appendChild(descLabel outline.appendChild(descLabel);
  outline);
  outline.appendChild(descInput);.appendChild(descInput);

  // Key

  // Key Signature
  const Signature
  const ks ksLabel = document.createElementLabel = document.createElement('label');
('label');
  ksLabel.className  ksLabel.className = 'movement-field = 'movement-field-label';
 -label';
  ksLabel.textContent = ksLabel.textContent = 'Key Signature'; 'Key Signature';
  outline
  outline.appendChild(ksLabel.appendChild(ksLabel);
  outline);
  outline.appendChild(createMovementKey.appendChild(createMovementKeySigDropdown(countSigDropdown(count));

  //));

  // Audio File Picker
 Audio File Picker
  const fileLabel  const fileLabel = document.createElement(' = document.createElement('label');
 label');
  fileLabel.className = fileLabel.className = 'movement-field-label 'movement-field-label';
  file';
  fileLabel.textContent = 'Label.textContent = 'Audio File *';Audio File *';
  const file
  const filePickerPicker = document.createElement(' = document.createElement('input');
 input');
  filePicker.type = filePicker.type = 'file';
 'file';
  filePicker.accept  filePicker.accept = '.mp3 = '.mp3,.aac,.wav,.aac,.wav,.aiff,.,.aiff,.flac,.alflac,.alac,aac,audio/mpeg,audio/mpeg,audio/mp3,audio/mp3,audio/aac,audio/aac,audio/wav,audio/wav,audio/flac,audio/flac,audio/aiff,audio/aiff,audio/alac';udio/alac';
  filePicker
  filePicker.className = 'movement.className = 'movement-file-picker';
-file-picker';
  filePicker.dataset  filePicker.dataset.field = 'audio.field = 'audioFile';
 File';
  const fileNameDisplay = const fileNameDisplay = document.createElement('div document.createElement('div');
  fileName');
  fileNameDisplay.className = 'Display.className = 'movement-file-name';movement-file-name';
  filePicker
  filePicker.addEventListener('change',.addEventListener('change', () => {
 () => {
    fileNameDisplay.textContent    fileNameDisplay.textContent = filePicker.files = filePicker.files.length > 0.length > 0 ? filePicker.files ? filePicker.files[0].name[0].name : '';
  : '';
  });
  outline });
  outline.appendChild(fileLabel);.appendChild(fileLabel);
  outline.appendChild
  outline.appendChild(filePicker);
(filePicker);
  outline.appendChild(fileName  outline.appendChild(fileNameDisplay);

 Display);

  movementsContainer.appendChild(out movementsContainer.appendChild(outline);
 line);
  attachExpansionListener(out attachExpansionListener(outline);
 line);
  updateDeleteButtonStates updateDeleteButtonStates();
}

();
}

function initializefunction initializeMovements() {Movements() {
  movementsContainer
  movementsContainer.innerHTML = '';
.innerHTML = '';
  movementCounter =  movementCounter = 0;
 0;
  for (let  for (let i = 0 i = 0; i < ; i < 4; i++)4; i++) {
    add {
    addMovementOutline();
MovementOutline();
  }
}  }
}

// --- Piece

// --- Piece Save ---
async Save ---
async function handlePieceSave function handlePieceSave() {
 () {
  const title = piece const title = pieceTitleInput.value.trimTitleInput.value.trim();
  const();
  const subtitle = pieceSubtitle subtitle = pieceSubtitleInput.value.trim();Input.value.trim();
  const op
  const opusNum = opusNum = opusNumberInput.valueusNumberInput.value.trim() ? parseInt.trim() ? parseInt(opusNumberInput(opusNumberInput.value, 1.value, 10) : null0) : null;
  const;
  const pieceNum = piece pieceNum = pieceNumberInput.value.trimNumberInput.value.trim() ? parseInt(piece() ? parseInt(pieceNumberInput.value,NumberInput.value, 10) 10) : null;

  if (!title : null;

  if (!title) { pieceStatus) { pieceStatusEl.textContent = 'El.textContent = 'Piece title is requiredPiece title is required.'; return;.'; return; }
  if (!selectedComposerId }
  if (!selectedComposerId) { pieceStatus) { pieceStatusEl.textContent = 'El.textContent = 'Composer is required.'Composer is required.'; return; }; return; }

  // Validate

  // Validate at least one at least one movement has an audio movement has an audio file
  file
  const outlines = movements const outlines = movementsContainer.querySelectorAll('.movementContainer.querySelectorAll('.movement-outline');
 -outline');
  const movementsWithAudio const movementsWithAudio = [];
  = [];
  outlines.forEach(( outlines.forEach((outline, i)outline, i) => {
    => {
    const fileInput = const fileInput = outline.querySelector('input outline.querySelector('input[type="file"][type="file"]');
    if');
    if (fileInput && (fileInput && fileInput.files.length fileInput.files.length > 0) > 0) {
      movements {
      movementsWithAudio.push({WithAudio.push({ outline, index: outline, index: i, file: i, file: fileInput fileInput.files[0].files[0] });
    } });
    }
  });

  if (mov
  });

  if (movementsWithAudio.lengthementsWithAudio.length === 0) === 0) {
    piece {
    pieceStatusEl.textContent =StatusEl.textContent = 'At least one 'At least one movement must have an movement must have an audio file.'; audio file.';
    return;
    return;
  }


  }

  // Determine catalogue  // Determine catalogue reference
  let reference
  let catalogueId = null catalogueId = null;
  let;
  let catalogueNumber = null catalogueNumber = null;
  if;
  if (catalogueAuto (catalogueAutoField.style.display ===Field.style.display === 'block') { 'block') {
    catalogueId
    catalogueId = parseInt(catalog = parseInt(catalogueAutoName.datasetueAutoName.dataset.catalogueId,.catalogueId, 10); 10);
    const num
    const numVal = catalogueAutoVal = catalogueAutoNumber.value.trim();Number.value.trim();
    catalogueNumber
    catalogueNumber = numVal ? = numVal ? parseInt(numVal, parseInt(numVal, 10) 10) : null;
 : null;
  } else if  } else if (catalogueField (catalogueField.style.display === '.style.display === 'block') {
block') {
    const selVal    const selVal = catalogueSelect.value = catalogueSelect.value;
    if;
    if (selVal) (selVal) {
      catalogue {
      catalogueId = parseInt(selId = parseInt(selVal, 1Val, 10);
     0);
      const numVal = const numVal = catalogueNumberInput.value catalogueNumberInput.value.trim();
     .trim();
      catalogueNumber = num catalogueNumber = numVal ? parseInt(numVal ? parseInt(numVal, 1Val, 10) : null0) : null;
    };
    }
  }


  }

  try {
  try {
    const pieceId    const pieceId = await savePiece = await savePiece({
      title({
      title,
      subtitle,
      subtitle: subtitle || null: subtitle || null,
      composer,
      composerId: selectedComposerId: selectedComposerId,
     Id,
      keySignature: selected keySignature: selectedKeySignature || nullKeySignature || null,
      op,
      opusNumber: opusNumber: opusNum,
usNum,
      pieceNumber:      pieceNumber: pieceNum,
 pieceNum,
      catalogueId,      catalogueId,
      catalogueNumber
      catalogueNumber
    });


    });

    // Save each    // Save each movement with audio
 movement with audio
    let saved    let savedCount = 0Count = 0;
    for;
    for (const mov of (const mov of movementsWithAudio) movementsWithAudio) {
      const {
      const outline = mov.out outline = mov.outline;
     line;
      const mov const movTitle = outline.querySelectorTitle = outline.querySelector('[data-field="('[data-field="title"]').value.trimtitle"]').value.trim();
();
      const movDesc      const movDesc = outline.querySelector('[ = outline.querySelector('[data-field="descriptiondata-field="description"]').value.trim();"]').value.trim();
      const ks
      const ksTrigger = outline.querySelectorTrigger = outline.querySelector('.movement-key-s('.movement-key-sig-trigger');
ig-trigger');
      const movKey      const movKeySigSig = ksTrigger && = ksTrigger && ksTrigger.dataset.value ksTrigger.dataset.value ? ksTrigger.dataset ? ksTrigger.dataset.value : null;.value : null;

      await save

      await saveMovement({
       Movement({
        pieceId,
 pieceId,
        movementNumber:        movementNumber: savedCount +  savedCount + 1,
       1,
        title: movTitle title: movTitle || null,
 || null,
        description: movDesc || null,        description: movDesc || null,
        keySignature
        keySignature: movKeySig: movKeySig,
        audio,
        audioBlob: mov.fileBlob: mov.file,
        duration,
        duration: null
     : null
      });
      saved });
      savedCount++;
Count++;
    }

       }

    // Reset form
 // Reset form
    pieceTitleInput    pieceTitleInput.value = '';
.value = '';
    pieceSubtitleInput    pieceSubtitleInput.value = '';
.value = '';
    opusNumberInput.value = '';    opusNumberInput.value = '';
    pieceNumber
    pieceNumberInput.value = '';Input.value = '';
    catalogueNumber
    catalogueNumberInput.value = '';Input.value = '';
    catalogueAuto
    catalogueAutoNumber.value = '';Number.value = '';
    selectedKey
    selectedKeySignature = null;Signature = null;
    keySig
    keySigTrigger.textContent = 'Trigger.textContent = 'Select Key Signature';Select Key Signature';
    keySig
    keySigTrigger.classList.add('Trigger.classList.add('placeholder');
   placeholder');
    catalogueField.style.display catalogueField.style.display = 'none'; = 'none';
    catalogueAuto
    catalogueAutoField.style.display =Field.style.display = 'none';
 'none';
    initializeMovements    initializeMovements();

    piece();

    pieceStatusEl.textContent =StatusEl.textContent = `<LaTex>id_18</LaTex>{savedCount} Piece${savedCount Piece${savedCount > 1 ? > 1 ? 's' : 's' : ''} Added! ''} Added!`;
  }`;
  } catch (e) catch (e) {
    console {
    console.error(e);
.error(e);
    pieceStatusEl    pieceStatusEl.textContent = 'Error.textContent = 'Error saving piece.'; saving piece.';
  }

  }
}

// ---}

// --- Library ---
function Library ---
function renderLibrary(songs renderLibrary(songs) {
 ) {
  const el = document const el = document.getElementById('library-list.getElementById('library-list');
  el');
  el.innerHTML = '';
.innerHTML = '';
  if (!songs  if (!songs.length) {
.length) {
    el.innerHTML =    el.innerHTML = '<li style="text-align:center;padding '<li style="text-align:center;padding:20px:20px;color:#6e;color:#6e6e736e73;">No songs imported;">No songs imported yet.<br> yet.<br><br>Tap "<br>Tap "Add Music" toAdd Music" to get started.</li get started.</li>';
    return>';
    return;
  };
  }
  songs.forEach
  songs.forEach(s => {
(s => {
    const li =    const li = document.createElement('li document.createElement('li');
    li');
    li.className = 'song.className = 'song-item';
   -item';
    const d = s const d = s.duration !== null ?.duration !== null ? secondsToDecimalMM secondsToDecimalMMSS(s.duration)SS(s.duration) : 'Loading... : 'Loading...';
    li';
    li.innerHTML = `<div.innerHTML = `<div class="song-info class="song-info"><span class=""><span class="song-name">${ssong-name">${s.name}</span>.name}</span><span class="song<span class="song-duration">${d}</-duration">${d}</span></div>`span></div>`;
    li;
    li.addEventListener('touchstart.addEventListener('touchstart', () => {', () => {
      li.classList
      li.classList.add('pressing.add('pressing');
      long');
      longPressTimer = setTimeoutPressTimer = setTimeout(() => {
(() => {
        if (navigator        if (navigator.vibrate) navigator.vibrate) navigator.vibrate(1.vibrate(15);
       5);
        li.classList.remove(' li.classList.remove('pressing');
pressing');
        showContextMenu(s        showContextMenu(s.id, s.name.id, s.name, li);
, li);
      }, 400);
      }, 400);
    });
       });
    li.addEventListener('touch li.addEventListener('touchend', () => { clearTimeout(longPressend', () => { clearTimeout(longPressTimer); li.classListTimer); li.classList.remove('pressing.remove('pressing'); });
   '); });
    li.addEventListener('touch li.addEventListener('touchcancel', () =>cancel', () => { clearTimeout(longPress { clearTimeout(longPressTimer); li.classListTimer); li.classList.remove('pressing.remove('pressing'); });
   '); });
    li.addEventListener('touch li.addEventListener('touchmove', () =>move', () => { clearTimeout(longPress { clearTimeout(longPressTimer); li.classListTimer); li.classList.remove('pressing.remove('pressing'); });
   '); });
    li.addEventListener('click li.addEventListener('click', () => {', () => {
      if (
      if (activeContextMenu && liactiveContextMenu && li.classList.contains('menu.classList.contains('menu-open')) { dismiss-open')) { dismissContextMenu(); return;ContextMenu(); return; }
      toggle }
      togglePlayback(s.id);Playback(s.id);
    });

    });
    el.appendChild(li    el.appendChild(li);
  }););
  });
}

//
}

// --- Import (legacy --- Import (legacy) ---
async) ---
async function handleImport(files function handleImport(files) {
 ) {
  const st = document const st = document.getElementById('status');.getElementById('status');
  if (!
  if (!st) return;st) return;
  st.textContent
  st.textContent = `Importing = `Importing ${files.length} ${files.length} songs...`;
 songs...`;
  try {
  try {
    const ids =    const ids = [];
    for [];
    for (let i = (let i = 0; i < files.length; 0; i < files.length; i++) {
 i++) {
      const id =      const id = await saveSongBlob await saveSongBlob(files[i]);
(files[i]);
      ids.push({      ids.push({ id, file: id, file: files[i] }); files[i] });
      st.textContent
      st.textContent = `Saved <LaTex>id_19</LaTex>{i + 1i + 1}/${files.length}`}/${files.length}`;
    };
    }
    st.textContent
    st.textContent = 'Extracting = 'Extracting metadata...';
 metadata...';
    for (const    for (const { id, file { id, file } of ids) } of ids) await extractAndUpdateDuration await extractAndUpdateDuration(id, file);(id, file);
    st.textContent
    st.textContent = `Import complete = `Import complete! ${files.length! ${files.length} song${files} song${files.length > 1.length > 1 ? 's' ? 's' : ''} added : ''} added.`;
   .`;
    setTimeout(() => switch setTimeout(() => switchTab('library'),Tab('library'), 800 800);
  });
  } catch (e) catch (e) { console.error(e { console.error(e); st.textContent =); st.textContent = 'Error importing songs 'Error importing songs.'; }
.'; }
}

// ---}

// --- Init ---
async Init ---
async function initApp() function initApp() {
  await {
  await initDB();

 initDB();

  playerBar =  playerBar = document.getElementById('player document.getElementById('player-bar');
 -bar');
  playerSongName = playerSongName = document.getElementById('player document.getElementById('player-song-name');
-song-name');
  playerTimes =  playerTimes = document.getElementById('player document.getElementById('player-times');
 -times');
  progressFill = document progressFill = document.getElementById('progress-fill');
  progress.getElementById('progress-fill');
  progressContainer = document.getElementByIdContainer = document.getElementById('progress-container');('progress-container');
  playPause
  playPauseBtn = document.getElementByIdBtn = document.getElementById('play-pause('play-pause-btn');
 -btn');
  renameOverlay = document renameOverlay = document.getElementById('rename-overlay.getElementById('rename-overlay');
  rename');
  renameInput = document.getElementByIdInput = document.getElementById('rename-input');
  renameSave('rename-input');
  renameSave = document.getElementById(' = document.getElementById('rename-save');
rename-save');
  renameCancel =  renameCancel = document.getElementById('rename document.getElementById('rename-cancel');
 -cancel');
  tabLibrary = document tabLibrary = document.getElementById('tab-library.getElementById('tab-library');
  tab');
  tabAdd = document.getElementByIdAdd = document.getElementById('tab-add');('tab-add');
  viewLibrary
  viewLibrary = document.getElementById(' = document.getElementById('view-library');
view-library');
  viewAdd =  viewAdd = document.getElementById('view document.getElementById('view-add');
 -add');
  composerOverlay = document composerOverlay = document.getElementById('composer-overlay.getElementById('composer-overlay');
  comp');
  compFirst = document.getElementByIdFirst = document.getElementById('comp-first');('comp-first');
  compLast
  compLast = document.getElementById(' = document.getElementById('comp-last');
comp-last');
  compCountry =  compCountry = document.getElementById('comp document.getElementById('comp-country');
 -country');
  compBirth = document compBirth = document.getElementById('comp-b.getElementById('comp-birth');
 irth');
  compDeath = document compDeath = document.getElementById('comp-death.getElementById('comp-death');
  catalogueList = document.getElementById');
  catalogueList = document.getElementById('catalogue-list('catalogue-list');
  add');
  addCatalogueBtn =CatalogueBtn = document.getElementById('add document.getElementById('add-catalogue-btn-catalogue-btn');
  composer');
  composerCancel = document.getElementByIdCancel = document.getElementById('composer-cancel');('composer-cancel');
  composerSave = document.getElementById('
  composerSave = document.getElementById('composer-save');
composer-save');
  composerTrigger =  composerTrigger = document.getElementById('composer document.getElementById('composer-trigger');
 -trigger');
  composerDropdown = document composerDropdown = document.getElementById('composer-dropdown.getElementById('composer-dropdown');
  composer');
  composerSearchWrap = documentSearchWrap = document.getElementById('composer-search.getElementById('composer-search-wrap');
 -wrap');
  composerSearchInput = document.getElementById('composer composerSearchInput = document.getElementById('composer-search-input');
-search-input');
  composerListEl  composerListEl = document.getElementById(' = document.getElementById('composer-list');
composer-list');
  composerAddNew  composerAddNewBtn = document.getElementByIdBtn = document.getElementById('composer-add-new('composer-add-new');
  piece');
  pieceTitleInput = documentTitleInput = document.getElementById('piece-title.getElementById('piece-title');
  piece');
  pieceSubtitleInput = documentSubtitleInput = document.getElementById('piece-sub.getElementById('piece-subtitle');
 title');
  keySigTrigger = keySigTrigger = document.getElementById('key document.getElementById('key-sig-trigger');-sig-trigger');
  keySig
  keySigDropdown = document.getElementByIdDropdown = document.getElementById('key-sig('key-sig-dropdown');
 -dropdown');
  keySigStandardList keySigStandardList = document.getElementById(' = document.getElementById('key-sig-standardkey-sig-standard-list');
 -list');
  keySigToggle = keySigToggle = document.getElementById('key document.getElementById('key-sig-toggle');-sig-toggle');
  keySig
  keySigObscureListObscureList = document.getElementById(' = document.getElementById('key-sig-obkey-sig-obscure-list');scure-list');
  opus
  opusNumberInput = documentNumberInput = document.getElementById('opus-number.getElementById('opus-number');
  piece');
  pieceNumberInput = documentNumberInput = document.getElementById('piece-number.getElementById('piece-number');
  catalogue');
  catalogueField = document.getElementById('catalogue-fieldField = document.getElementById('catalogue-field');
  catalogue');
  catalogueSelect = document.getElementByIdSelect = document.getElementById('catalogue-select');
  catalogue('catalogue-select');
  catalogueNumberInput = documentNumberInput = document.getElementById('catalogue.getElementById('catalogue-number');
 -number');
  catalogueAutoField = catalogueAutoField = document.getElementById('catalogue-auto-field'); document.getElementById('catalogue-auto-field');
  catalogueAuto
  catalogueAutoName = document.getElementByIdName = document.getElementById('catalogue-auto('catalogue-auto-name');
 -name');
  catalogueAutoNumber = catalogueAutoNumber = document.getElementById('catalog document.getElementById('catalogue-auto-number');ue-auto-number');
  pieceSave
  pieceSaveBtn = document.getElementByIdBtn = document.getElementById('piece-save-btn('piece-save-btn');
  piece');
  pieceStatusEl = documentStatusEl = document.getElementById('piece-status.getElementById('piece-status');
  movements');
  movementsContainer = document.getElementByIdContainer = document.getElementById('movements-container('movements-container');

  build');

  buildKeySignatureLists();KeySignatureLists();
  initializeMovements();

 
  initializeMovements();

  tabLibrary.onclick = e => { e tabLibrary.onclick = e => { e.stopPropagation(); switchTab.stopPropagation(); switchTab('library'); };('library'); };
  tabAdd
  tabAdd.onclick = e =>.onclick = e => { e.stopPropagation(); { e.stopPropagation(); switchTab('add switchTab('add'); };

 '); };

  composerTrigger.addEventListener(' composerTrigger.addEventListener('click', (e) => {
click', (e) => {
    e.stopPropagation();    e.stopPropagation();
    composerDropdown
    composerDropdown.classList.contains('active') ? closeComposer.classList.contains('active') ? closeComposerDropdown() : openDropdown() : openComposerDropdown();
ComposerDropdown();
  });
   });
  composerSearchInput.addEventListener composerSearchInput.addEventListener('input', (('input', (e) => filtere) => filterComposers(eComposers(e.target.value));
.target.value));
  composerAddNew  composerAddNewBtn.addEventListener('clickBtn.addEventListener('click', () => {', () => { closeComposerDropdown(); closeComposerDropdown(); openComposerModal(); });

  key openComposerModal(); });

  keySigTrigger.addEventListener('SigTrigger.addEventListener('click', (eclick', (e) => {
    e.stopPropagation();) => {
    e.stopPropagation();
    keySig
    keySigDropdown.classList.contains('Dropdown.classList.contains('active') ? closeactive') ? closeKeySigDropdown()KeySigDropdown() : openKeySig : openKeySigDropdown();
 Dropdown();
  });
  key });
  keySigToggle.addEventListener('SigToggle.addEventListener('click', (eclick', (e) => { e) => { e.stopPropagation(); toggleObs.stopPropagation(); toggleObscureKeys();cureKeys(); });

  document });

  document.addEventListener('click',.addEventListener('click', (e) => (e) => {
    if {
    if (composerDropdown.classList (composerDropdown.classList.contains('active').contains('active') && !composerDropdown && !composerDropdown.contains(e.target).contains(e.target) && e.target !== && e.target !== composerTrigger) close composerTrigger) closeComposerDropdown();
ComposerDropdown();
    if (key    if (keySigDropdown.classList.containsSigDropdown.classList.contains('active') &&('active') && !keySigDropdown !keySigDropdown.contains(e.target).contains(e.target) && e.target !== && e.target !== keySigTrigger) keySigTrigger) closeKeySigDropdown closeKeySigDropdown();
    //();
    // Close movement key sig Close movement key sig dropdowns
    dropdowns
    document.querySelectorAll('.movement document.querySelectorAll('.movement-outline .key-s-outline .key-sig-dropdown.active').ig-dropdown.active').forEach(d => {forEach(d => {
      if (!
      if (!d.contains(e.target) && !dd.contains(e.target) && !d.previous.previousElementSibling.contains(e.target)) dElementSibling.contains(e.target)) d.classList.remove('active.classList.remove('active');
    });');
    });
  });


  });

  composerCancel.onclick  composerCancel.onclick = closeComposerModal = closeComposerModal;
  composer;
  composerOverlay.onclick = eOverlay.onclick = e => { if ( => { if (e.target === composere.target === composerOverlay) closeComposerOverlay) closeComposerModal(); };
Modal(); };
  addCatalogue  addCatalogueBtn.onclick = addBtn.onclick = addCatalogueInput;CatalogueInput;
  composerSave
  composerSave.onclick = handleComposer.onclick = handleComposerSave;
 Save;
  pieceSaveBtn pieceSaveBtn.addEventListener('click',.addEventListener('click', handlePieceSave); handlePieceSave);

  renameCancel.onclick = hideRename

  renameCancel.onclick = hideRenameModal;
 Modal;
  renameOverlay.onclick = renameOverlay.onclick = e => { if e => { if (e.target === (e.target === renameOverlay) hide renameOverlay) hideRenameModal(); };RenameModal(); };
  renameSave
  renameSave.onclick = async ().onclick = async () => {
    => {
    const n = rename const n = renameInput.value.trim();Input.value.trim();
    if (
    if (n && renameTargetn && renameTargetId !== null)Id !== null) {
      await {
      await updateSongName(rename updateSongName(renameTargetId, nTargetId, n);
      if);
      if (currentSongId (currentSongId == renameTargetId == renameTargetId) {
       ) {
        playerSongName playerSongName.textContent = n;.textContent = n;
        if ('
        if ('mediaSession' inmediaSession' in navigator) navigator.media navigator) navigator.mediaSession.metadata = newSession.metadata = new MediaMetadata({ title MediaMetadata({ title: n, artist: n, artist: 'Takt: 'Taktwerk', album: 'Local Library'werk', album: 'Local Library' });
      } });
      }
      renderLibrary
      renderLibrary(await loadSongs());(await loadSongs());
    }

    }
    hideRenameModal    hideRenameModal();
  };();
  };
  renameInput.onkeydown = e
  renameInput.onkeydown = e => { if ( => { if (e.key === 'e.key === 'Enter') { eEnter') { e.preventDefault(); renameSave.preventDefault(); renameSave.click(); } if.click(); } if (e.key === (e.key === 'Escape') hide 'Escape') hideRenameModal(); };RenameModal(); };

  progressContainer

  progressContainer.onclick = e =>.onclick = e => {
    if {
    if (!audioPlayer.duration (!audioPlayer.duration) return;
) return;
    const r =    const r = progressContainer.getBoundingClientRect(); progressContainer.getBoundingClientRect();
    audioPlayer
    audioPlayer.currentTime = Math.max.currentTime = Math.max(0, Math(0, Math.min(1,.min(1, (e.clientX - (e.clientX - r.left) / r.left) / r.width)) * r.width)) * audioPlayer.duration; audioPlayer.duration;
  };

  };
  playPauseBtn  playPauseBtn.onclick = () =>.onclick = () => { if (current { if (currentSongId === nullSongId === null) return; audio) return; audioPlayer.paused ? audioPlayer.paused ? audioPlayer.play().catchPlayer.play().catch(console.error) :(console.error) : audioPlayer.pause(); audioPlayer.pause(); };
  audio };
  audioPlayer.ontimePlayer.ontimeupdate = () =>update = () => { if (!audio { if (!audioPlayer.duration) returnPlayer.duration) return; updatePlayerUI; updatePlayerUI(audioPlayer.currentTime,(audioPlayer.currentTime, audioPlayer.duration - audioPlayer.duration - audioPlayer.currentTime, audioPlayer.currentTime, audioPlayer.currentTime / audioPlayer.currentTime / audioPlayer.duration); audioPlayer.duration); };
  audio };
  audioPlayer.onplay =Player.onplay = () => { player () => { playerBar.classList.add('Bar.classList.add('active'); updatePlayactive'); updatePlayPauseIcon(true);PauseIcon(true); };
  audio };
  audioPlayer.onpause =Player.onpause = () => updatePlay () => updatePlayPauseIcon(false);PauseIcon(false);
  audioPlayer
  audioPlayer.onended = ().onended = () => { playerBar => { playerBar.classList.remove('active.classList.remove('active'); currentSongId'); currentSongId = null; update = null; updatePlayPauseIcon(falsePlayPauseIcon(false); loadSongs().); loadSongs().then(renderLibrary);then(renderLibrary); };

  const };

  const ib = document.getElementById ib = document.getElementById('importBtn'),('importBtn'), ap = document.getElementById ap = document.getElementById('audioPicker');('audioPicker');
  if (
  if (ib && ap)ib && ap) { ib.onclick = { ib.onclick = () => ap.click () => ap.click(); ap.onchange(); ap.onchange = async e => = async e => { if (e { if (e.target.files.length >.target.files.length > 0) { 0) { await handleImport(Array await handleImport(Array.from(e.target.files.from(e.target.files)); e.target.value)); e.target.value = ''; } }; = ''; } }; }

  document }

  document.onvisibilitychange =.onvisibilitychange = () => { if () => { if (!document.hidden && (!document.hidden && !audioPlayer.paused !audioPlayer.paused && currentSongId && currentSongId) audioPlayer.play) audioPlayer.play().catch(() =>().catch(() => {}); };

 {}); };

  updatePlayPause  updatePlayPauseIcon(false);
Icon(false);
  renderLibrary(await  renderLibrary(await loadSongs());
 loadSongs());
  console.log('[  console.log('[Taktwerk]Taktwerk] Step 5: Step 5: Dynamic movements ready'); Dynamic movements ready');
}

initApp();
