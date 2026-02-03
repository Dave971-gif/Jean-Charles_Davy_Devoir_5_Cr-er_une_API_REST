const Catway = require('../models/Catway');

exports.getAllCatways = async (req, res) => {
    try {
        // On récupère tous les catways dans la base
        const catways = await Catway.find();
        // On envoie ces données à une vue EJS nommée 'dashboard'
        res.render('dashboard', { catways });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des catways");
    }
};



exports.getCatwayById = async (req, res) => {
    try {
        // On affiche dans le terminal ce que le navigateur envoie
        console.log("Valeur reçue dans l'URL :", req.params.id);

        // On récupère le paramètre et on s'assure que c'est un nombre entier
        const id = parseInt(req.params.id);

        // Si la conversion échoue (NaN), on arrête tout de suite proprement
        if (isNaN(id)) {
            return res.status(400).send("Le numéro du catway doit être un chiffre valide.");
        }
        const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });        if (!catway) {
        
            return res.status(404).send("Catway non trouvé");
        }
        res.render('catwayDetail', { catway });
    } catch (error) {
        res.status(500).send("Erreur : " + error.message);
    }
};