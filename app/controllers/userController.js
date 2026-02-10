const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// INSCRIPTION
exports.signup = async (req, res, next) => {
    try {
        // On attend (await) que bcrypt finisse de hacher
        const hash = await bcrypt.hash(req.body.password, 10);
        
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });

        // On attend que la sauvegarde soit finie
        await user.save();
        res.redirect('/catways');
        res.status(201).json({ message: 'Utilisateur créé !' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CONNEXION
exports.login = async (req, res) => {
    try {
        // 1. On cherche l'utilisateur par son email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send('Utilisateur non trouvé');
        }

        // 2. On compare les mots de passe
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).send('Mot de passe incorrect');
        }

        // 3. On crée le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. LE POINT CRUCIAL : On stocke le token dans un cookie
        // 'httpOnly' empêche le vol de token par script (XSS)
        res.cookie('token', token, { httpOnly: true, secure: false });

        // 5. On redirige vers le dashboard
        res.redirect('/catways');

    } catch (error) {
        res.status(500).send(error.message);
    }
};

// SUPPRESSION D'UN UTILISATEUR
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/catways'); 
    } catch (error) {
        res.status(500).send("Erreur");
    }
};