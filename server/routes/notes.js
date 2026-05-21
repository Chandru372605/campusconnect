const router = require('express').Router();
const c = require('../controllers/notesController');
const { uploadPDF } = require('../middleware/upload');

// List all, with filter/search
router.get('/', c.list);

// Recent notes
router.get('/recent', c.recent);

// Get one by ID
router.get('/:id', c.get);

// Upload note
router.post('/', uploadPDF, c.upload);

// Upvote
router.post('/:id/upvote', c.upvote);

// Delete note (only owner or admin)
router.delete('/:id', c.remove);

module.exports = router;