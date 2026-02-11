const Reservation = require('../models/Reservation');

/**
 * @description Récupère les détails d'un catway spécifique et ses réservations.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */


exports.getAllReservations = async (req, res) => {
    try {
        // On récupère toutes les réservations en base
        const reservations = await Reservation.find();

        res.render('reservations', {
            reservations: reservations,
            title: "Liste Globale des Réservations"
        });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des réservations : " + error.message);
    }
};

exports.addReservation = async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;
        
        const newResa = new Reservation({
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        });

        await newResa.save();
        
        res.redirect('/reservations'); 
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const { catwayNumber, id } = req.params; // On récupère le numéro du catway et l'ID de la réservation depuis l'URL

        await Reservation.findByIdAndDelete(id);
        
        console.log("Réservation supprimée !");
        // On redirige vers la fiche du catway pour voir la liste mise à jour
        res.redirect(`/catways/${catwayNumber}`);
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression : " + error.message);
    }
};