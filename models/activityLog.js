const mongoose = require('mongoose');


const activityLogSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
action: { type: String, required: true },
ip: { type: String },
meta: { type: Object },
createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('ActivityLog', activityLogSchema);