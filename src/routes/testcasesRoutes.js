const express = require('express');
const { generateTestcases } = require('../controllers/testcaseController');
const { generateStructure } = require('../controllers/folderStructureController');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/generate', generateTestcases);
router.post('/folderstrucure', generateStructure);

module.exports = router;