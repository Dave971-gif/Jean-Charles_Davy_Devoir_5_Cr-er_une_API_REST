require('dotenv').config();
const express = require('express');
const path = require('path');
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

// 3. Première route de test
app.get('/', (req, res) => {
    res.render('index', { message: "Super ! Le nouveau serveur fonctionne." });
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

// 6. Routes pour gérer les images (CRUD) à ajouter ici