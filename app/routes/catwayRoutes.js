const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const reservationController = require('../controllers/reservationController');

/**
 * @swagger
 * /catways:
 *  get:
 *   summary: Récupère la liste de tous les catways
 *  tags:
 *   - Catways
 *  responses:
 *   200:
 *  description: Liste des catways récupérée avec succès
 */

// La route de Catway
router.get('/add', catwayController.renderAddCatwayForm);
router.post('/add', catwayController.addCatway);
router.get('/:id/edit', catwayController.renderEditCatwayForm);
router.put('/:id', catwayController.updateCatway);
router.delete('/:id', catwayController.deleteCatway);
router.get('/', catwayController.getAllCatways);
router.get('/:id', catwayController.getCatwayById); 
router.delete('/:id/reservations/:id_reservation', reservationController.deleteReservation);



module.exports = router;