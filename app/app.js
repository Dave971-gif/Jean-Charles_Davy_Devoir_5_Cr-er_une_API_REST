require('dotenv').config();
const express = require('express');
const path = require('path');
const catwayRoutes = require('./routes/catwayRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userController = require('./controllers/userController');
const app = express();

const mongoose = require('mongoose');

// On récupère l'URL depuis le fichier .env
const dbPath = process.env.MONGO_URL;

mongoose.connect(dbPath)
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.log('❌ Connexion à MongoDB échouée :', err));

// 1. Configuration du moteur de rendu (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middlewares de base
app.use(express.json()); // Pour lire le JSON envoyé au serveur
app.use('/images', express.static(path.join(__dirname, 'images'))); // Pour rendre les images accessibles
app.use(express.urlencoded({ extended: true }));

// 3. Route principale 
app.get('/', (req, res) => {
    res.render('index');
});


// 4. Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur prêt sur : http://localhost:${PORT}`);
});


// 5. Connexion à MongoDB avec Mongoose


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://davejc971_db_user:MonMDP971@cluster0.fldcrax.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// 6. Routes pour les Catways et pour les Réservations
app.use('/catways', catwayRoutes);
app.use('/users', userRoutes);
app.use('/catways/:catwayNumber/reservations', reservationRoutes);

// 7. Route pour la connexion avec vérification basique
const bcrypt = require('bcrypt');
const User = require('./models/user');

app.post('/login', async (req, res) => {
    try {
        console.log("Tentative de connexion avec :", req.body.email);
        
        // 1. On cherche l'utilisateur dans la base par son email
        const user = await User.findOne({ email: req.body.email });

        // 2. Si l'utilisateur n'existe pas
        if (!user) {
            return res.status(401).send('Utilisateur non trouvé');
        }

        // 3. On compare le mot de passe tapé avec le mot de passe crypté en base
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(401).send('Mot de passe incorrect');
        }

        // 4. Redirection vers le dashboard
        res.redirect('/catways');

    } catch (error) {
        res.status(500).send('Erreur serveur : ' + error.message);
    }
});

// 8. Déconnexion 
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

// 9. Suppression d'une réservation
app.use('/catways/:catwayNumber/reservations', reservationRoutes);

// 10. Création d'un compte utilisateur personnel 
app.get('/register', (req, res) => {
    res.render('user-register'); 
});

console.log("Contenu de userController :", userController);
app.post('/users', userController.signup);

//11. Ajout des cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());