const express = require('express');
const { getAllLogs, exportLogs } = require('../controllers/logsController');
const { protect } = require('../middleware/authMiddleware');
const { permit } = require('../middleware/rbacMiddleware');


const router = express.Router();


// Admin can view all logs (paginated & filterable)
router.get('/', protect, permit('admin'), getAllLogs);


// Admin and Manager can export or view filtered logs
router.get('/export', protect, permit('admin', 'manager'), exportLogs);


module.exports = router;