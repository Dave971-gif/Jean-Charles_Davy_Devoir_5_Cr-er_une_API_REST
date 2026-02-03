const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

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
        res.status(201).send("Utilisateur créé avec succès !");
    } catch (error) {
        console.log("Erreur détaillée :", error.message);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;