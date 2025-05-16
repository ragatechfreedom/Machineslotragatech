// server.js
const express = require('express');
const cors = require('cors');
const { sha256 } = require('js-sha256');

const app = express();
app.use(cors());
app.use(express.json());

const symbols = ['💰', '💡', '🔪', '📱', '💎', '💸'];

app.post('/spin', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  const timestamp = Date.now();
  const seed = `${username}-${timestamp}`;
  const hash = sha256(seed);

  const reels = [];
  for (let i = 0; i < 5; i++) {
    const segment = hash.substr(i * 4, 4);
    const index = parseInt(segment, 16) % symbols.length;
    reels.push(symbols[index]);
  }

  const counts = {};
  reels.forEach(sym => counts[sym] = (counts[sym] || 0) + 1);
  const maxMatch = Math.max(...Object.values(counts));

  let reward = 0;
  if (maxMatch >= 4) reward = 10000;
  else if (maxMatch === 3) reward = 100;
  else reward = 0.01;

  res.json({ hash, reels, reward });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TRD Slot backend running on port ${PORT}`));
