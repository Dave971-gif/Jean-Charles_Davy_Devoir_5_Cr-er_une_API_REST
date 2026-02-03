const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');

// La route de Catway
router.get('/', catwayController.getAllCatways);
router.get('/:id', catwayController.getCatwayById); // Route pour obtenir un catway par son ID

module.exports = router;