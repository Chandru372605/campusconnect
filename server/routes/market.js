const router = require('express').Router();
const c = require('../controllers/marketController');
const { uploadImages } = require('../middleware/upload');

// List all products
router.get('/', c.list);

// Get one product by ID
router.get('/:id', c.get);

// Add product (authenticated)
router.post('/', uploadImages, c.create);

// Mark as sold (seller only)
router.patch('/:id/sold', c.markSold);

// Delete listing (seller or admin)
router.delete('/:id', c.remove);

module.exports = router;