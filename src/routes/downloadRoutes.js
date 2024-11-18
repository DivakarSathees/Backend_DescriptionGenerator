const express = require('express');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const { downloadController } = require('../controllers/downloadController');

router.get('/solution', downloadController);

module.exports = router;