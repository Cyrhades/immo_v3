const config = require('../config.js');
const mongoose = require('mongoose');

mongoose.connect(
    `mongodb+srv://${config.db.user}:${config.db.pwd}@${config.db.cluster}.mongodb.net/${config.db.dbname}`, 
    {connectTimeoutMS : 3000, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.once('open', () => {
   console.log(`connexion OK !`);
});

module.exports = mongoose;