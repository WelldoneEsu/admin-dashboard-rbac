const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g. LOGIN, CREATE_USER, DELETE_LOG
    ipAddress: { type: String },
    details: { type: Object }, // optional extra details
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
