const express = require('express');
const { createTask, updateTaskStatus, getMyTasks } = require('../controllers/taskController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, createTask);
router.get('/my', auth, getMyTasks);
router.patch('/:taskId/status', auth, updateTaskStatus);

module.exports = router;
