const express = require('express');
const { getAttendance, createAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.route('/').get(getAttendance).post(createAttendance);
router.route('/:id').put(updateAttendance).delete(deleteAttendance);

module.exports = router;
