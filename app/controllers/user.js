const bcrypt = require('bcrypt');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// INSCRIPTION
exports.signup = async (req, res, next) => {
    try {
        // On attend (await) que bcrypt finisse de hacher
        const hash = await bcrypt.hash(req.body.password, 10);
        
        const user = new User({
            email: req.body.email,
            password: hash
        });

        // On attend que la sauvegarde soit finie
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CONNEXION
exports.login = async (req, res, next) => {
    try {
        // 1. On cherche l'utilisateur
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
        }

        // 2. On vérifie le mot de passe
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
        }

        // 3. Tout est bon, on ajoute le Token JWT
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id }, // Ce qu'on cache dans le token (son ID)
                process.env.JWT_SECRET, // Une phrase secrète que seul ton serveur connaît
                { expiresIn: '24h' } // Durée de validité du jeton
            )
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};