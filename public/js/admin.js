// Admin Token checking (Yoo login hin goone ta'e gara login.html erga)
const token = localStorage.getItem('adminToken');
if (token !== 'gezu_authenticated_secret_token') {
  window.location.href = 'login.html';
}

const form = document.getElementById('video-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit');
const videoIdInput = document.getElementById('video-id');
const successMsg = document.getElementById('success-msg');
const adminVideoList = document.getElementById('admin-video-list');

// Viidiyoowwan hunda fuula admin irratti fiduu fi list uumuu
async function fetchAdminVideos() {
  try {
    const res = await fetch('/api/videos');
    if (!res.ok) throw new Error('Network response was not ok');
    const videos = await res.json();
    
    adminVideoList.innerHTML = '';

    if (!videos || videos.length === 0) {
      adminVideoList.innerHTML = '<p style="color:var(--muted);">Ammas viidiyoowwan galfamani hin jiran.</p>';
      return;
    }

    videos.forEach(video => {
      const item = document.createElement('div');
      item.className = 'video-list-item';
      
      const videoId = video.id;

      item.innerHTML = `
        <div class="video-info">
          <h4>${video.title} <span style="font-size:0.75rem; background:var(--line); padding:2px 8px; border-radius:4px; text-transform:uppercase;">${video.category}</span></h4>
          <p>${video.video_url} • Dur: ${video.duration}</p>
        </div>
        <div class="video-actions">
          <button type="button" class="btn-sm btn-edit" onclick="editVideo(${videoId}, '${escapeHtml(video.title)}', '${video.category}', '${video.video_url}', '${video.duration}', '${escapeHtml(video.description || '')}')">Edit</button>
          <button type="button" class="btn-sm btn-delete" onclick="deleteVideo(${videoId})">Delete</button>
        </div>
      `;
      adminVideoList.appendChild(item);
    });
  } catch (err) {
    console.error('Error fetching admin videos:', err);
    adminVideoList.innerHTML = '<p style="color:red;">Viidiyoowwan feisuu irratti dogoggorri uumame.</p>';
  }
}

fetchAdminVideos();

// Form Submit (Add (POST) ykn Update (PUT))
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = videoIdInput.value;
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const video_url = document.getElementById('video_url').value;
  const duration = document.getElementById('duration').value;
  const description = document.getElementById('description').value;

  const url = id ? `/api/videos/${id}` : '/api/videos';
  const method = id ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, category, video_url, duration, description })
    });

    if (response.ok) {
      successMsg.style.display = 'block';
      successMsg.textContent = id ? 'Viidiyoon milkaa\'inaan haaromfameera!' : 'Viidiyoon milkaa\'inaan galmeeffameera!';
      resetForm();
      fetchAdminVideos();
      setTimeout(() => { 
        successMsg.style.display = 'none'; 
      }, 3000);
    } else if (response.status === 403) {
      alert('Session keessan xumurameera. Deebisaatii login godhaa.');
      logout();
    } else {
      alert('Dogoggorri uumame. Mee irra deebisaatii yaalaa.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Server wajjin wal-qunnamuun hin danda\'amne.');
  }
});

// Edit function - Data gara form-tti fiduu
window.editVideo = function(id, title, category, video_url, duration, description) {
  videoIdInput.value = id;
  document.getElementById('title').value = title;
  document.getElementById('category').value = category;
  document.getElementById('video_url').value = video_url;
  document.getElementById('duration').value = duration;
  document.getElementById('description').value = description;

  if (formTitle) formTitle.textContent = 'Edit Video';
  if (submitBtn) submitBtn.textContent = 'Update Video';
  if (cancelEditBtn) cancelEditBtn.style.display = 'inline-block';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Form Reset / Cancel Edit
window.resetForm = function() {
  form.reset();
  videoIdInput.value = '';
  if (formTitle) formTitle.textContent = 'Add New Video';
  if (submitBtn) submitBtn.textContent = 'Publish Video';
  if (cancelEditBtn) cancelEditBtn.style.display = 'none';
};

// Delete Video function
window.deleteVideo = async function(id) {
  if (!confirm('Dhugumaan viidiyoo kana haquu barbaaddaa?')) return;

  try {
    const res = await fetch(`/api/videos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      fetchAdminVideos();
    } else {
      alert('Viidiyoo haquu irratti dogoggorri uumame.');
    }
  } catch (err) {
    console.error('Error deleting video:', err);
  }
};

// Logout function
window.logout = function() {
  localStorage.removeItem('adminToken');
  window.location.href = 'login.html';
};

// Helper escape quotes for inline edit function
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}