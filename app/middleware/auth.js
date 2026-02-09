const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       // 1. On récupère le token dans le header "Authorization"
       // Le format est souvent "Bearer TOKEN", donc on split pour prendre le 2ème élément
       const token = req.headers.authorization.split(' ')[1];
       
       // 2. On décode le token avec la phrase secrète du .env
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       
       // 3. On extrait le userId du token
       const userId = decodedToken.userId;
       
       // 4. On l'ajoute à l'objet requête pour que les autres routes y aient accès
       req.auth = { userId };
       
       next(); 
   } catch(error) {
       res.status(401).json({ error: 'Requête non authentifiée !' });
   }
};