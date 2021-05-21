const config = require('./config.js');
module.exports = () =>{
    return {
        // Permet de charger les repositories
        repository(repositoryName, ...args) {
            if(config.type_db == 'mysql') {
                repositoryName = `MySql/${repositoryName}`;
            } else if(config.type_db == 'mongodb'){
                repositoryName = `MongoDB/${repositoryName}`;
            }
            let Repository = require(`${__dirname}/../src/repository/${repositoryName}.js`);
            return new Repository(...args);
        },
        // Permet de charger les controllers
        controller(controllerName, ...args) {
            let Controller = require(`${__dirname}/../src/controllers/${controllerName}.js`);
            return new Controller(...args);
        },
        // Permet de charger les entities
        entity(entityName, ...args) {
            let Entity = require(`${__dirname}/../src/entity/${entityName}.js`);
            return new Entity(...args);
        },
        // Permet de charger les formulaires
        form(formName, ...args) {
            let Form = require(`${__dirname}/../src/form/${formName}.js`);
            return new Form(...args);
        },
        // Chargement des services
        service(serviceName) {
            return require(`${__dirname}/../src/services/${serviceName}.js`);
        }
    }
} 