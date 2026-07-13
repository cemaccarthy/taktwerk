// app.js - Main application logic with playback
import { secondsToDecimalMMSS } from '/taktwerk/takt.js';

const DB_NAME = 'TaktwerkDB';
const DB_VERSION = 1;
const STORE_NAME = 'songs';

let db;
let currentSongId = null;

// Single reusable audio element for iOS background audio support
const audioPlayer = new Audio();
audioPlayer.preload = 'auto';

// Initialize IndexedDB
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
    
    request.onerror = (event) => reject(event.target.error);
  });
}

// Save song blob immediately
async function saveSongBlob(file) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const songData = {
      name: file.name,
      blob: file,
      duration: null,
      addedAt: Date.now()
    };
    
    const addRequest = store.add(songData);
    addRequest.onsuccess = () => resolve(addRequest.result);
    addRequest.onerror = () => reject(addRequest.error);
  });
}

// Extract duration and update record
async function extractAndUpdateDuration(songId, file) {
  try {
    const tempAudio = new Audio();
    tempAudio.src = URL.createObjectURL(file);
    
    const duration = await new Promise((resolve, reject) => {
      tempAudio.onloadedmetadata = () => {
        URL.revokeObjectURL(tempAudio.src);
        resolve(tempAudio.duration);
      };
      tempAudio.onerror = () => {
        URL.revokeObjectURL(tempAudio.src);
        reject(new Error('Metadata load failed'));
      };
    });
    
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(songId);
    
    getRequest.onsuccess = () => {
      const song = getRequest.result;
      if (song) {
        song.duration = duration;
        store.put(song);
      }
    };
    
    const songs = await loadSongs();
    renderLibrary(songs);
  } catch (e) {
    console.warn(`Could not extract duration for ${file.name}:`, e);
  }
}

// Load all songs
async function loadSongs() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Play song by ID
async function playSong(songId) {
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(songId);
  
  request.onsuccess = () => {
    const song = request.result;
    if (song && song.blob) {
      // Revoke previous blob URL to prevent memory leaks
      if (audioPlayer.src) URL.revokeObjectURL(audioPlayer.src);
      
      audioPlayer.src = URL.createObjectURL(song.blob);
      audioPlayer.play().catch(e => console.error('Playback failed:', e));
      currentSongId = songId;
      
      // Update UI to show playing state
      document.querySelectorAll('.play-btn').forEach(btn => {
        btn.textContent = btn.dataset.id == songId ? '⏸' : '▶';
      });
    }
  };
}

// Toggle play/pause
function togglePlayback(songId) {
  if (currentSongId == songId && !audioPlayer.paused) {
    audioPlayer.pause();
    document.querySelector(`.play-btn[data-id="${songId}"]`).textContent = '▶';
  } else {
    playSong(songId);
  }
}

// Render library with play buttons
function renderLibrary(songs) {
  const libraryEl = document.getElementById('library');
  libraryEl.innerHTML = '';
  
  if (songs.length === 0) {
    libraryEl.innerHTML = '<li style="text-align:center; padding:20px; color:#6e6e73;">No songs imported yet.</li>';
    return;
  }
  
  songs.forEach(song => {
    const li = document.createElement('li');
    li.className = 'song-item';
    const durationDisplay = song.duration !== null 
      ? secondsToDecimalMMSS(song.duration) 
      : 'Loading...';
    
    const isPlaying = currentSongId == song.id && !audioPlayer.paused;
    
    li.innerHTML = `
      <div class="song-info">
        <span class="song-name">${song.name}</span>
        <span class="song-duration">${durationDisplay}</span>
      </div>
      <button class="play-btn" data-id="${song.id}">${isPlaying ? '⏸' : '▶'}</button>
    `;
    
    li.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlayback(song.id);
    });
    
    libraryEl.appendChild(li);
  });
}

// Handle file import
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
    
    const songs = await loadSongs();
    renderLibrary(songs);
    statusEl.textContent = 'Extracting metadata...';
    
    for (const { id, file } of songIds) {
      await extractAndUpdateDuration(id, file);
    }
    
    statusEl.textContent = 'Import complete!';
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Error importing songs.';
  }
}

// Initialize App
async function initApp() {
  await initDB();
  
  const importBtn = document.getElementById('importBtn');
  const audioPicker = document.getElementById('audioPicker');
  
  importBtn.addEventListener('click', () => audioPicker.click());
  
  audioPicker.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await handleImport(Array.from(e.target.files));
      e.target.value = '';
    }
  });
  
  const songs = await loadSongs();
  renderLibrary(songs);
}

initApp();
