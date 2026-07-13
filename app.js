// Minimal test - if tabs work, app.js was the problem
document.getElementById('tab-add').addEventListener('click', () => {
  document.getElementById('tab-library').classList.remove('active');
  document.getElementById('tab-add').classList.add('active');
  document.getElementById('view-library').classList.remove('active');
  document.getElementById('view-add').classList.add('active');
});
console.log('[Taktwerk] Minimal test loaded');
