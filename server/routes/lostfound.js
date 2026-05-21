const router = require("express").Router();
const c = require("../controllers/lostFoundController");
const { uploadImages } = require("../middleware/upload");

// List all
router.get("/", c.list);

// Get one
router.get("/:id", c.get);

// Add new (auth required)
router.post("/", uploadImages, c.create);

// Mark as resolved
router.patch("/:id/resolve", c.markResolved);

// Delete
router.delete("/:id", c.remove);

module.exports = router;