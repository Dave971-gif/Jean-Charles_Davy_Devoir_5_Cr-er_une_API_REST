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

            await newReservation.save();

            console.log("Réservation créée avec succès !");
            res.redirect(`/catways/${catwayNumber}`); // Redirection vers le détail du catway après la création de la réservation
        }
    } catch (error) {
        res.status(500).send("Erreur lors de la réservation : " + error.message);
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