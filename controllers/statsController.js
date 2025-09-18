const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');


// GET /stats/users -> number of users by role
exports.usersByRole = async (req, res) => {
try {
const result = await User.aggregate([
{ $group: { _id: '$role', count: { $sum: 1 } } },
{ $project: { role: '$_id', count: 1, _id: 0 } }
]);
res.json(result);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


// GET /stats/logins -> successful vs failed login attempts
exports.loginAttempts = async (req, res) => {
try {
const result = await ActivityLog.aggregate([
{ $match: { action: { $in: ['login_success', 'login_failed'] } } },
{ $group: { _id: '$action', count: { $sum: 1 } } },
{ $project: { action: '$_id', count: 1, _id: 0 } }
]);
res.json(result);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


// GET /stats/active-users -> users logged in within last 24 hours
exports.activeUsers = async (req, res) => {
try {
const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
const users = await User.countDocuments({ lastLoginAt: { $gte: since } });
res.json({ activeUsers: users });
} catch (err) {
res.status(500).json({ message: err.message });
}
};