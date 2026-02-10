const Catway = require('../models/Catway');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

// On affiche tous les catways et tous les utilisateurs dans le dashboard
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

// On affiche les détails d'un catway + ses réservations associées
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

//On affiche le formulaire de modification d'un catway
exports.renderEditCatwayForm = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.catwayNumber);
        const catway = await Catway.findOne({ catwayNumber: catwayNumber });

        if (!catway) {
            return res.status(404).send("Catway non trouvé");
        }
        res.render('catway-edit', { catway: catway });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};

//On traite la modification d'un catway
exports.updateCatway = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.catwayNumber);
        const { catwayType, catwayState } = req.body;
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: catwayNumber },
            { catwayType, catwayState },
            { new: true }
        );

        if (!catway) {
            return res.status(404).send("Catway non trouvé");
        }
        res.redirect(`/catways/${catway.catwayNumber}`);
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};

//On supprime un catway
exports.deleteCatway = async (req, res) => {
    try {
        const catwayNumber = parseInt(req.params.catwayNumber);
        const catway = await Catway.findOneAndDelete({ catwayNumber: catwayNumber });
        if (!catway) {
            return res.status(404).send("Catway non trouvé");
        }
        res.redirect('/catways');
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};

//On affiche le formulaire d'ajout d'un catway
exports.renderAddCatwayForm = (req, res) => {
    res.render('catway-add');
};

//On traite l'ajout d'un catway
exports.addCatway = async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;
        const existingCatway = await Catway.findOne({ catwayNumber: catwayNumber });
        if (existingCatway) {
            return res.status(400).send("Un catway avec ce numéro existe déjà.");
        }
        const newCatway = new Catway({
            catwayNumber: catwayNumber,
            catwayType: catwayType,
            catwayState: catwayState
        });

        await newCatway.save();
        res.redirect('/catways');

    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};