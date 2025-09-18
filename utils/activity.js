const ActivityLog = require('../models/ActivityLog');


async function logActivity({ user, action, ip, meta }) {
try {
await ActivityLog.create({ user, action, ip, meta });
} catch (err) {
console.error('Activity log error:', err.message);
}
}


module.exports = { logActivity };