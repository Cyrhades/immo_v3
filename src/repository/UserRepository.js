const AbstractRepository = require('./AbstractRepository.js');

module.exports = class UserRepository extends AbstractRepository {
    
    // surcharge pour vérifier si l'utilisateur n'est pas déjà enregistré (email unique)
    add(user) {
        return new Promise((resolve, reject) => {
            // On vérifie si l'adresse email existe déjà en BDD
            this.existsEmail(user.email).then((result) => {
                if(result) {
                    reject(`L'adresse email "${user.email}" est déjà présente dans notre base de données.`);
                } else {
                    resolve(super.add(user).then(resolve,reject));
                }
            }, reject);
        });
    }

    existsEmail(email) {
        return new Promise((resolve, reject) => {
            this.connect().query('SELECT count(id) AS count FROM user WHERE ?', {email}, function (error, results, fields) {
                if (error) { reject(error.message);}
                // n'existe pas
                if(results[0].count == 0) resolve(false);
                // existe
                else resolve(true);
            });
        });
    }

    findByEmail(email) {
        return new Promise((resolve, reject) => {
            this.connect().query('SELECT * FROM user WHERE ?', {email}, function (error, results, fields) {
                if (error) { reject(error.message); }
                else if(results.length == 1) resolve(results[0]);
                else { reject('email non trouvé'); }
            });
        });
    }
}