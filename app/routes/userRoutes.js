const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');


// Route pour afficher le formulaire
router.get('/add', (req, res) => {
    res.render('user-create'); 
});

// Route UNIQUE pour créer un utilisateur
router.post('/', async (req, res) => {
    try {
        console.log("Données reçues de Postman :", req.body); // Vérification dans le terminal

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        res.redirect('/login');
        res.status(201).send("Utilisateur créé avec succès !");

    } catch (error) {
    if (error.code === 11000) {
        res.status(400).send("Erreur : Cet email est déjà utilisé par un autre agent.");
    } else {
        res.status(400).send({ error: error.message });
    }
}
});

module.exports = router;