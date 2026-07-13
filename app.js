// app.js - Tab navigation with Library / Add Music views
import { secondsToDecimalMMSS } from '/taktwerk/takt.js';

const DB_NAME = 'TaktwerkDB';
const DB_VERSION = 1;
const STORE_NAME = 1;
const STORE_NAME = 'songs';

let db;
 'songs';

let db;
let currentSongIdlet currentSongId = null;
 = null;
let longPressTimerlet longPressTimer = null;
 = null;
let activeSongId = null;

let activeSongId = null;

const audioPlayer = new Audio();
const audioPlayer = new Audio();
audioPlayer.preload = 'auto';audioPlayer.preload = 'auto';

const PLAY_ICON = `<svg viewBox

const PLAY_ICON = `<svg viewBox="0 0 24 ="0 0 24 24" fill24" fill="none"><path="none"><path opacity="0.1" d=" opacity="0.1" d="M4 5M4 5.496.49683V183V18.508.5032C4 20.32C4 20.05 505 5.680.68077 21.0177 21.0113 7.01413 7.01404 20.2204 20.227L18.0697L18.0694 13.7234 13.7239C19.3849C19.384 12. 12.95069506 19.384  19.384 11.0494 11.0494 18.0694 18.0694 10.210.2761L7.01761L7.01404 404 3.773.77296C296C5.68077 5.68077 2.98869 2.98869 4 3.95 44 3.95 4 5.4 5.496839683Z" fill="currentColor"/><path dZ" fill="currentColor"/><path d="M4 ="M4 5.495.49683V18.5683V18.5032C4 20032C4 20.05 5.68.05 5.68077 21.0077 21.0113 7.01113 7.01404 20.2404 20.227L127L18.068.0694 194 13.723.7239C19.3839C19.384 124 12.950.9506 196 19.384.384 11.0494 11.0494 18. 18.06940694 10.2761 10.2761L7.01404L7.01404 3.77296 3.77296C5.68077C5.68077 2.9 2.988698869 4 3.95  4 3.95 4 5.49684 5.49683Z" stroke="currentColor" stroke3Z" stroke="currentColor" stroke-width="2" stroke-linecap="-width="2" stroke-linecap="round" stroke-linejoin="round"/></round" stroke-linejoin="round"/></svg>`;
svg>`;
const PAUSE_ICONconst PAUSE_ICON = `<svg viewBox="0 0 = `<svg viewBox="0 0 24  24 24" fill24" fill="none"><path opacity="0.="none"><path opacity="0.1" d="1" d="M14 M14 19L14 5C19L14 5C14 314 3.895.89543 14.8943 14.8954 3 16 54 3 16 3L17 3C13L17 3C18.108.1046 346 3 19  19 3.893.89543 19 5543 19 5L19 L19 19C119C19 20.1049 20.1046 186 18.104.1046 21 17 6 21 17 21L121L16 216 21C14.C14.89548954 21 14 2 21 14 20.1046 10.1046 14 19Z" fill="4 19Z" fill="currentColor"/><path opacity="0.1currentColor"/><path opacity="0.1" d="M10 1" d="M10 19L10 5C19L10 5C10 3.89540 3.89543 9.3 9.104510457 3 8 3L7 3 8 3L7 3C5.897 3C5.89543 3 5 543 3 5 3.89543 3.89543 5 5L5 5L5 195 19C5 20.10C5 20.1046 5.89546 5.89543 21 7 43 21 7 21L8 21C21L8 21C9.10457 9.10457 21 10 2021 10 20.1046 10.1046 10 19Z 19Z" fill="currentColor" fill="currentColor"/><path d="M14 "/><path d="M14 19L14 5C19L14 5C14 3.89514 3.89543 143 14.894.8954 354 3 16  16 3L17 3C13L17 3C18.1046 38.1046 3 19  19 3.893.89543 19 5543 19 5L19 L19 19C119C19 20.1049 20.1046 18.1046 18.1046 21 17 6 21 17 21L121L16 216 21C14.C14.89548954 21  21 14 214 20.100.1046 146 14 194 19Z" stroke="Z" stroke="currentColor" stroke-widthcurrentColor" stroke-width="2" stroke="2" stroke-linecap="round-linecap="round" stroke-linejoin" stroke-linejoin="round"/><path d="M1="round"/><path d="M10 19L0 19L10 5C10 10 5C10 3.89543 3.89543 9.109.10457 457 3 8 3L7 3 8 3L7 3C5.89543C5.89543 3 3 3 5 3.5 3.895489543 5 3 5 5L5 19C55L5 19C5 20.1046 20.1046 5.89543 5.89543 21  21 7 217 21L8 2L8 21C9.1C9.104510457 21 10 20.1046 10 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="7 21 10 20.1046 10 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-lineround" stroke-linejoin="round"/></join="round"/></svg>`;

svg>`;

let playerBar,let playerBar, playerSongName, playerSongName, playerTimes, progress playerTimes, progressFill, progressContainer, playPauseBtnFill, progressContainer, playPauseBtn;
let actionOverlay, actionSheet;
let actionOverlay, actionSheetTitle, actionRename, actionDelete,Title, actionRename, actionDelete, actionCancel;
let renameOverlay, actionCancel;
let renameOverlay, renameInput, renameSave, renameCancel renameInput, renameSave, renameCancel;
let tabLibrary, tabAdd;
let tabLibrary, tabAdd, viewLibrary, viewAdd;

, viewLibrary, viewAdd;

async function initDB() {
 async function initDB() {
  return new Promise((resolve, reject) return new Promise((resolve, reject) => {
    => {
    const request = indexed const request = indexedDB.open(DB_NAMEDB.open(DB_NAME, DB_VERSION);, DB_VERSION);
    request.on
    request.onupgradeneededupgradeneeded = (event) => {
      = (event) => {
      const db = event const db = event.target.result;
.target.result;
      if (!db.objectStoreNames.contains      if (!db.objectStoreNames.contains(STORE_NAME))(STORE_NAME)) {
        db {
        db.createObjectStore(STORE_NAME, { key.createObjectStore(STORE_NAME, { keyPath: 'idPath: 'id', autoIncrement:', autoIncrement: true });
      true });
      }
    };
    request.onsuccess = ( }
    };
    request.onsuccess = (event) => {event) => { db = event.target db = event.target.result; resolve(db); };
   .result; resolve(db); };
    request.onerror = (event) => reject request.onerror = (event) => reject(event.target.error);
  });
(event.target.error);
  });
}

async function}

async function saveSongBlob(file saveSongBlob(file) {
  return new Promise(() {
  return new Promise((resolve, reject) => {
   resolve, reject) => {
    const transaction = db const transaction = db.transaction([STORE_NAME.transaction([STORE_NAME], 'readwrite');
    const], 'readwrite');
    const store = transaction.object store = transaction.objectStore(STORE_NAMEStore(STORE_NAME);
    const songData = {);
    const songData = { name: file.name, blob: file name: file.name, blob: file, duration: null, duration: null, addedAt:, addedAt: Date.now() }; Date.now() };
    const add
    const addRequest = store.addRequest = store.add(songData);
(songData);
    addRequest.onsuccess = ()    addRequest.onsuccess = () => resolve(addRequest => resolve(addRequest.result);
   .result);
    addRequest.onerror = () => reject(add addRequest.onerror = () => reject(addRequest.error);
  });
}Request.error);
  });
}

async function updateSongName(songId

async function updateSongName(songId, newName) {
  return new, newName) {
  return new Promise((resolve, reject) => { Promise((resolve, reject) => {
    const transaction = db.transaction([
    const transaction = db.transaction([STORE_NAME], 'STORE_NAME], 'readwrite');
readwrite');
    const store = transaction.objectStore(ST    const store = transaction.objectStore(STORE_NAME);
    const getRequest =ORE_NAME);
    const getRequest = store.get(songId);
    getRequest store.get(songId);
    getRequest.onsuccess = () => {
.onsuccess = () => {
      const song = getRequest.result;
      const song = getRequest.result;
      if (song) {
             if (song) {
        song.name = newName;
        const song.name = newName;
        const putRequest = store putRequest = store.put(song);
.put(song);
        putRequest.onsuccess = ()        putRequest.onsuccess = () => resolve();
 => resolve();
        putRequest.onerror        putRequest.onerror = () => reject = () => reject(putRequest.error(putRequest.error);
      });
      }
    };

    };
    getRequest.onerror =    getRequest.onerror = () => reject(get () => reject(getRequest.error);
Request.error);
  });
}  });
}

async function delete

async function deleteSong(songId)Song(songId) {
  return {
  return new Promise((resolve new Promise((resolve, reject) =>, reject) => {
    const {
    const transaction = db.transaction transaction = db.transaction([STORE_NAME],([STORE_NAME], 'readwrite'); 'readwrite');
    const store
    const store = transaction.objectStore = transaction.objectStore(STORE_NAME);(STORE_NAME);
    const request
    const request = store.delete(song = store.delete(songId);
   Id);
    request.onsuccess request.onsuccess = () => resolve = () => resolve();
    request();
    request.onerror = () =>.onerror = () => reject(request.error); reject(request.error);
  });

  });
}

async function}

async function extractAndUpdateDuration(song extractAndUpdateDuration(songId, file)Id, file) {
  try {
  try {
    const {
    const tempAudio = new tempAudio = new Audio();
    Audio();
    tempAudio.src = tempAudio.src = URL.createObjectURL(file URL.createObjectURL(file);
    const);
    const duration = await new duration = await new Promise((resolve, Promise((resolve, reject) => { reject) => {
      tempAudio
      tempAudio.onloadedmetadata =.onloadedmetadata = () => { URL () => { URL.revokeObjectURL.revokeObjectURL(tempAudio.src);(tempAudio.src); resolve(tempAudio.duration resolve(tempAudio.duration); };
     ); };
      tempAudio.onerror = tempAudio.onerror = () => { URL () => { URL.revokeObjectURL.revokeObjectURL(tempAudio.src);(tempAudio.src); reject(new Error(' reject(new Error('Metadata load failed'));Metadata load failed')); };
    }); };
    });
    const transaction
    const transaction = db.transaction([ = db.transaction([STORE_NAME], 'STORE_NAME], 'readwrite');
readwrite');
    const store =    const store = transaction.objectStore(ST transaction.objectStore(STORE_NAME);
ORE_NAME);
    const getRequest =    const getRequest = store.get(songId store.get(songId);
    getRequest);
    getRequest.onsuccess = () => {
.onsuccess = () => {
      const song =      const song = getRequest.result;
 getRequest.result;
      if (song) { song.duration      if (song) { song.duration = duration; store.put(song); } = duration; store.put(song); }
    };

    };
    const songs =    const songs = await loadSongs();
    renderLibrary await loadSongs();
    renderLibrary(songs);
  } catch ((songs);
  } catch (e) { console.warn(`Could note) { console.warn(`Could not extract duration for <LaTex>id_1</LaTex>{file.name}:`, e); }
}

async function e); }
}

async function loadSongs() { loadSongs() {
  return new
  return new Promise((resolve, reject) => { Promise((resolve, reject) => {
    const transaction = db.transaction([
    const transaction = db.transaction([STORE_NAME], 'readonly');
   STORE_NAME], 'readonly');
    const store = transaction const store = transaction.objectStore(STORE.objectStore(STORE_NAME);
   _NAME);
    const request = store const request = store.getAll();
   .getAll();
    request.onsuccess request.onsuccess = () => resolve(request.result);
 = () => resolve(request.result);
    request.onerror = () => reject(request    request.onerror = () => reject(request.error);
  });
}

.error);
  });
}

// --- Tab Switching ---
function// --- Tab Switching ---
function switchTab(tab) {
  if switchTab(tab) {
  if (tab === 'library') {
 (tab === 'library') {
    tabLibrary.classList.add('active');    tabLibrary.classList.add('active');
    tabAdd
    tabAdd.classList.remove('active');
    viewLibrary.classList.add('.classList.remove('active');
    viewLibrary.classList.add('active');
    viewAdd.classListactive');
    viewAdd.classList.remove('active');
    viewAdd.remove('active');
    viewAdd.style.display = 'none';
   .style.display = 'none';
    // Refresh library when switching to // Refresh library when switching to it
    loadSongs().then(s it
    loadSongs().then(songs => renderLibraryongs => renderLibrary(songs));
(songs));
  } else {  } else {
    tabAdd
    tabAdd.classList.add('active');
.classList.add('active');
    tabLibrary.classList.remove('active');    tabLibrary.classList.remove('active');
    viewLibrary.classList.remove('active
    viewLibrary.classList.remove('active');
    view');
    viewAdd.classList.add('active');
    viewAdd.style.displayAdd.classList.add('active');
    viewAdd.style.display = 'flex';
  }
 = 'flex';
  }
}

// ---}

// --- Player UI --- Player UI ---
function updatePlayer
function updatePlayerUI(elapsed,UI(elapsed,
