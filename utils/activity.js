const ActivityLog = require('../models/activityLog');


async function logActivity({ user, action, ip, meta }) {
try {
await ActivityLog.create({ user, action, ip, meta });
} catch (err) {
console.error('Activity log error:', err.message);
}
}


module.exports = { logActivity };
app.use(securityMiddleware.helmet());
app.use(securityMiddleware.rateLimiter);
