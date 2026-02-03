const mongoose = require('mongoose');

const catwaySchema = mongoose.Schema({
  catwayNumber: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  catwayType: { 
    type: String, 
    required: true, 
    enum: ['long', 'short'] // Force l'une des deux valeurs demandées
  },
  catwayState: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model('Catway', catwaySchema);