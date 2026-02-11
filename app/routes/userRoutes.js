const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');

// Route pour lister tous les utilisateurs
router.get('/', userController.getAllUsers);

// Route pour afficher le formulaire de création (Vue dans le dossier users)
router.get('/add', (req, res) => {
    res.render('users/user-create'); 
});

// Route pour TRAITER le formulaire de création (Appelée par le formulaire POST)
router.get('/register', (req, res) => {
    res.render('users/user-register'); 
});

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        
        // On redirige vers la liste des utilisateurs pour voir le nouveau créé
        res.redirect('/users'); 

    } catch (error) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send("Cet email est déjà utilisé par un autre agent.");
        }
        res.status(400).send({ error: error.message });
    }
});

router.get('/delete/:id', userController.deleteUser);

module.exports = router;