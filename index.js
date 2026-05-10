const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Pexels API Setup
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pixelvault')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'PixelVault Backend is running.' });
});

// Fetch Curated Wallpapers
app.get('/api/wallpapers/curated', async (req, res) => {
  try {
    const { page = 1, per_page = 30 } = req.query;
    const response = await fetch(`${PEXELS_BASE_URL}/curated?page=${page}&per_page=${per_page}`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching curated wallpapers:', error);
    res.status(500).json({ error: 'Failed to fetch wallpapers' });
  }
});

// Search Wallpapers
app.get('/api/wallpapers/search', async (req, res) => {
  try {
    const { query, page = 1, per_page = 30, color } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });
    
    let url = `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`;
    if (color) url += `&color=${encodeURIComponent(color)}`;

    const response = await fetch(url, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error searching wallpapers:', error);
    res.status(500).json({ error: 'Failed to search wallpapers' });
  }
});

// Fetch Wallpaper by ID
app.get('/api/wallpapers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${PEXELS_BASE_URL}/photos/${id}`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching wallpaper details:', error);
    res.status(500).json({ error: 'Failed to fetch wallpaper details' });
  }
});

// Get Categories with predefined images
app.get('/api/categories', (req, res) => {
  const categories = [
    { name: "Nature", image: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Cars", image: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Anime", image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Animals", image: "https://images.pexels.com/photos/47547/squirrel-animal-cute-rodents-47547.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Gaming", image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800" }, // reuse/placeholder
    { name: "Space", image: "https://images.pexels.com/photos/116975/pexels-photo-116975.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Technology", image: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Abstract", image: "https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Cyberpunk", image: "https://images.pexels.com/photos/3735154/pexels-photo-3735154.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Sports", image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Movies", image: "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Minimal", image: "https://images.pexels.com/photos/1738434/pexels-photo-1738434.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Fantasy", image: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Architecture", image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Neon", image: "https://images.pexels.com/photos/14936128/pexels-photo-14936128.jpeg?auto=compress&cs=tinysrgb&w=800" },
    { name: "Music", image: "https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg?auto=compress&cs=tinysrgb&w=800" }
  ];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
