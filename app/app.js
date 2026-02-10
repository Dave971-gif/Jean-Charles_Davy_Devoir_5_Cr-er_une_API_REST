require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');


const catwayRoutes = require('./routes/catwayRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userController = require('./controllers/userController');
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

// --- ROUTES PUBLIQUES ---
app.get('/', (req, res) => 
    res.render('index')
); 

app.get('/register', (req, res) => 
    res.render('user-register')
);

app.post('/login', userController.login); 
app.post('/users', userController.signup);

// --- ROUTES PROTÉGÉES ---
// Le middleware "auth" s'assure que le cookie est présent et valide
app.use('/catways', auth, catwayRoutes);
app.use('/catways/:catwayNumber/reservations', auth, reservationRoutes);
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