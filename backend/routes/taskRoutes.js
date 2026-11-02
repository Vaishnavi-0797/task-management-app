const express = require('express');
const requireAuth = require('../middleware/auth');
const c = require('../controllers/taskController');

const router = express.Router();
router.use(requireAuth); // every task route needs a valid token

router.get('/', c.listTasks);
router.get('/:id', c.getTask);
router.post('/', c.createTask);
router.put('/:id', c.updateTask);
router.delete('/:id', c.deleteTask);

module.exports = router;
