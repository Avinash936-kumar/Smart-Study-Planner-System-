const express = require('express');
const { getSyllabus, createSyllabus, updateSyllabus, deleteSyllabus } = require('../controllers/syllabusController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.route('/').get(getSyllabus).post(createSyllabus);
router.route('/:id').put(updateSyllabus).delete(deleteSyllabus);

module.exports = router;
