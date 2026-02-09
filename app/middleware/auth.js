const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       // On récupère le token soit dans les cookies (pour le navigateur) 
       // soit dans le header (pour Postman/API)
       const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
       
       if (!token) {
           return res.redirect('/login'); 
       }

       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       const userId = decodedToken.userId;
       
       req.auth = { userId };
       
       next(); 
   } catch(error) {
       res.clearCookie('token');
       res.redirect('/login');
   }
};