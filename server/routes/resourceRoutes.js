const express = require('express');
const { getResources, createResource, deleteResource, togglePin } = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.route('/').get(getResources).post(createResource);
router.route('/:id').delete(deleteResource);
router.put('/:id/pin', togglePin);

module.exports = router;
