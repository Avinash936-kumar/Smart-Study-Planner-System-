const express = require('express');
const { getRisks } = require('../controllers/riskController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.get('/', getRisks);

module.exports = router;
