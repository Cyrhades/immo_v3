const config = require('./config.js');
module.exports = () =>{
    return {
        // Permet de charger les repositories
        repository(repositoryName) {
            if(config.type_db == 'mysql') {
                repositoryName = `MySql/${repositoryName}`;
            } else if(config.type_db == 'mongodb'){
                repositoryName = `MongoDB/${repositoryName}`;
            }
            let Repository = require(`${__dirname}/../src/repository/${repositoryName}.js`);
            return new Repository();
        },
        // Permet de charger les controllers
        controller(controllerName) {
            let Controller = require(`${__dirname}/../src/controllers/${controllerName}.js`);
            return new Controller();
        },
        // Chargement des services
        service(serviceName) {
            return require(`${__dirname}/../src/services/${serviceName}.js`);
        }
    }
} 