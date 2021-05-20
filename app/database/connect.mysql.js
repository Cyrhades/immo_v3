const config = require('../config');
module.exports = require('mysql').createConnection(config.db);