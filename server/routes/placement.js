const router = require("express").Router();
const c = require("../controllers/placementController");
const { protect } = require("../middleware/auth");

// List posts (optionally filter by ?company= or ?q=)
router.get("/", c.list);

// Get single post with comments
router.get("/:id", c.get);

// Create post (auth required)
router.post("/", protect, c.create);

// Comment on post
router.post("/:id/comment", protect, c.comment);

// Delete post (owner or admin)
router.delete("/:id", protect, c.remove);

module.exports = router;