const express = require('express');
const cors = require('cors');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (public folder: index.html, admin.html, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', videoRoutes);

// Default port (5000 ykn system environment port)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server sa'aatiin oolee http://localhost:${PORT} irratti ka'eera`);
});