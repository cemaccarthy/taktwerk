import { secondsToDecimalMMSS } from '/taktwerk/takt.js';


const DB_NAME = 'TaktwerkDB';
const DB_VERSION = 1;
const STORE_NAME = 'songs';

let db;

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

// Save song to IndexedDB
async function saveSong(file) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Extract duration using a temporary audio element
    const tempAudio = new Audio();
    tempAudio.src = URL.createObjectURL(file);
    
    tempAudio.onloadedmetadata = () => {
      const duration = tempAudio.duration;
      URL.revokeObjectURL(tempAudio.src); // Clean up
      
      const songData = {
        name: file.name,
        blob: file, // Store the actual file blob
        duration: duration,
        addedAt: Date.now()
      };
      
      const addRequest = store.add(songData);
      addRequest.onsuccess = () => resolve(addRequest.result);
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    tempAudio.onerror = () => {
      URL.revokeObjectURL(tempAudio.src);
      reject(new Error('Failed to load audio metadata'));
    };
  });
}

// Load all songs from IndexedDB
async function loadSongs() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Render library list
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
    li.innerHTML = `
      <div class="song-info">
        <span class="song-name">${song.name}</span>
        <span class="song-duration">${secondsToDecimalMMSS(song.duration)}</span>
      </div>
    `;
    libraryEl.appendChild(li);
  });
}

// Handle file import
async function handleImport(files) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = `Importing ${files.length} songs...`;
  
  try {
    for (let i = 0; i < files.length; i++) {
      await saveSong(files[i]);
      statusEl.textContent = `Imported ${i + 1}/${files.length}`;
    }
    
    statusEl.textContent = 'Import complete!';
    const songs = await loadSongs();
    renderLibrary(songs);
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
  
  // Trigger file picker
  importBtn.addEventListener('click', () => {
    audioPicker.click();
  });
  
  // Handle file selection
  audioPicker.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await handleImport(Array.from(e.target.files));
      e.target.value = ''; // Reset input
    }
  });
  
  // Load existing library
  const songs = await loadSongs();
  renderLibrary(songs);
}

initApp();
