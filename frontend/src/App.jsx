import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';

function App() {
  const [letters, setLetters] = useState([]);
  const [newLetter, setNewLetter] = useState({
    title: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/letters');
      setLetters(response.data);
    } catch (error) {
      console.error('Error fetching letters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/letters', newLetter);
      setNewLetter({ title: '', content: '', author: '' });
      fetchLetters();
    } catch (error) {
      console.error('Error creating letter:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Unsent Letters
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Title"
            value={newLetter.title}
            onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Your Letter"
            value={newLetter.content}
            onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Your Name (Optional)"
            value={newLetter.author}
            onChange={(e) => setNewLetter({ ...newLetter, author: e.target.value })}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Share Your Letter
          </Button>
        </Box>

        {letters.map((letter) => (
          <Card key={letter.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {letter.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {letter.author || 'Anonymous'} • {new Date(letter.created_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {letter.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default App;
