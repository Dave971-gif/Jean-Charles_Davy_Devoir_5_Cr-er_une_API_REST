const Catway = require('../models/Catway');
const User = require('../models/user');

exports.getAllCatways = async (req, res) => {
    try {
        // 1. On récupère tous les catways
        const catways = await Catway.find();
        
        // 2. On récupère TOUS les utilisateurs de la capitainerie
        const users = await User.find();

        // 3. On envoie les deux variables à la vue 'dashboard
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