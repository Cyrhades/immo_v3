module.exports = (config = null) => {
    if(config === null) {
        config = require('../config.js');
    }
    return require('mysql').createConnection(config.db);
};