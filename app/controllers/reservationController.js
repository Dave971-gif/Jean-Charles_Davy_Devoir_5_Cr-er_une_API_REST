const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
    try {
        const { catwayNumber } = req.params; // On récupère le numéro du catway depuis l'URL
        const { clientName, boatName, startDate, endDate } = req.body; // On récupère les autres infos depuis le formulaire
        if (startDate >= endDate) {
            return res.status(400).send("La date de début doit être antérieure à la date de fin.");
        } else {
            const newReservation = new Reservation({
                catwayNumber,
                clientName,
                boatName,
                startDate,
                endDate
            });

            console.log("Réservation créée avec succès !");
            res.redirect(`/catways/${catwayNumber}`); // Redirection vers le détail du catway après la création de la réservation
        }

        await newReservation.save();
        
        // On redirige vers le détail du catway pour voir la nouvelle réservation
        res.redirect(`/catways/${catwayNumber}`); 
    } catch (error) {
        res.status(500).send("Erreur lors de la réservation : " + error.message);
    }
};