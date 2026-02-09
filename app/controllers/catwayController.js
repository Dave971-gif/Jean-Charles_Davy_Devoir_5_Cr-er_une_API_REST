const Catway = require('../models/Catway');
const User = require('../models/user');
const Reservation = require('../models/Reservation');

exports.getAllCatways = async (req, res) => {
    try {
        // 1. On récupère tous les catways
        const catways = await Catway.find();
        
        // 2. On récupère TOUS les utilisateurs de la capitainerie
        const users = await User.find();

        // 3. On envoie les deux variables à la vue dashboard
        res.render('dashboard', { 
            catways: catways, 
            users: users 
        });

    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des données : " + error.message);
    }
};

exports.getCatwayById = async (req, res) => {
    try {
        console.log("Valeur reçue dans l'URL :", req.params.id);
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).send("Le numéro du catway doit être un chiffre valide.");
        }

        // 1. On cherche le catway
        const catway = await Catway.findOne({ catwayNumber: id });
        
        if (!catway) {
            return res.status(404).send("Catway non trouvé");
        }

        // 2. On cherche toutes les réservations liées à ce numéro de catway
        const reservations = await Reservation.find({ catwayNumber: id });

        // 3. On envoie les DEUX variables au fichier EJS
        res.render('catwayDetail', { 
            catway: catway, 
            reservations: reservations 
        });

    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};