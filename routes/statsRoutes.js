const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/rbacMiddleware");
const {
  getUsersStats,
  getLoginStats,
  getActiveUsersStats,
} = require("../controllers/statsController");

const router = express.Router();

// Admin & Manager can access stats
router.get("/users", protect, authorize(["admin", "manager"]), getUsersStats);
router.get("/logins", protect, authorize(["admin", "manager"]), getLoginStats);
router.get(
  "/active-users",
  protect,
  authorize(["admin", "manager"]),
  getActiveUsersStats
);

module.exports = router;
