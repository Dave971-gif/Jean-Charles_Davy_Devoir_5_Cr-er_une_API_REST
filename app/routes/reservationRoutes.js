const express = require('express');
const router = express.Router({ mergeParams: true }); 
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getAllReservations);
router.post('/add', reservationController.addReservation);

module.exports = router;