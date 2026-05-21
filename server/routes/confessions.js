const router = require("express").Router();
const c = require("../controllers/confessionController");
const { protect } = require("../middleware/auth");

// List all confessions
router.get("/", c.list);

// Trending
router.get("/trending", (req, res, next) => c.list({ ...req, query: { trending: true } }, res, next));

// Post new confession (auth required but anonymous in DB)
router.post("/", protect, c.create);

// Like confession
router.post("/:id/like", protect, c.like);

// Comment on confession
router.post("/:id/comment", protect, c.comment);

// Report for moderation
router.post("/:id/report", protect, c.report);

module.exports = router;