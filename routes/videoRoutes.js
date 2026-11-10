const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gezu123';

// Login API
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, token: 'gezu_authenticated_secret_token' });
  }
  return res.status(401).json({ error: 'Password dogoggoraa!' });
});

// Middleware eeyyama Admin mirkaneessuuf
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === 'Bearer gezu_authenticated_secret_token') {
    next();
  } else {
    res.status(403).json({ error: 'Eeyyama hin qabdu!' });
  }
};

// Public Route
router.get('/videos', videoController.getAllVideos);

// Protected Admin Routes
router.post('/videos', verifyAdmin, videoController.addVideo);
router.put('/videos/:id', verifyAdmin, videoController.updateVideo);
router.delete('/videos/:id', verifyAdmin, videoController.deleteVideo);

module.exports = router;