// app.js - Step 1: Database schema migration to v2
import { secondsToDecimalMMSS } from '/taktwerk/takt.js';

const DB_NAME = 'TaktwerkDB';
const DB_VERSION = 2; // Bumped from 1 to 2

let db;
let currentSongId = null;
let longPressTimer = null;
let activeContextMenu .tab-btn:first-child { border-right = null;

const audioPlayer = new Audio();
audioPlayer.preload = 'auto';

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13: 2px solid #000000; }
    .tab-btn.active { background: #007aff; color: #ffffff; }
    .tab-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

    .view { display: none; width: 100%; max-width: 600px; }
    .view.active { display: block; }
    #view-add.active {.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" fill="currentColor"/><path d="M4 5.49 display: flex;683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" fill="currentColor"/><path opacity="0.1" d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89 flex-direction: column543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 2; align-items:1 7  center; }

21L8    .import-btn 21C {
      background9.10: #00457 7aff; color: white; border21 10 20: none;
      padding: .10412px 6 10 19Z24px;" fill="currentColor"/><path d=" border-radius: M14 12px;19L1 font-size: 17px;4 5C font-weight: 14 3600;.895
      cursor:43 1 pointer; margin-bottom: 20px; width: 100%; max-width: 300px;
    }
    .import-btn:active { opacity: 4.8954 3 16 3L17 3C18.1046 3 19 3.890.8;543 19 5 }

    #L19 library-list { width19C1: 100%; list-style: none; }
    .song9 20.1046 18.104-item {
     6 21 background: #f 17 5f5f7; padding:21L16 21 14pxC14. 16px8954; margin-bottom: 21  8px;
      border-radius: 1014 2px; display:0.10 flex; justify-content46 14 19: space-between;Z" stroke="currentColor" stroke-width align-items: center;
      cursor="2" stroke: pointer; --linecap="round" stroke-linejoinwebkit-tap-highlight="round"/><path-color: transparent; d="M1
      -webkit-user-select: none0 19L10 ; user-select:5C10 none;
      transition: background  3.80.159543s ease;
 9.10457 3 8    }
    .song-item.p 3L7ressing { background: #c7c7cc; transition 3C5.895: background 043 3 5 3.4s ease; }
   .895 .song-item.menu43 5-open { border-radius 5L5: 10 19C5 20px 10px 0 .1040; margin-bottom6 5.: 0;89543 21 7 2 }
    .song-info { display1L8 : flex; flex-direction: column;21C9.10457 2 flex: 1; min-width:1 10 0; } 20.1046
    .song-name { font-weight 10 : 5019Z"0; font-size: 16 stroke="currentColor"px; }
 stroke-width="2" stroke-linecap    .song-duration { font-size:="round" stroke-linejoin="round 13px"/></svg>`;; color: #

let playerBar6e6e, playerSongName73; margin, playerTimes, progressFill, progress-top: 2Container, playPausepx; }
    .status-msgBtn;
let { margin-top: renameOverlay, renameInput, renameSave, renameCancel; 10px; font-size:
let tabLibrary 14px; color: #, tabAdd,6e6e viewLibrary, view73; textAdd;

//-align: center; --- IndexedDB Schema ( }

    .context-menu {
v2) ---      background: #
async function initffffff;
DB() {
      border:   return new Promise1px solid #((resolve, reject) => {
e5e5    const request =ea;
      indexed border-top: none;
      border-radius: 0 0 10px 1DB.open(DB_NAME, DB_VERSION);
    
    request.onupgradene0px;
eded = (event      margin-top:) => {
      const db = 0;
 event.target.result;      margin-bottom: 8px;
      
      //
      overflow: hidden;
      Preserve existing songs store
      if (! animation: slideDown 0.15s ease;db.objectStoreNames.contains('songs'))
      width: {
        db.createObjectStore('songs 100', { keyPath: 'id',%;
    } autoIncrement: true
    @keyframes slideDown { from { opacity: });
      }
      
      0; transform: translateY(-4 // Composers storepx); } to
      if (!db.objectStoreNames.contains(' { opacity: 1; transform:composers')) translateY(0); } }
    .context-menu button {
      width: 10 {
        const composers = db.createObjectStore('composers', { key0%; padding: 14pxPath: 'id', autoIncrement: true });
        16px composers.createIndex('; border: nonelastName', 'lastName; background: none;
      font', { unique: false });
       -size: 1 composers.createIndex('5px; cursorfirstName', 'firstName: pointer; text', { unique:-align: left; false });
     
      font-family: inherit; color }
      
      // Catalogues store
      if (!: #1d1d1fdb; border-bottom:.objectStoreNames.contains('catalogues')) 1px solid #f0f {
        const0f0; catalogues = db
    }
.createObjectStore('catalogues', { key    .context-menuPath: 'id button:last-child {', autoIncrement: border-bottom: none; }
    true });
        .context-menu button:active { background catalogues.createIndex('composerId',: #f5 'composerId',f5f7; }
    { unique: false });
      } .context-menu .
      
      //btn-danger { color Pieces store
     : #ff3 if (!db.objectb30;StoreNames.contains(' }

    .pieces')) {
overlay {
      position: fixed !important;
             const pieces = db.createObjectStore('pieces', { key top: 0Path: 'id !important; left: 0 !', autoIncrement: true });
        pieces.createIndex('important; right: 0 !important; bottom: 0 !important;
      background: rgba(0,0,0,0.4); z-index: 9999 !important;
      display: nonecomposerId', 'composerId', { unique: false });
        pieces.createIndex('title', 'title', { unique: false });
      }
      
      // Movements store
     ; align-items: if (!db.object center; justify-contentStoreNames.contains(': center;
movements')) {    }
   
        const movements .overlay.active { = db.createObjectStore('movements', { keyPath: display: flex !important; animation: 'id', auto fadeIn 0.Increment: true });2s ease;
        movements.create }
    @Index('pieceId', 'pieceIdkeyframes fadeIn { from { opacity: 0; }', { unique: to { opacity: false });
        1; } movements.createIndex('movementNumber', 'movementNumber', { }
    .rename-modal {
      background: # unique: false });
      }
ffffff; border-radius    };
    
: 14    request.onspx; width: 300uccess = (eventpx; padding:) => { db 24px = event.target.result;
      animation; resolve(db);: scaleIn  };
    request.onerror = (event0.2s) => reject(event.target.error);
 ease;
    }
    @  });
}keyframes scaleIn

// --- Existing { from { transform: scale(0 CRUD.9); opacity operations (unchanged: 0;) ---
async function } to { transform saveSongBlob(file: scale(1); opacity: ) {
  return new Promise((1; } }resolve, reject)
    .rename-modal h3 { => {
    const transaction = db font-size: .transaction(['17px;songs'], 'read margin-bottom: write');
    const store = transaction4px; }
    .rename.objectStore('songs');
    const-modal input {
      width:  songData = {100%; name: file.name padding: 1, blob: file0px; font, duration: null-size: 1, addedAt:6px; border Date.now() };: 1px
    const add solid #e5Request = store.adde5ea;(songData);

      border-radius    addRequest.: 8px; margin: onsuccess = () => resolve(addRequest12px .result);
   0; font-family addRequest.onerror =: inherit; outline: none;
 () => reject(addRequest.error);
      -webkit-user  });
}

async function update-select: text;SongName(songId user-select: text, newName) {;
    }
  return new
    .rename-modal input:focus { border-color: #007aff Promise((resolve, reject) => {
    const transaction; }
    = db.transaction([' .rename-modal-actions { display: flex; gap: 8px; justifysongs'], 'readwrite');
    const store = transaction.objectStore('songs-content: flex-end');
    const getRequest = store.get; }
   (songId);
 .rename-modal-actions button {
      padding: 8    getRequest.onsuccess = () =>px 16 {
      constpx; border-radius song = getRequest.result: 8px;
      if; border: none (song) {; font-size:
        song.name = newName;
 15px        const putRequest;
      cursor = store.put(song: pointer; font);
        put-family: inherit;
    }
    .btn-cancelRequest.onsuccess = () => resolve { background: #();
        putRequest.onerror = ()f5f5 => reject(putf7; colorRequest.error);
: #1d      }
   1d1f };
    getRequest; }
   .onerror = () => reject(getRequest.error .btn-save { background: #007aff;);
  }); color: #ffffff
}

async; }

    #player-bar { function deleteSong(songId) {

      position: fixed; bottom:  return new Promise((resolve, reject) => {
 0; left    const transaction =: 0; right: 0 db.transaction(['songs; background: #'], 'readwriteffffff;
     ');
    const border-top:  store = transaction.object1px solid #Store('songs');e5e5
    const requestea;
      padding: 2 = store.delete(songId);
   0px 2 request.onsuccess = () => resolve4px calc(20px +();
    request env(safe-area.onerror = () =>-inset-bottom));
      display: reject(request.error); none; flex-direction
  });
}

async function: column; gap extractAndUpdateDuration(song: 14Id, file) {
  try {
    constpx; z-index: 10 tempAudio = new Audio();
   0;
    }
    # tempAudio.src = URL.createObjectURL(file);
    constplayer-bar.active { display: flex; }
    .player-song-name { duration = await new
      font-weight Promise((resolve,: 60 reject) => {
      tempAudio.onloadedmetadata =0; font-size () => { URL: 18px; white-space.revokeObjectURL: nowrap; overflow(tempAudio.src);: hidden;
 resolve(tempAudio.duration      text-overflow: ellipsis;); };
      text-align: center tempAudio.onerror = () => { URL; width: 100%;.revokeObjectURL
    }
    .player-times(tempAudio.src); reject(new Error(' { color: #Metadata load failed'));6e6e73; font };
    });
    const transaction-variant-numeric: tabular-nums; font-size: 16 = db.transaction(['px; text-alignsongs'], 'read: center; }write');
    const store = transaction.objectStore('songs');
    const
    .progress getRequest = store.get-container {
     (songId);
 width: 1    getRequest.ons00%; heightuccess = () =>: 32 {
      constpx; display: song = getRequest.result flex; align-items: center;
;
      if (song) {      cursor: pointer song.duration = duration; -webkit-t; store.put(song); }
   ap-highlight-color: };
    const transparent;
    }
    . songs = await loadprogress-track {
      width: 100%;Songs();
    renderLibrary(songs);
  } height: 6 catch (e) { console.warn(`px; background: #e5eCould not extract duration5ea; border for ${file.name}:`, e);-radius: 3px;
      position: relative; }
}

async function loadSongs overflow: hidden;() {
 
    }
 return new Promise((resolve, reject)    .progress-fill {
      height => {
    const transaction = db: 100%; background:.transaction(['songs'], #007 'readonly');
aff; border-radius    const store = transaction.objectStore('songs');
    const request = store: 3px;
      width: 0%; transition: width .getAll();
    request.onsuccess0.1s linear;
    = () => resolve }
    .(request.result);
player-controls { display    request.onerror = () => reject(request: flex; justify.error);
 -content: center; });
}

// --- Tab Switch align-items: center; gap: ing ---
function24px; }
    . switchTab(tab)control-btn {
 {
  if (tab === 'library') {
    tabLibrary.classList.add('active');
    tabAdd.classList.remove('active');
    view      background: none; border: none; cursor: pointer; padding: 8px;
      -webkit-tap-highlight-color: transparent;
    }
    .Library.classList.add('active');
   control-btn svg { viewAdd.classList.remove width: 3('active');
6px; height: 36    loadSongs().px; fill:then(songs => renderLibrary(songs));
  } #007 else {
   aff; }
    .control-btn tabAdd.classList.add:active svg {('active');
 opacity: 0    tabLibrary.classList.remove('active');
    viewAdd.classList.add('active.6; }
  </style>
</head');
    view>
<body>Library.classList.remove('
  <hactive');
 1>Taktwerk</h1> }
}

// --- Player UI

  <div ---
function update class="tab-barPlayerUI(elapsed">
    <button class="tab, remaining, progress) {
 -btn active" id="tab-library">
      <svg playerTimes.textContent = `${secondsToDecimal viewBox="0 MMSS(elapsed0 24)} / ${seconds 24"ToDecimalMMSS fill="none">(elapsed + remaining)}`;
  progressFill.style.width = `${(<path opacity="0.1" d="M4 9V16progress * 1C4 100).toFixed7.88(2)}%`;
}

function updatePlayPause56 4 18.Icon(isPlaying)8284 {
  play 4.58579PauseBtn.innerHTML = 19. isPlaying ? PA4142C5.17157USE_ICON : PLAY_ICON;
  playPauseBtn.setAttribute('aria-label', 20 6.11 isPlaying ? '438 Pause' : '20 8Play');
}

async function play 20HSong(songId)16C17.88 {
  const56 2 transaction = db.transaction0 18(['songs'], '.828readonly');
 4 20 19. const store = transaction.objectStore('songs');
  const4142 request = store.get 19.4142(songId);
C20   request.ons18.8284 uccess = () =>20 1 {
    const song = request.result7.8856 2;
    if (song && song0 16.blob) {
      if (audioV9H4Z" fill="Player.src) URLcurrentColor"/><path d.revokeObjectURL="M9 13H1(audioPlayer.src);5" stroke="
      audioPlayer.src = URL.createObjectcurrentColor" stroke-widthURL(song.blob);="2" stroke
      audioPlayer-linecap="round.play().catch(e" stroke-linejoin => console.error('="round"/><pathPlayback failed:', e d="M3));
      current 6.5SongId = songC3 6Id;
     .035 playerSongName.textContent34 3 = song.name; 5.80302
      playerBar.classList.add('active 3.0');
      update3843PlayPauseIcon(true);
      if 5.6 ('mediaSession'0982C3.1 in navigator) {9624
        navigator.media 4.8Session.metadata = new1644 MediaMetadata({ title 3.8: song.name,1644 artist: 'Taktwerk', album 4.19624: 'Local Library 4.6' });
        navigator.mediaSession.setActionHandler('play', () => audioPlayer0982 4.03843C4.8.play());
        navigator.mediaSession.setAction0302 4 5Handler('pause',.035 () => audioPlayer34 4.pause());
        5.5 navigator.mediaSession.setActionHandler('stop', 4H1 () => {
2H18.5C1          audioPlayer.pause8.9647 4(); audioPlayer.currentTime = 0; 19.
          playerBar197 4 19.classList.remove('active.390'); currentSongId = null;
          updatePlayPause2 4.Icon(false);
          loadSongs().03843C20then(songs =>.183 renderLibrary(songs6 4.1962));
        });4 20
      }.803
    }
8 4.  };
}

function togglePlayback8164(songId) {4 20.961
  if (currentSongId ==6 5. songId && !6098audioPlayer.paused)2C21 5.8 {
    audio0302Player.pause();
 21   } else {6.03
    playSong534 (songId);
21 6  }
}.5V6

// --- Inline Context Menu ---
.5V6function dismissContextMenu().5C2 {
  if1 6.9646 (activeContextMenu) {
    active6 21 7.1ContextMenu.remove();
9698    activeContextMenu = 20. null;
 9616 }
  document.querySelectorAll('.song-item 7.3.menu-open').forEach9018C20.(el => el.classList8038.remove('menu-open 8.1'));
}

8356function showContextMenu(song 20.1836Id, songName 8.8, songElement) {
  dismiss0376ContextMenu();
  19. songElement.classList.add3902 8.9('menu-open');

  const menu6157C19. = document.createElement('197 div');
  menu.className = '9 18context-menu';
.964  menu.innerHTML =7 9  `
    18.5<button data-action="rename">Rename</ 9H1button>
   2H5. <button data-action5C5.0353="delete" class4 9 ="btn-danger">4.80302 Delete</button>
  `;9 4.

  songElement6098.parentNode.insertBefore(menu,2 8. songElement.nextSibling);
  activeContextMenu9615 = menu;

7C3.  menu.querySelector('[8164data-action="rename4 8.8037"]').addEventListener('click6 3.', async () =>19624 8. {
    dismiss1835ContextMenu();
    showRenameModal(song6 3.Id, songName03843 7.39018C3 7.19698 3 6.);
  });

  menu.querySelector('[data-action="delete"]').addEventListener('click', async () => {
    dismissContextMenu();
96466 3 6.5V    if (currentSongId == songId) {
6.5V      audioPlayer.pause6.5Z();
      player" stroke="currentColorBar.classList.remove('active');
     " stroke-width="2" stroke-line currentSongId =join="round"/> null;
     <path d="M updatePlayPauseIcon4 9V15.9999C4 17(false);
    }
    await deleteSong(songId);
    const songs = await loadSongs();
   .8856 4 18.8 renderLibrary(songs284 );
  });4.58
}

document579 .addEventListener('click',19.4 (e) =>142C {
  if5.17 (activeContextMenu &&157  !activeContextMenu.contains(e.target) &&19.9 !e.target.closest999 6.11438 ('.song-item'))19.9 {
    dismissContextMenu();
 999 8 19 }
});

.999// --- Rename Modal ---
let renameTargetId = null9H9H15H1;

function showRenameModal(songId6C17.885, currentName) {
  rename6 19.999TargetId = song9 18Id;
 .828 renameInput.value =4 19 currentName;
.999  renameOverlay.classList.add('active');9 19
  setTimeout(().414 => { renameInput2 19.focus(); renameInput.414.select(); }, 2C20 18.100);8284
}

function 20  hideRenameModal()17.8 {
  rename856 Overlay.classList.remove('20 1active');
 5.9999V9 renameTargetId = null;
}" stroke="currentColor

// --- Library" stroke-width="2" stroke-line Rendering ---
functioncap="round" renderLibrary(songs stroke-linejoin=") {
 round"/></svg> const libraryEl = document.getElementById('library
      Library
    </button>-list');
 
    <button libraryEl.innerHTML = class="tab-btn '';
  if" id="tab (songs.length === 0) {-add">
     
    libraryEl <svg viewBox=".innerHTML = '<li0 0 24 2 style="text-align4" fill=":center; padding:20px;none"><rect x color:#6e="3" y6e73="3" width;">No songs imported="14" yet.<br> height="14<br>Tap "" rx="1Add Music" to" stroke="currentColor get started.</li" stroke-width=">';
    return2" stroke-line;
  }cap="round"
  songs.forEach stroke-linejoin="(song => {
round"/><path d    const li = document.createElement('li="M7 ');
    li21H17a4 .className = 'song4 0 -item';
   0 0 4-4V const durationDisplay = song.duration !== null5" stroke=" ? secondsToDecimalcurrentColor" stroke-widthMMSS(song.duration="2" stroke) : 'Loading-linecap="round...';
   " stroke-linejoin li.innerHTML = `="round"/><path
      <div d="M7 class="song-info">
         10h6M10<span class="song 7v6-name">${song.name" stroke="currentColor}</span>
" stroke-width="        <span class2" stroke-line="song-duration">${cap="round"durationDisplay}</span stroke-linejoin=">
      </round"/></svg>div>
   
      Add Music `;

   
    </button li.addEventListener('touch>
  </div>

 start', () => {
      li <div id="view-library" class.classList.add('pressing');
     ="view active">
    <ul id="library-list longPressTimer = setTimeout(() => {
        if ("></ul>
  </div>navigator.vibrate) navigator.vibrate(

  <div15);
 id="view-add" class="view        li.classList.remove">
    ('pressing');<input type="file
        showContextMenu" id="audio(song.id, songPicker" multiple 
.name, li);
      },            accept="audio/mpeg, audio400);
    });

/mp3, audio    li.addEventListener('touchend', ()/aac, audio/wav, audio => { clearTimeout(long/flac, audioPressTimer); li/ogg, ..classList.remove('pressing'); });
mp3, .aac, .wav    li.addEventListener(', .flactouchcancel', () => { clearTimeout(long, .ogg, .m4aPressTimer); li" 
           style.classList.remove('press="display:none">
    <buttoning'); });
 id="importBtn    li.addEventListener('touchmove', ()" class="import => { clearTimeout(long-btn">Select SongsPressTimer); li</button>
.classList.remove('press    <div iding'); });

    li.addEventListener('="status" classclick', () =>="status-msg"></div>
  {
      if </div>

 (activeContextMenu &&  <div id="rename-overlay" li.classList.contains('menu-open')) { class="overlay">
        dismissContextMenu
    <div();
        return class="rename-modal;
      }
      togglePlayback">
      (song.id);
    });

   <h3>Rename Song</h3 libraryEl.appendChild(li>
      <input type="text);
  });" id="rename
}

//-input" autocomplete="off">
      --- Import ---
async function handleImport <div class="(files) {
rename-modal-actions">  const statusEl = document.getElementById('status');
 
        <button class="btn-cancel" id="rename statusEl.textContent =-cancel">Cancel</ `Importing ${files.length} songsbutton>
        <button class="...`;
 btn-save" id try {
   ="rename-save"> const songIds =Save</button>
      </div [];
    for>
    </ (let i =div>
 0; i < files.length;  </div> i++) {


  <div      const id = id="player-bar await saveSongBlob">
    (files[i]);
<span class="player      songIds.push({ id, file-song-name" id="player-song-name: files[i]"></span>
 });
      status    <span classEl.textContent = `="player-times"Saved ${i + id="player-times 1}/${files.length}`;
">00:    }
   00 /  statusEl.textContent =00:00</span> 'Extracting metadata
    <div class="progress-container...';
   " id="progress-container">
      <div class=" for (const {progress-track">
 id, file } of songIds) {
      await extractAndUpdateDuration(id, file);
    }
           <div class="progress-fill" id="progress-fill"></div>
 statusEl.textContent = `Import complete!      </div> ${files.length}
    </div>
     song${files.length<div class="player > 1 ? 's' : ''} added.`-controls">
      <button class=";
    setTimeoutcontrol-btn" id(() => switchTab="play-pause-btn" aria-label('library'), 800);
  } catch="Play/Pause (error) {
    console.error"></button>
    </div>
  </div(error);
   >
  
  statusEl.textContent = <script type=" 'Error importing songsmodule" src="/.';
 taktwerk/app.js }
}

"></script>
// --- Init ---  <script>
async function init
    if ('App() {
serviceWorker' in  await initDB navigator) {
();

  player      navigator.serviceWorkerBar = document.getElementById.register('/taktwerk('player-bar');/sw.js');

  playerSong    }
 Name = document.getElementById </script>
('player-song-name</body>
');
  player</html>
Times = document.getElementById('player-times');
  progressFill```

### ✅ Complete Updated `app = document.getElementById('.js`

Copyprogress-fill');
  progressContainer = this entire file:

```javascript
// app.js - document.getElementById('progress-container');
  playPauseBtn = Step 1: Database schema migration to document.getElementById('play v2
import { secondsToDecimal-pause-btn');MMSS } from '/taktwerk/t
  renameOverlayakt.js';

 = document.getElementById('const DB_NAME =rename-overlay');
 'Taktwerk  renameInput = document.getElementById('renameDB';
const-input');
  DB_VERSION =  renameSave = document2; // Bumped from 1 to 2

let db;
let currentSongId = null;
let longPressTimer = null;
let activeContextMenu = null;

const audioPlayer = new Audio();
audioPlayer.preload = 'auto';

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C19.384 12.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" fill="currentColor"/><path d="M4 5.49683V18.5032C4 20.05 5.68077 21.0113 7.01404 20.227L18.0694 13.7239C1.getElementById('rename-save9.384 12');
  rename.9506 19.384 11.0494 18.0694 10.2761L7.01404 3.77296C5.68077 2.98869 4 3.95 4 5.49683Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" fill="none"><path opacity="0.1" d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" fill="currentColor"/><path opacity="0.1" d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" fill="currentColor"/><path d="M14 19L14 5C14 3.89543 14.8954 3 16 3L17 3C18.1046 3 19 3.89543 19 5L19 19C19 20.1046 18.1046 21 17 21L16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19L10 5C10 3.89543 9.10457 3 8 3L7 3C5.89543 3 5 3.89543 5 5L5 19C5 20.1046 5.89543 21 7 21L8 21C9.10457 21 10 20.1046 10 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

let playerBar, playerSongName, playerTimes, progressFill, progressContainer, playPauseBtn;
let renameOverlay, renameInput, renameSave, renameCancel;
let tabLibrary, tabAdd, viewLibrary, viewAdd;

// --- IndexedDB Schema (v2) ---
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Preserve existing songs store
      if (!db.objectStoreNames.contains('songs')) {
        db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });
      }
      
      // Composers store
      if (!db.objectStoreNames.contains('composers')) {
        const composers = db.createObjectStore('composers', { keyPath: 'id', autoIncrement: true });
        composers.createIndex('lastName', 'lastName', { unique: false });
        composers.createIndex('firstName', 'firstName', { unique: false });
      }
      
      // Catalogues store
      if (!db.objectStoreNames.contains('catalogues')) {
        const catalogues = db.createObjectStore('catalogues', { keyPath: 'id', autoIncrement: true });
        catalogues.createIndex('composerId', 'composerId', { unique: false });
      }
      
      // Pieces store
      if (!db.objectStoreNames.contains('pieces')) {
        const pieces = db.createObjectStore('pieces', { keyPath: 'id', autoIncrement: true });
        pieces.createIndex('composerId', 'composerId', { unique: false });
        pieces.createIndex('title', 'title', { unique: false });
      }
      
      // Movements store
      if (!db.objectStoreNames.contains('movements')) {
        const movements = db.createObjectStore('movements', { keyPath: 'id', autoIncrement: true });
        movements.createIndex('pieceId', 'pieceId', { unique: false });
        movements.createIndex('movementNumber', 'movementNumber', { unique: false });
      }
    };
    
    request.onsuccess = (event) => { db = event.target.result; resolve(db); };
    request.onerror = (event) => reject(event.target.error);
  });
}

// --- Existing CRUD operations (unchanged) ---
async function saveSongBlob(file) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['songs'], 'readwrite');
    const store = transaction.objectStore('songs');
    const songData = { name: file.name, blob: file, duration: null, addedAt: Date.now() };
    const addRequest = store.add(songData);
    addRequest.onsuccess = () => resolve(addRequest.result);
    addRequest.onerror = () => reject(addRequest.error);
  });
}

async function updateSongName(songId, newName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['songs'], 'readwrite');
    const store = transaction.objectStore('songs');
    const getRequest = store.get(songId);
    getRequest.onsuccess = () => {
      const song = getRequest.result;
      if (song) {
        song.name = newName;
        const putRequest = store.put(song);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

async function deleteSong(songId) {
  return new PromiseCancel = document.getElementById((resolve, reject) => {
    const transaction =('rename-cancel'); db.transaction(['songs'], 'readwrite');
    const store = transaction.objectStore('songs');
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
    const transaction = db.transaction(['songs'], 'readwrite');
    const store = transaction.objectStore('songs');
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
    const transaction = db.transaction(['songs'], 'readonly');
    const store = transaction.objectStore('songs');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Tab Switching ---
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

// --- Player UI ---
function updatePlayerUI(elapsed, remaining, progress) {
  playerTimes.textContent = `${secondsToDecimalMMSS(elapsed)} / ${secondsToDecimalMMSS(elapsed + remaining)}`;
  progressFill.style.width = `${(progress * 100).toFixed(2)}%`;
}

function updatePlayPauseIcon(isPlaying) {
  playPauseBtn.innerHTML = isPlaying ? PAUSE_ICON : PLAY_ICON;
  playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
}

async function playSong(songId) {
  const transaction = db.transaction(['songs'], 'readonly');
  const store = transaction.objectStore('songs');
  const request = store.get(songId);
  request.onsuccess = () => {
    const song = request.result;
    if (song && song.blob) {
      if (audioPlayer.src) URL.revokeObjectURL(audioPlayer.src);
      audioPlayer.src = URL.createObjectURL(song.blob);
      audioPlayer.play().catch(e => console.error('Playback failed:', e));
      currentSongId = songId;
      playerSongName.textContent = song.name;
      playerBar.classList.add('active');
      updatePlayPauseIcon(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: song.name, artist: 'Taktwerk', album: 'Local Library' });
        navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
        navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
        navigator.mediaSession.setActionHandler('stop', () => {
          audioPlayer.pause(); audioPlayer.currentTime = 0;
          playerBar.classList.remove('active'); currentSongId = null;
          updatePlayPauseIcon(false);
          loadSongs().then(songs => renderLibrary(songs));
        });
      }
    }
  };
}

function togglePlayback(songId) {
  if (currentSongId == songId && !audioPlayer.paused) {
    audioPlayer.pause();
  } else {
    playSong(songId);
  }
}

// --- Inline Context Menu ---
function dismissContextMenu() {
  if (activeContextMenu) {
    activeContextMenu.remove();
    activeContextMenu = null;
  }
  document.querySelectorAll('.song-item.menu-open').forEach(el => el.classList.remove('menu-open'));
}

function showContextMenu(songId, songName, songElement) {
  dismissContextMenu();
  songElement.classList.add('menu-open');

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.innerHTML = `
    <button data-action="rename">Rename</button>
    <button data-action="delete" class="btn-danger">Delete</button>
  `;

  songElement.parentNode.insertBefore(menu, songElement.nextSibling);
  activeContextMenu = menu;

  menu.querySelector('[data-action="rename
  tabLibrary"]').addEventListener('click', async () => {
    dismissContextMenu();
    = document.getElementById(' showRenameModal(songId, songName);
  });

  menu.querySelector('[data-action="delete"]').addEventListener('click', async () => {
    dismissContextMenu();
    if (currentSongId == songId) {
      audioPlayer.pause();
      playerBar.classList.remove('active');
      currentSongId = null;
      updatePlayPauseIcon(false);
    }
    await deleteSong(songId);
    const songs = await loadSongs();
    renderLibrary(songs);
  });
}

document.addEventListener('click', (e) => {
  if (activeContextMenu && !activeContextMenu.contains(e.target) && !e.target.closest('.song-item')) {
    dismissContextMenu();
  }
});

// --- Rename Modal ---
let renameTargetId = null;

function showRenameModal(songId, currentName) {
  renameTargetId = songId;
  renameInput.value = currentName;
  renameOverlay.classList.add('active');
  setTimeout(() => { renameInput.focus(); renameInput.select(); }, 100);
}

function hideRenameModal() {
  renameOverlay.classList.remove('active');
  renameTargetId = null;
}

// --- Library Rendering ---
function renderLibrary(songs) {
  const libraryEl = document.getElementById('library-list');
  libraryEl.innerHTML = '';
  if (songs.length === 0) {
    libraryEl.innerHTML = '<li style="text-align:center; padding:20px; color:#6e6e73;">No songs imported yet.<br><br>Tap "Add Music" to get started.</li>';
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
        showContextMenu(song.id, song.name, li);
      }, 400);
    });

    li.addEventListener('touchend', () => { clearTimeout(longPressTimer); li.classList.remove('pressing'); });
    li.addEventListener('touchcancel', () => { clearTimeout(longPressTimer); li.classList.remove('pressing'); });
    li.addEventListener('touchmove', () => { clearTimeout(longPressTimer); li.classList.remove('pressing'); });

    li.addEventListener('click', () => {
      if (activeContextMenu && li.classList.contains('menu-open')) {
        dismissContextMenu();
        return;
      }
      togglePlayback(song.id);
    });

    libraryEl.appendChild(li);
  });
}

// --- Import ---
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

// --- Init ---
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
tab-library');
  tabAdd =  tabAdd = document.getElementById('tab document.getElementById('tab-add');
 -add');
  viewLibrary = document viewLibrary = document.getElementById('view-library.getElementById('view-library');
  view');
  viewAdd = document.getElementByIdAdd = document.getElementById('view-add');('view-add');

  tabLibrary

  tabLibrary.addEventListener('click',.addEventListener('click', (e) => (e) => { e.stopPropagation(); { e.stopPropagation(); switchTab('library switchTab('library'); });
 '); });
  tabAdd.addEventListener(' tabAdd.addEventListener('click', (eclick', (e) => { e) => { e.stopPropagation(); switchTab.stopPropagation(); switchTab('add'); });('add'); });

  renameCancel

  renameCancel.addEventListener('click',.addEventListener('click', hideRenameModal); hideRenameModal);
  renameOverlay
  renameOverlay.addEventListener('click',.addEventListener('click', (e) => (e) => { if (e { if (e.target === renameOverlay.target === renameOverlay) hideRenameModal) hideRenameModal(); });

 (); });

  renameSave.addEventListener(' renameSave.addEventListener('click', async ()click', async () => {
    const newName = rename => {
    const newName = renameInput.value.trim();Input.value.trim();
    if (
    if (newName && renamenewName && renameTargetId !== nullTargetId !== null) {
     ) {
      await updateSongName await updateSongName(renameTargetId,(renameTargetId, newName);
      newName);
      if (currentSong if (currentSongId == renameTargetId == renameTargetId) {
Id) {
        playerSongName        playerSongName.textContent = newName;.textContent = newName;
        if ('
        if ('mediaSession' inmediaSession' in navigator) {
 navigator) {
          navigator.mediaSession          navigator.mediaSession.metadata = new Media.metadata = new MediaMetadata({ title:Metadata({ title: newName, artist: newName, artist: 'Taktwerk 'Taktwerk', album: '', album: 'Local Library' });Local Library' });
        }

        }
      }
           }
      const songs = await const songs = await loadSongs();
 loadSongs();
      renderLibrary(s      renderLibrary(songs);
   ongs);
    }
    hide }
    hideRenameModal();
RenameModal();
  });

   });

  renameInput.addEventListener(' renameInput.addEventListener('keydown', (ekeydown', (e) => {
) => {
    if (e    if (e.key === 'Enter.key === 'Enter') { e.preventDefault') { e.preventDefault(); renameSave.click(); renameSave.click(); }
   (); }
    if (e.key if (e.key === 'Escape') === 'Escape') hideRenameModal(); hideRenameModal();
  });


  });

  progressContainer.addEventListener  progressContainer.addEventListener('click', (('click', (e) => {
    if (!e) => {
    if (!audioPlayer.duration)audioPlayer.duration) return;
    return;
    const rect = progress const rect = progressContainer.getBoundingClientRect();
Container.getBoundingClientRect();
    const ratio =    const ratio = Math.max(0 Math.max(0, Math.min(, Math.min(1, (e1, (e.clientX - rect.left.clientX - rect.left) / rect.width) / rect.width));
    audio));
    audioPlayer.currentTime = ratioPlayer.currentTime = ratio * audioPlayer.duration * audioPlayer.duration;
  });;
  });

  playPause

  playPauseBtn.addEventListener('clickBtn.addEventListener('click', () => {', () => {
    if (
    if (currentSongId ===currentSongId === null) return; null) return;
    if (
    if (audioPlayer.paused)audioPlayer.paused) {
      audio {
      audioPlayer.play().catchPlayer.play().catch(e => console.error(e => console.error('Playback failed:',('Playback failed:', e));
    e));
    } else {
 } else {
      audioPlayer.pause      audioPlayer.pause();
    }();
    }
  });


  });

  audioPlayer.addEventListener  audioPlayer.addEventListener('timeupdate',('timeupdate', () => {
 () => {
    if (!audio    if (!audioPlayer.duration) returnPlayer.duration) return;
    const;
    const elapsed = audioPlayer elapsed = audioPlayer.currentTime;
   .currentTime;
    const remaining = audio const remaining = audioPlayer.duration - elapsedPlayer.duration - elapsed;
    const;
    const progress = elapsed / progress = elapsed / audioPlayer.duration; audioPlayer.duration;
    updatePlayer
    updatePlayerUI(elapsed,UI(elapsed, remaining, progress); remaining, progress);
  });


  });

  audioPlayer.addEventListener  audioPlayer.addEventListener('play', ()('play', () => { playerBar => { playerBar.classList.add('active.classList.add('active'); updatePlayPause'); updatePlayPauseIcon(true); });Icon(true); });
  audioPlayer
  audioPlayer.addEventListener('pause',.addEventListener('pause', () => { update () => { updatePlayPauseIcon(falsePlayPauseIcon(false); });
 ); });
  audioPlayer.addEventListener(' audioPlayer.addEventListener('ended', () =>ended', () => {
    player {
    playerBar.classList.remove('Bar.classList.remove('active');
   active');
    currentSongId = currentSongId = null;
    null;
    updatePlayPauseIcon(false);
    updatePlayPauseIcon(false);
    loadSongs().then loadSongs().then(songs => render(songs => renderLibrary(songs));Library(songs));
  });


  });

  const importBtn  const importBtn = document.getElementById(' = document.getElementById('importBtn');
importBtn');
  const audioPicker  const audioPicker = document.getElementById(' = document.getElementById('audioPicker');
audioPicker');
  importBtn.addEventListener  importBtn.addEventListener('click', ()('click', () => audioPicker.click => audioPicker.click());
  audio());
  audioPicker.addEventListener('changePicker.addEventListener('change', async (e', async (e) => {
) => {
    if (e    if (e.target.files.length >.target.files.length > 0) { 0) {
      await handle
      await handleImport(Array.from(eImport(Array.from(e.target.files));
.target.files));
      e.target.value      e.target.value = '';
    = '';
    }
  }); }
  });

  document.addEventListener

  document.addEventListener('visibilitychange',('visibilitychange', () => {
 () => {
    if (!document    if (!document.hidden && !audio.hidden && !audioPlayer.paused && currentPlayer.paused && currentSongId) {SongId) {
      audioPlayer
      audioPlayer.play().catch(().play().catch(() => {});
 => {});
    }
     }
  });

  update });

  updatePlayPauseIcon(falsePlayPauseIcon(false);
  const);
  const songs = await load songs = await loadSongs();
 Songs();
  renderLibrary(songs renderLibrary(songs);
  console.log('[Taktwerk] DB v2 initialized successfully');
});
  console.log('[Taktwerk] DB v2 initialized successfully');
}

initApp();

initApp();
