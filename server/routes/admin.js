const router = require("express").Router();
const { isAdmin } = require("../middleware/role");
const { protect } = require("../middleware/auth");
const c = require("../controllers/adminController");

// Protect all routes, admin only
router.use(protect, isAdmin);

// Users
router.get('/users', c.listUsers);
// Posts moderation
router.get('/confessions/reported', c.reportedConfessions);
router.patch('/confessions/:id/approve', c.approveConfession);
router.delete('/confessions/:id', c.deleteConfession);
// Analytics
router.get('/analytics', c.analytics);
// User reports
router.get('/reports', c.listReports);

module.exports = router;