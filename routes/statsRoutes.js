const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { permit } = require("../middleware/rbacMiddleware");

const {
  usersByRole,
  loginAttempts,
  activeUsers,
} = require("../controllers/statsController");

const router = express.Router();

// Admin & Manager can access stats
router.get("/users", protect, permit("admin", "manager"), usersByRole);
router.get("/logins", protect, permit("admin", "manager"), loginAttempts);
router.get("/active-users", protect, permit("admin", "manager"), activeUsers);

module.exports = router;
