const express = require('express');
const router = express.Router();
const dispatchController = require('../controllers/dispatchController');

router.post('/', dispatchController.createDispatch);
router.get('/', dispatchController.getDispatches);
router.get('/:id', dispatchController.getDispatchById);
router.put('/:id', dispatchController.updateDispatch);
router.delete('/:id', dispatchController.deleteDispatch);

module.exports = router;
