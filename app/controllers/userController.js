const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @description Modifie les informations d'un utilisateur existant.
 * @route POST /users/:id/edit
 * @access Privé (Agent connecté)
 * @param {Object} req - Contient l'ID dans params et les nouvelles infos dans body.
 * @param {Object} res - Redirige vers la fiche détail de l'utilisateur.
 */


// AFFICHAGE D'UN UTILISATEUR
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        return res.render('users', {
            users: users,
            title: "Gestion des Utilisateurs"
        });
    } catch (error) {
        return res.status(500).send("Erreur lors de la récupération des utilisateurs : " + error.message);
    }
};

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
        return res.redirect('/users');
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
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
        return res.redirect('/dashboard');

    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// SUPPRESSION D'UN UTILISATEUR
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.redirect('/users');

    } catch (error) {
        return res.status(500).send("Erreur lors de la suppression de l'utilisateur : " + error.message);
    }
};

// DETAIL D'UN UTILISATEUR
exports.getUserDetail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send("Utilisateur non trouvé");
        }
        return res.render('users/user-detail', {
            user: user,
            title: "Détails de l'Utilisateur"
        });
    } catch (error) {
        return res.status(500).send("Erreur lors de la récupération des détails de l'utilisateur : " + error.message);
    }
};

// AFFICHAGE DU FORMULAIRE DE MODIFICATION D'UN UTILISATEUR
exports.editUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).send("Utilisateur non trouvé");
        }

        return res.render('users/user-edit', {
            user: user,
            title: "Modifier l'Utilisateur"
        });
    } catch (error) {
        return res.status(500).send("Erreur lors de l'affichage du formulaire de modification : " + error.message);
    }
};

// MODIFICATION D'UN UTILISATEUR
exports.editUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Utilisateur non trouvé");
        } 
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        
        await user.save();
        return res.redirect('/users/' + user._id + '/detail');

    } catch (error) {
        return res.status(500).send("Erreur lors de la modification de l'utilisateur : " + error.message);
    }
};

