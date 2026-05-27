const express = require('express');
const router = express.Router();
const storeInwardController = require('../controllers/storeInwardController');

// ➕ Create
router.post('/', storeInwardController.createStoreInward);

// 📦 Read
router.get('/', storeInwardController.getAllStoreInwards);

// ❌ Delete Store Inward
router.delete('/:id', storeInwardController.deleteStoreInward);

// 📤 Stock Outward
router.post('/outward', storeInwardController.createStockOutward);

// ✅ Delete Stock Outward (added)
router.delete('/stock-outward/:id', storeInwardController.deleteStockOutward);

// ✏️ Update Store Inward
router.put('/stock-inward/:id', storeInwardController.updateStoreInward);

module.exports = router;
