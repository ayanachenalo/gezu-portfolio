document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('video-grid');

  // YouTube URL irraa Video ID baasuu fi Embed link qopheessuu
  function getYouTubeEmbedUrl(url) {
    let videoId = '';
    if (!url) return '';
    
    if (url.includes('youtube.com/embed/')) {
      return url + (url.includes('?') ? '&' : '?') + 'autoplay=1&enablejsapi=1';
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    if (!videoId) return url;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  }

  // Database irraa viidiyoowwan hunda fiduu
  async function fetchVideos() {
    try {
      const response = await fetch('/api/videos');
      const videos = await response.json();
      
      grid.innerHTML = '';

      if (!videos || videos.length === 0) {
        grid.innerHTML = '<p style="color:var(--muted); grid-column: 1/-1;">Ammas viidiyoowwan galfamani hin jiran. Fuula Admin irraa dabaluu dandeessu.</p>';
        return;
      }

      videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'work';
        card.dataset.c = video.category;

        const embedUrl = getYouTubeEmbedUrl(video.video_url);
        const thumbClass = video.category === 'promo' ? 't1' : video.category === 'music' ? 't2' : video.category === 'film' ? 't3' : 't4';

        card.innerHTML = `
          <div class="thumb ${thumbClass}">
            <span class="dur">${video.duration}</span>
            <iframe src="" data-src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          </div>
          <h3>${video.title}</h3>
          <p>${video.description || 'Professional video editing project.'}</p>
          <div class="card-actions">
            <button class="action-btn play-btn">▶ Play</button>
            <button class="action-btn stop-btn">⏹ Stop</button>
          </div>
        `;

        const iframe = card.querySelector('iframe');
        const playBtn = card.querySelector('.play-btn');
        const stopBtn = card.querySelector('.stop-btn');

        // Play Button yeroo tuqamu video bakkuma sanatti taphachuu eegala
        playBtn.addEventListener('click', () => {
          iframe.src = iframe.dataset.src;
          iframe.style.display = 'block';
          playBtn.style.display = 'none';
          stopBtn.style.display = 'block';
        });

        // Stop Button yeroo tuqamu video guututti dhaabbata
        stopBtn.addEventListener('click', () => {
          iframe.src = '';
          iframe.style.display = 'none';
          stopBtn.style.display = 'none';
          playBtn.style.display = 'block';
        });

        grid.appendChild(card);
      });

    } catch (err) {
      console.error('Videos fiduu irratti dogoggorri uumame:', err);
      grid.innerHTML = '<p style="color:red; grid-column: 1/-1;">Viidiyoowwan feisuu hin dandaamne.</p>';
    }
  }

  fetchVideos();

  // Filter Buttons Logic (All, Promos, Music videos, kkf)
  document.addEventListener('click', (e) => {
    if (e.target.matches('.filters button')) {
      document.querySelectorAll('.filters button').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
      e.target.setAttribute('aria-pressed', 'true');
      
      const filter = e.target.dataset.f;
      document.querySelectorAll('.work').forEach(card => {
        if (filter === 'all' || card.dataset.c === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });
});