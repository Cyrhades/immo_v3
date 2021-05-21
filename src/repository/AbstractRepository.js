const config = require('../../app/config.js');

module.exports = class AbstractRepository {
    constructor(request)
    {
        if (this.constructor === AbstractRepository) {
            throw new TypeError('Abstract class "AbstractRepository" cannot be instantiated directly');
        }
        this.tableName = this.getTableNameByConstructorName();
        this.request = request;
        this.db = null;
    }

    getTableNameByConstructorName()
    {
        /**
         * On transforme la premiere lettre en minuscule
         * On enleve le mot Repository
         * On transforme toute les lettres majusucules par leur equivalent en minuscule précédée d'un underscore
         */
        return (this.constructor.name+'').charAt(0).toLowerCase()+this.constructor.name.substr(1)
            .replace('Repository','')
            .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    countBy(where = {}) {
        return this.findBy(where, 0, 0, 'COUNT(id) AS count').then((result) => result[0]['count']);
    }

    findBy(where = {}, limit = 0, offset = 0, select = '*') {
        return new Promise((resolve, reject) => {
            // todo modifier realty en nom table
            let query = `SELECT ${select} FROM ${this.tableName}`, data = [];
            if(Object.keys(where).length > 0)  { 
                query += ' WHERE';
                let first = true;
                Object.keys(where).forEach((key) => {
                    if(first) first = false;
                    else query += ' AND';
                    query += ` ${key}=?`; 
                    data.push(where[key]); 
                });
            }
            if(limit > 0)  { query += ' LIMIT ?';  data.push(limit); }
            if(offset > 0) { query += ' OFFSET ?'; data.push(offset); }
            this.connect().query(query, data, function (error, results, fields) {
                if (error) { reject(error.message);}
                else resolve(results);
            });
        });
    }

    add(entity) {
        return new Promise((resolve, reject) => {
            this.connect().query(`INSERT INTO ${this.tableName}  SET ?`, this.insertEntity(entity), function (error, results, fields) {  
                if (error) reject(error.message);
                else resolve(results.insertId);
            });
        });
    }

    update(entity) {            
        return new Promise((resolve, reject) => {
            if( typeof entity['id'] != 'undefined' &&  entity['id'] > 0) {
                let whereId = entity['id'];
                delete entity['id'];
                this.connect().query(`UPDATE ${this.tableName} SET ? WHERE id=?`, [this.updateEntity(entity), whereId], function (error, results, fields) {  
                    if (error) reject(error.message);
                    else resolve(results);
                });
                entity['id'] = whereId;
            } else {
                reject();
            }
        });        
    }

    delete(entity) {
        return new Promise((resolve, reject) => {
            this.connect().query(`DELETE FROM ${this.tableName} WHERE ?`, entity, function (error, results, fields) {  
                if (error) reject(false);
                else resolve(true);
            });
        });
    }

    insertEntity(entity) {
        Object.keys(entity).forEach((name) => {
            let methodeSetKey = 'set'+name.charAt(0).toUpperCase()+name.substr(1);
            // si une methode de setter Existe (il faut la supprimer)
            if(methodeSetKey in entity) {
                Reflect.deleteProperty(entity, methodeSetKey);
            }
        });
        entity.created_by = this.user(); 
        entity.updated_by = this.user();
        entity.created_at = this.now();
        entity.updated_at = this.now();
        
        return entity;
    }

    updateEntity(entity) {
        entity.updated_by = this.user();
        entity.updated_at = this.now();
        return entity;
    }

    connect() {
        if(config.type_db == 'mysql' || config.type_db == 'mongodb') {
            this.db = require(`../../app/database/connect.${config.type_db}.js`)(config)
        }
        return this.db;
    }

    disconnect() {
        this.db.end();
    }
    
    now() {
        return new Date().toISOString().slice(0,19).replace('T', ' ');
    }

    user() {
        // @todo ne devrait pas faire appel au session ici, modifier pour appeler
        //       une méthode dédié à la récupération des infos utilisateurs
        let user = 0;
        if( typeof this.request != 'undefined' 
            && typeof this.request.session != 'undefined' 
            && typeof this.request.session.user != 'undefined' 
            && typeof this.request.session.user.id != 'undefined' 
            && this.request.session.user.id > 0 
        ) {
            user = this.request.session.user.id;
        }
        return user;
    }
}