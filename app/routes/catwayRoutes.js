const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');

// La route de Catway
router.get('/add', catwayController.renderAddCatwayForm);
router.post('/add', catwayController.addCatway);
router.get('/:catwayNumber/edit', catwayController.renderEditCatwayForm);
router.post('/:catwayNumber/edit', catwayController.updateCatway);
router.get('/:catwayNumber/delete', catwayController.deleteCatway);
router.get('/', catwayController.getAllCatways);
router.get('/:id', catwayController.getCatwayById); 



module.exports = router;