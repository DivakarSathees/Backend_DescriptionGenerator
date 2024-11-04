const express = require('express');
const { generateSolution } = require('../controllers/solutionController');
const { generateStructure } = require('../controllers/folderStructureController');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/generate', generateSolution);
router.post('/folderstrucure', generateStructure);

function getFilesAndFolders(dirPath) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  return items.map((item) => {
    const fullPath = path.join(dirPath, item.name);
    return item.isDirectory()
      ? { name: item.name, type: 'folder', path: fullPath, children: getFilesAndFolders(fullPath) }
      : { name: item.name, type: 'file', path: fullPath };
  });
}

router.get('/api/files', (req, res) => {

  // const dirPath = 'D:/description/dotnetapp'; // specify the target directory here
  const dirPath = req.query.path;
  console.log(dirPath);
  
  const fileTree = getFilesAndFolders(dirPath);
  res.json(fileTree);
});

// Endpoint to get file contents
router.get('/api/file-content', (req, res) => {
  const filePath = req.query.path;
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file', error: err });
    }
    res.json({ content: data });
  });
});

router.post('/saveFileContent', (req, res) => {
  // const { path: filePath, content } = req.body;
  // const fullPath = path.join(baseDir, filePath);
  const { path, content } = req.body;
  fs.writeFile(path, content, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving file content' });
    }
    res.status(200).json({ message: 'File content saved successfully' });
  });
  // fs.writeFile(fullPath, content, 'utf8', (err) => {
  //   if (err) return res.status(500).json({ error: 'Unable to save file' });

  //   res.json({ message: 'File saved successfully' });
  // });
});

module.exports = router;
