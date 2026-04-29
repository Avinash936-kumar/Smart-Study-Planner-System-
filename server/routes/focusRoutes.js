const express = require('express');
const { createFocusSession, getFocusSessions, getFocusStats } = require('../controllers/focusController');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.use(protect);
router.get('/stats', getFocusStats);
router.get('/', getFocusSessions);
router.post('/', createFocusSession);
module.exports = router;
