module.exports = class AbstractController {
    constructor()
    {
        if (this.constructor === AbstractController) {
            throw new TypeError('Abstract class "AbstractController" cannot be instantiated directly');
        }
    }

    isConnected(request, response, next) {
        if(typeof request.session.user !== 'undefined') {
            next();
        } else {
            response.redirect('/admin');
            // et on ne fait pas le next
        }
    }

    hasRole(roles = []) {
        
        if(this.request !== null) {
            
            return true;
        }
        return false;
    }

    dataToEntity(data, entity) {
        let entityDescriptor = Object.getOwnPropertyDescriptors(entity);
        if( typeof data['id'] != 'undefined'
            && typeof entityDescriptor['id'] != 'undefined' 
            && entityDescriptor['id'].writable === true
        ) {
            entity['id'] =  data['id'];
        }
       return this.formToEntity(data, entity);
    }

    formToEntity(form, entity) {
        let entityDescriptor = Object.getOwnPropertyDescriptors(entity);
        // on boucle sur les éléments du formulaire
        Object.keys(form).forEach((key) => {
            //si le nom du champ n'est pas id et qu'il exsite
            if( key!='id'
                && typeof entityDescriptor[key] != 'undefined' 
                && entityDescriptor[key].writable === true
            ) {
                let methodeSetKey = 'set'+key.charAt(0).toUpperCase()+key.substr(1);
                // si une methode de setter Existe (il y a une particularité sur le champs)
                if(methodeSetKey in entity) {
                    eval(entity[methodeSetKey](form[key]));
                } else {
                    // sinon on pousse directement
                    entity[key] = form[key];
                }
            }
        });
        // on retourne l'entity
        return entity;
    }

    deleteFolderRecursive(directoryPath) {
        let fs = require('fs');
        if (fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach((file, index) => {
                const curPath = path.join(directoryPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    deleteFolderRecursive(curPath);
                } else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(directoryPath);
        }
    }
}