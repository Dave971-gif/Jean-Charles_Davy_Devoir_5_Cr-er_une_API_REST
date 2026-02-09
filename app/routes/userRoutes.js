const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');


// Route pour afficher le formulaire de création et d'ajout d'un utilisateur 
router.get('/add', (req, res) => {
    res.render('user-create'); 
});

router.get('/register', async (req, res) => {
    res.render('user-register');
});

// Route UNIQUE pour créer un utilisateur
router.post('/', async (req, res) => {
    try {
        console.log("Données reçues de Postman :", req.body); 

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        res.redirect('/');
        res.status(201).send("Utilisateur créé avec succès !");

    } catch (error) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("Cet email est déjà utilisé par un autre agent.");
        } else {
            res.status(400).send({ error: error.message });
        }
    }
});

// Route de suppression d'un utilisateur
router.get('/delete/:id', userController.deleteUser);

module.exports = router;

