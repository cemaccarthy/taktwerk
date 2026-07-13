// app.js - Fixed instant tab switching }
    body { 
      font-family: -apple-system, system-ui, sans-serif; 
      background: #ffffff; 
      color: #1d1d1f;
      min-height: 100dvh; 
      padding: env(safe-area-inset-top) 16px calc(env(safe-area-inset-bottom) + 160px);
      display: flex;
      flex-direction: column;
      align-items: center;
      -webkit-user-select: none;
      user-select: none;
    }
    h1 { margin-bottom: 16px; }

    .tab-bar {
import { secondsToDecimalMMSS } from '/taktwerk/takt.js';

const DB_NAME = 'TaktwerkDB';
const DB_VERSION = 1;
const STORE_NAME = 'songs';

let db;
let currentSongId = null;
let longPressTimer = null;
let activeSongId = null;

const audioPlayer = new Audio();
audioPlayer.preload = 'auto';

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" fill="currentColor"/><path d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3
      display: flex;
      width: 100%;
      max-width: 300px;
      margin-bottom: 20px;
      border: 2px solid #000000;
      border-radius: 12px;
      overflow: hidden;
    }
.89543 19 5L19 19C19 20.    .tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px;
      border: none;
      background: #ffffff;
      font-size: 14px;1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" fill="currentColor"/><path opacity="0.1" d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" fill="currentColor"/><path d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.
      font-weight: 600;
      cursor: pointer;
      color: #1d1d1f;
      font-family: inherit;
      transition: background 0.15s ease, color 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
1045    .tab-btn:first-child {
      border-right: 2px solid #000000;
    }
    .tab-btn.active {
      background: #007aff;
      color: #ffffff;
    }
    .tab-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

    .view {7 21 10 20.1046 10 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

let playerBar, playerSongName, playerTimes, progressFill, progressContainer, playPauseBtn;
let actionOverlay, actionSheetTitle, actionRename, actionDelete, actionCancel;
let renameOverlay, renameInput, renameSave, renameCancel;
let tabLibrary, tabAdd, viewLibrary, viewAdd;

async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (event) => { db = event.target.result; resolve(db); };
    request.onerror = (event) => reject(event.target.error);
  });
}

async function saveSongBlob(file) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const songData = { name: file.name, blob: file, duration: null, addedAt: Date.now() };
    const addRequest = store.add(songData);
    addRequest. display: none; width: 100%; max-width: 600px; }
    .view.active { display: block; }
    #view-add.active { display: flex; flex-direction: column; align-items: center; }

    .import-btn {
      background: #007aff;
     onsuccess = () color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 17px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 20px;
      width: 100%;
      max-width: 300px;
    }
    .import-btn:active { opacity: 0.8; }

    #library-list { width: 100%; list-style: none; }
    .song-item {
      background: #f5f5f7 => resolve(addRequest;
      padding: 14px 16px;
      margin-bottom: 8px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
      transition: background 0.15s ease;
    }
    .song-item.pressing { background: #c7c7cc; transition: background 0.4s ease; }
    .song-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .song-name { font-weight: 500; font-size: 16px; }
    .song-duration { font-size: 13px; color: #6e6e73; margin-top: 2px; }
    .status-msg { margin-top: 10px; font-size: 14px; color: #6e6e73; text-align: center; }

    .overlay {
      position: fixed !important;
      top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
      background: rgba(0,0,0,0.4);
      z-index: 9999 !important;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .overlay.active { display: flex !important; animation: fadeIn 0..result);
    addRequest.onerror =2s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .action-sheet {
      background: #ffffff; border-radius: 14px; width: 280px; overflow: hidden;
      animation: scaleIn 0.2s ease; -webkit-user-select: none; user-select: none;
    }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .action-sheet-title {
      padding: 16px () => reject(add; text-align: center; font-size: 13px; color: #6e6e73;
      border-bottom: 1px solid #e5e5ea; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      -webkit-user-select: none; user-select: none;
   Request.error);
 }
    .action-sheet button {
      width: 100%; padding: 16px; border: none; background: none; font-size: 17px;
      cursor: pointer; border-bottom: 1px solid #e5e5ea; font-family: inherit; color: #1d1d1f;
      -webkit-user-select: none; user-select: none;
    }
    .action-sheet button:last-child { border-bottom: none; }
    .action-sheet button:active { background: #f5f5f7; }
    .btn-danger { color: #ff3b30 !important; }

    .rename-modal {
      background: #ffffff; border-radius: 14  });
}

async function updatepx; width: 300px; padding: 24px;
      animation: scaleIn 0.2s ease;
    }
    .rename-modal h3 { font-size: 17px; margin-bottom: 4px; }
    .rename-modal input {
      width: 100SongName(songId%; padding: 10px; font-size: 16px; border: 1px solid #e5e5ea;
      border-radius: 8px; margin: 12px 0; font-family: inherit; outline: none;
      -webkit-user-select: text; user-select: text;
    }
    .rename-modal input:focus { border-color: #007aff; }
    .rename-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .rename-modal-actions button {
      padding: 8px 16px; border-radius: 8, newName) {px; border: none; font-size: 15px;
      cursor: pointer; font-family: inherit;
    }
    .btn-cancel { background: #f5f5f7; color: #1d1d1f; }
    .btn-save { background: #007aff; color: #ffffff; }

    #player-bar {
      position: fixed; bottom: 0; left: 0; right: 0; background: #ffffff;
      border-top: 1px solid #e5e5ea;
      padding: 20px 24px calc(20px + env(safe-area-inset-bottom));
      display: none; flex
  return new Promise((resolve,-direction: column; gap: 14px; z-index: 100;
    }
    #player-bar.active { display: flex; }
    .player-song-name {
      font-weight: 600; font-size: 18px; white-space: nowrap; overflow: hidden;
      text-overflow: ellipsis reject) => {; text-align: center; width: 100%;
    }
    .player-times { color: #6e6e73; font-variant-numeric: tabular-nums; font-size: 16px; text-align: center; }
    .progress-container {
      width: 100%; height: 32px; display
    const transaction: flex; align = db.transaction([-items: center;
      cursor:STORE_NAME], 'readwrite');
    const store = transaction.objectStore(ST pointer; -webkit-tap-highlight-colorORE_NAME);
: transparent;
    }
       const getRequest = .progress-track {
      width: store.get(songId);
    getRequest 100.onsuccess =%; height:  () => {
6px; background: #e5      const song =e5ea; getRequest.result;
      if (song border-radius: 3px;
) {
        song.name = newName      position: relative;
        const; overflow: hidden putRequest = store;
    }.put(song);
        putRequest.
    .progress-fill {
      height: 1onsuccess = () => resolve();
00%; background        putRequest.onerror = () => reject: #00(putRequest.error7aff; border-radius: 3);
      }px;
     
    };
    getRequest.onerror = width: 0%; transition: width () => reject(get 0.1Request.error);
  });
}s linear;


async function delete    }
    .player-controls {Song(songId) {
  return display: flex; justify-content: center new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(songId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function extractAndUpdateDuration(songId, file) {
  try {
    const tempAudio = new Audio();
    tempAudio.src = URL.createObjectURL(file);
    const duration = await new Promise((resolve, reject) => {
      tempAudio.onloadedmetadata = () => { URL.revokeObjectURL(tempAudio.src); resolve(tempAudio.duration); };
      tempAudio.onerror = () => { URL.revokeObjectURL(tempAudio.src); reject(new Error('Metadata load failed')); };
    });
    const transaction; align-items: center; gap: 24px; }
    .control-btn {
      background: none; border: none; cursor: pointer; padding: 8px;
      -webkit-tap-highlight-color: transparent;
    }
    .control-btn svg { width: 36px; = db.transaction([ height: 36px; fill: #007aff; }
    .control-btn:active svg { opacity: 0.6; }
  </style>
</head>
<body>
  <h1>Taktwerk</h1>

  <div class="tab-bar">
    <button class="tab-btn active" id="tab-library">
      <svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M4 9V16C4 17.8STORE_NAME], 'readwrite');
856     const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(songId);
    getRequest.onsuccess = () => {
      const song = getRequest.result;
      if (song) { song.duration = duration; store.put(song); }
    };
    const songs = await loadSongs();
    renderLibrary(songs);
  } catch (e) { console.warn(`Could not extract duration for ${file.name}:`, e); }
}

async function loadSongs() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Pure CSS class toggling only — no inline style manipulation
function switchTab(tab) {
  if (tab === 'library') {
    tabLibrary.classList.add('active');
    tabAdd.classList.remove('active');
    viewLibrary.classList.add('active');
    viewAdd.classList.remove('active');
    loadSongs().then(songs => renderLibrary(songs));
  } else {
    tabAdd.classList.add('active');
    tabLibrary.classList.remove('active');
    viewAdd.classList.add('active');
    viewLibrary.classList.remove('active');
  }
}

function updatePlayerUI(elapsed, remaining, progress) {
  playerTimes.textContent = `${secondsToDecimalMMSS(elapsed)} / ${secondsToDecimalMMSS(elapsed + remaining)}`;
  progressFill.style.width = `${(progress * 100).toFixed(2)}%`;
}

function updatePlayPauseIcon(isPlaying) {
  playPauseBtn.innerHTML = isPlaying ? PAUSE_ICON : PLAY_ICON;
  playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
}

async function playSong(songId) {
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(songId);
  request.onsuccess = () => {4 18.8284 4.58579 19.4142C5.17157 20 6.11438 20 8 20H16C17.8856 20 18.8284 20 19.4142 19.4142C20 18.8284 20 17.8856 20 16V9H4Z" fill="currentColor"/><path d="M9 13H
    const song15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6.5C3 6.03534 3 5.80302 3.03843 5.60982C3.19624 4.8164 = request.result;4 3.81644 4.19624 4.60982 4.03843C4.80302 4 5.03534 4 5.5 4H12H18.5C18.9647 4 19.197 4 19.3902 4.03843C20.1836 4.19624 20.8038 4.81644 20.9616 5.60982C21 5.80302 21 6.03534 21 6.5V6.5V6.5C21 6.96466 21 7.19698 20.9616 7.39018C20.8038 8.18356 20.183
    if (song && song.blob6 8.80376 19.3902 8.9615) {
      if (audioPlayer7C19.197 9 1.src) URL.re8.96vokeObjectURL(audioPlayer.src);
47 9 18.      audioPlayer.src5 9H = URL.createObjectURL(song.blob);
12H5.5C5      audioPlayer.play.03534 9().catch(e => console.error('Playback 4.8 failed:', e));0302
      currentSong 9 4Id = songId.609;
      playerSongName.textContent = song.name;
      playerBar.classList.add('active');
      updatePlay82 8.96157C3.81644 8.803PauseIcon(true);76 3
      if ('.19624 8mediaSession' in.183 navigator) {
56 3        navigator.mediaSession.metadata = new Media.038Metadata({ title:43 7 song.name, artist.390: 'Takt18C3werk', album: 7.1 'Local Library'9698 });
        navigator.mediaSession.setActionHandler 3 6('play', ().964 => audioPlayer.play());
        navigator66 3.mediaSession.setActionHandler 6.5('pause', ()V6.5V6.5Z" stroke=" => audioPlayer.pausecurrentColor" stroke-width());
        navigator="2" stroke.mediaSession.setActionHandler-linejoin="round('stop', () => {
         "/><path d=" audioPlayer.pause();M4 9 audioPlayer.currentTime =V15. 0;
          playerBar.classList9999C4 1.remove('active');7.88 currentSongId =56 4 18. null;
         8284 updatePlayPauseIcon 4.58579(false);
          loadSongs().then 19.(songs => render4142Library(songs));C5.1
        });
7157      }
    19. }
  };9999
}

function 6.11438 19.9999 8 19.99 togglePlayback(songId) {
  if (currentSongId == songId && !audioPlayer.paused) {
    audioPlayer.pause99H9();
  } else {
    playSong(songId);
  }
}

functionH15H16C17.8856 19.99 showActionSheet(song99 1Id, songName8.8284 19.99) {
  activeSongId = songId;
99 1  actionSheetTitle.textContent = songName9.4142 19.41;
  action42C2Overlay.classList.add('0 18active');
}

function hideActionSheet() {
.8284 20  actionOverlay.classList.remove('active'); 17.8856 20 
  activeSong15.9999VId = null;
}

function showRenameModal(current9" stroke="Name) {
currentColor" stroke-width  renameInput.value="2" stroke = currentName;-linecap="round
  renameOverlay" stroke-linejoin.classList.add('active="round"/></svg');
  setTimeout>
      Library
    </button(() => { renameInput.focus(); rename>
    Input.select(); },<button class="tab-btn" id=" 100tab-add">
      <svg viewBox);
}

function hideRenameModal="0 0() {
  24 24" fill renameOverlay.classList.remove('active');
}

function renderLibrary(songs) {
  const libraryEl = document="none"><rect x="3" y="3" width="14" height="14" rx=".getElementById('library-list');
  library1" stroke="El.innerHTML = '';currentColor" stroke-width
  if (="2" strokesongs.length === -linecap="round0) {
    libraryEl.innerHTML = '<li style="text-align:center; padding:20px; color:#6e6e73;">No songs imported yet.<br><br>Tap "Add" stroke-linejoin="round"/><path d="M7 Music" to get started.</li>';
    return;
  }
  songs.forEach(song => {
    const li = document.createElement('li');
    li.className = 'song-item';
    const durationDisplay = song.duration !== null ? secondsToDecimalMMSS(song.duration) : 'Loading...';
    li.innerHTML = `
      <div class="song-info">
        <span class="song-name">${song.name}</span>
        <span class="song-duration">${durationDisplay}</span>
      </div>
    `;

    li.addEventListener('touchstart', () => {
      li.classList.add('pressing');
      longPressTimer = setTimeout(() => {
        if (navigator.vibrate) navigator.vibrate(15);
        li.classList.remove('pressing');
        showActionSheet(song.id, song.name);
      }, 400);
    });

    li.addEventListener('touchend', () => { clearTimeout(longPressTimer); li.classList.remove('pressing'); });
    li.addEventListener('touchcancel', () => { clearTimeout(longPressTimer); li.classList.remove('pressing'); });
    li.addEventListener('touchmove', () => { clearTimeout(longPressTimer); li.classList.remove('pressing'); });

    li.addEventListener('click', () => togglePlayback(song.id));
    libraryEl.appendChild(li);
  });
}

async function handleImport(files) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = `Importing ${files.length} songs...`;
  try {
    const songIds = [];
    for (let i = 0; i < files.length; i++) {
      const id = await saveSongBlob(files[i]);
      songIds.push({ id, file: files[i] });
      statusEl.textContent = `Saved ${i + 1}/${files.length}`;
    }
    statusEl.textContent = 'Extracting metadata...';
    for (const { id, file } of songIds) {
      await extractAndUpdateDuration(id, file);
    }
    statusEl.textContent = `Import complete! ${files.length} song${files.length > 1 ? 's' : ''} added.`;
    setTimeout(() => switchTab('library'), 800);
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Error importing songs.';
  }
}

async function initApp() {
  21H17a4 4 0 0 0 4-4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10h6M10 7v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin await initDB();

  playerBar="round"/></svg>
      Add Music
    </button>
  </div>

  <div id="view-library" class="view active">
    <ul id="library-list"></ul>
  </div>

  <div id="view-add" class="view">
    <input type="file" id=" = document.getElementById('audioPicker" multiple 
           accept="audio/mpeg, audio/mp3, audio/aac, audio/wav, audio/flac, audio/ogg, .mp3, .aac, .wav, .flac, .ogg, .m4a" 
           style="display:none">
    <button id="importBtn" class="player-bar');
import-btn">Select Songs</button>
    <div id="status" class="status-msg"></div>
  </div>

  <div id="action-overlay" class="overlay">
    <div class="action-sheet">
      <div class="action-sheet-title" id="action-sheet-title"></div>
      <button id="action-rename">Rename</button>
      <button id="  playerSongNameaction-delete" class="btn-danger">Delete</button>
      <button id="action-cancel">Cancel</button>
    </div>
  </div>

  <div id="rename-overlay" class="overlay">
    <div class="rename-modal">
      <h3>Rename Song</h3 = document.getElementById('>
      <input type="text" id="rename-input" autocomplete="off">
      <div class="rename-modal-actions">
        <button class="btn-cancel" id="rename-cancel">Cancel</button>
        <button class="btn-save" id="rename-save">Save</button>
      </div>
    </div>
  </div>

  <div id="player-bar">player-song-name');
    <span class="player-song-name" id="player-song-name"></span>
    <span class="player-times" id="player-times">00:00 / 00:00</span>
    <div class="progress-container" id="progress-container">
      <div class="progress-track">
       
  playerTimes <div class="progress-fill" id="progress-fill"></div>
      </div>
    </div>
    <div class="player-controls">
      <button class="control-btn" id="play-pause-btn = document.getElementById('" aria-label="Play/Pause"></player-times');
button>
     progressFill = document.getElementById('progress </div>
-fill');
  progressContainer = document.getElementById('progress-container  </div>
  
  <script type="module" src="/takt');
  playwerk/app.js"></PauseBtn = documentscript>
  <script>
.getElementById('play-pause-btn');
    if ('service  actionOverlay =Worker' in navigator document.getElementById('action) {
     -overlay');
  navigator.serviceWorker.register actionSheetTitle =('/taktwerk/sw document.getElementById('action.js');
    }
  </-sheet-title');
  actionRename = document.getElementById('actionscript>
</body>
</-rename');
html>
