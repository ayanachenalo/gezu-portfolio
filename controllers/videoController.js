const db = require('../config/db');

exports.getAllVideos = (req, res) => {
  db.all('SELECT * FROM videos ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

exports.addVideo = (req, res) => {
  const { title, category, video_url, duration, description } = req.body;
  const query = `INSERT INTO videos (title, category, video_url, duration, description) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(query, [title, category, video_url, duration, description], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, category, video_url, duration, description });
  });
};

exports.updateVideo = (req, res) => {
  const { id } = req.params;
  const { title, category, video_url, duration, description } = req.body;
  const query = `UPDATE videos SET title = ?, category = ?, video_url = ?, duration = ?, description = ? WHERE id = ?`;

  db.run(query, [title, category, video_url, duration, description, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Viidiyoon milkaa\'inaan haaromfameera!' });
  });
};

// Delete Video
exports.deleteVideo = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM videos WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Viidiyoon haqameera!' });
  });
};