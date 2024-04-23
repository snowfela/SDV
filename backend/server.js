const express = require('express');
const multer = require('multer');
const fs = require('fs/promises'); // Using promises for cleaner async/await handling
const { spawn } = require('child_process'); // Using spawn for more control over Python execution
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Use built-in JSON parsing middleware

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'input.csv'),
  });  

const upload = multer({ storage: storage });
app.use(express.static('frontend'));

app.post("C:\\Users\\sivan\\.vscode\\Synthetic_Data\\uploads", upload.single('fileInput'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const sensitiveAttributes = req.body.sensitiveAttributes;
  const uploadedFilePath = req.file.path;
  // Validate Python script path (optional)
  const pythonScriptPath = path.join(__dirname, '..', 'backend', 'processing', 'process_data.py');
  const outputFilePath = path.join(__dirname, '..', 'backend', 'results', 'generated_csv', 'output.csv');
  // Spawn Python process with error handling
  const pythonProcess = spawn('python', [pythonScriptPath, uploadedFilePath, sensitiveAttributes, outputFilePath]);

  let stdout = '';
  let stderr = '';

  pythonProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

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

    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.error('Python Script Output:', stdout); // Log complete stdout for debugging
      return res.status(500).json({ error: 'An error occurred while parsing the response.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
