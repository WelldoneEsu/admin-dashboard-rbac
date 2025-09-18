const ActivityLog = require('../models/ActivityLog');


// Admin: view all logs
exports.getAllLogs = async (req, res) => {
try {
const { page = 1, limit = 50, user, action, from, to } = req.query;
const filter = {};
if (user) filter.user = user;
if (action) filter.action = action;
if (from || to) filter.createdAt = {};
if (from) filter.createdAt.$gte = new Date(from);
if (to) filter.createdAt.$lte = new Date(to);


const logs = await ActivityLog.find(filter)
.sort({ createdAt: -1 })
.skip((page - 1) * limit)
.limit(parseInt(limit));


res.json({ count: logs.length, logs });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


// Manager: same but can restrict by query params (handled above)
exports.exportLogs = async (req, res) => {
try {
const { format = 'json' } = req.query;
const logs = await ActivityLog.find({}).sort({ createdAt: -1 });


if (format === 'csv') {
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
const csvStringifier = createCsvWriter({
header: [
{ id: '_id', title: 'id' },
{ id: 'user', title: 'user' },
{ id: 'action', title: 'action' },
{ id: 'ip', title: 'ip' },
{ id: 'createdAt', title: 'createdAt' }
]
});
const header = csvStringifier.getHeaderString();
const records = logs.map(l => ({ _id: l._id.toString(), user: l.user ? l.user.toString() : '', action: l.action, ip: l.ip, createdAt: l.createdAt.toISOString() }));
const csv = header + csvStringifier.stringifyRecords(records);
res.setHeader('Content-disposition', 'attachment; filename=logs.csv');
res.setHeader('Content-Type', 'text/csv');
return res.send(csv);
}


res.json({ count: logs.length, logs });
} catch (err) {
res.status(500).json({ message: err.message });
}
};