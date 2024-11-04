const express = require('express');
const { generateDescription } = require('../controllers/descriptionController');
const { generateSolution } = require('../controllers/solutionController');
const router = express.Router();

router.post('/generate', generateDescription);
// router.post('/generatesolution', generateSolution);

module.exports = router;
