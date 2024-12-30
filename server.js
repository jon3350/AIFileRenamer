import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize the app
const app = express();
const PORT = 3000;

// Convert __filename and __dirname to work with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve head.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'head.html'));
  });
  
// Route to serve tail.html
app.get('/tailPage', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'tail.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
