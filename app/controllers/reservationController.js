const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
    try {
        const { catwayNumber } = req.params; // On récupère le numéro du catway depuis l'URL
        const { clientName, boatName, startDate, endDate } = req.body; // On récupère les autres infos depuis le formulaire

        const newReservation = new Reservation({
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        });

        await newReservation.save();
        
        // On redirige vers le détail du catway pour voir la nouvelle réservation
        res.redirect(`/catways/${catwayNumber}`); 
    } catch (error) {
        res.status(500).send("Erreur lors de la réservation : " + error.message);
    }
};