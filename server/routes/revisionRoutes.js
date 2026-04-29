const express = require('express');
const { getRevisions, createRevision, updateRevision, deleteRevision, logRevision } = require('../controllers/revisionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.route('/').get(getRevisions).post(createRevision);
router.route('/:id').put(updateRevision).delete(deleteRevision);
router.post('/:id/log', logRevision);

module.exports = router;
