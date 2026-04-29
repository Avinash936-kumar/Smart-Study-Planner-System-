const express = require('express');
const { getGroups, createGroup, joinGroup, addSharedTask, completeSharedTask } = require('../controllers/studyGroupController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.route('/').get(getGroups).post(createGroup);
router.post('/join', joinGroup);
router.post('/:id/tasks', addSharedTask);
router.put('/:id/tasks/:taskId/complete', completeSharedTask);

module.exports = router;
