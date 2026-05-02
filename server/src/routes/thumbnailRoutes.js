const express = require('express');
const {
    analyzeThumbnail,
    getThumbnails,
    getThumbnail,
    deleteThumbnail,
    getDashboardStats,
    generateTitles,
} = require('../controllers/thumbnailController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.post('/generate-titles', generateTitles);
router.post('/analyze', upload.single('thumbnail'), analyzeThumbnail);
router.get('/', getThumbnails);
router.get('/:id', getThumbnail);
router.delete('/:id', deleteThumbnail);

module.exports = router;
