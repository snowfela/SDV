const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express()); // Use built-in JSON parsing middleware
app.get('/favicon.ico', (req, res) => res.status(204).end());

const storage = multer.diskStorage({destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    console.log('Upload Path:', uploadPath);
    cb(null, uploadPath);
  },filename: (req, file, cb) => cb(null, 'input.csv'),
});
const upload = multer({ storage: storage });
app.use(express.static('frontend'));
// app.use('/results', express.static('backend/results'));

app.post('/upload', upload.single('fileInput'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const uploadedFilePath = req.file.path;
  // Validate Python script path (optional)
  const pythonScriptPath = path.join(__dirname, 'processing', 'process_data.py');
  const outputFilePath = path.join(__dirname, 'results', 'generated_csv', 'output.csv');
  console.log('Python Script Path:', pythonScriptPath);
  console.log('Output File Path:', outputFilePath);
  // Spawn Python process with error handling
  const pythonProcess = spawn('python', [pythonScriptPath, uploadedFilePath, outputFilePath]);
  let stderr = '';
  pythonProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });
  pythonProcess.on('error', (error) => {
    console.error('Error executing Python script:', error);
    return res.status(500).json({ error: 'An error occurred while processing the file.' });
  });
  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      console.error('Python Script Error Output:', stderr);
      return res.status(500).json({ error: 'An error occurred while processing the file.' });
    }
	// Redirect to results page on successful processing
	return res.redirect('/results.html');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
