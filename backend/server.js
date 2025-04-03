const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// 获取所有信件
app.get('/api/letters', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM letters ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching letters:', err);
    res.status(500).json({ error: err.message });
  }
});

// 创建新信件
app.post('/api/letters', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO letters (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating letter:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 