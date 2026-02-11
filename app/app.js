require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');


const catwayRoutes = require('./routes/catwayRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userController = require('./controllers/userController');
const User = require('./models/User');
const Reservation = require('./models/Reservation');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const app = express();

// --- CONNEXION MONGODB ---
// On utilise une fonction asynchrone pour rester cohérent avec ton style
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connexion à MongoDB réussie !');
    } catch (err) {
        console.log('❌ Échec connexion MongoDB :', err);
    }
};
connectDB();

// --- CONFIGURATION & MIDDLEWARES ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

// --- AFFICHAGE DE LA PERSONNE CONNECTÉE ---
app.use(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // On récupère l'utilisateur précis qui possède ce token
            const currentUser = await User.findById(decoded.userId);

            res.locals.user = currentUser; 

        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// --- ROUTES PUBLIQUES ---
app.get('/', (req, res) => 
    res.render('index')
); 

app.get('/dashboard', auth, async (req, res) => {
    try {
        // 1. On récupère les réservations en base de données
        const reservations = await Reservation.find().limit(5); // On limite aux 5 dernières

        res.render('dashboard', { 
            reservations: reservations 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du chargement du dashboard");
    }
});

app.get('/register', (req, res) => 
    res.render('users/user-register')
);

app.post('/login', userController.login); 
app.post('/users', userController.signup);

// --- ROUTES PROTÉGÉES ---
// Le middleware "auth" s'assure que le cookie est présent et valide
app.use('/catways', auth, catwayRoutes);
app.use('/reservations', auth, reservationRoutes);
app.use('/users', auth, userRoutes);

// --- LOGOUT ---
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

// --- LANCEMENT ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur prêt sur : http://localhost:${PORT}`);
});