const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// 获取所有信件
app.get('/api/letters', (req, res) => {
  db.all('SELECT * FROM letters ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 创建新信件
app.post('/api/letters', (req, res) => {
  const { title, content, author } = req.body;
  db.run(
    'INSERT INTO letters (title, content, author) VALUES (?, ?, ?)',
    [title, content, author],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        title,
        content,
        author
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 