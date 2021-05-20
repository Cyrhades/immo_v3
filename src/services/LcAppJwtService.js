const Cookies = require( "cookies" );
const jwt = require('jsonwebtoken');
const config = require('../../app/config.js');

module.exports = (app) => { 
    app.use('/', (req, res, next) => {
        // Récupération du token dans le cookie
        let token = new Cookies(req,res).get('access_token');
        // Si le cookie (access_token) n'existe pas
        if (token !== null && token !== undefined) {
            // sinon on vérifie le jwt
            jwt.verify(token, config.appKey, (err, dataJwt) => { 
                // Erreur du JWT (n'est pas un JWT, a été modifié, est expiré)
                if(err) return res.sendStatus(403);
                res.locals.user = dataJwt;
                res.locals.user.connected = true;
                next();
            });
        } else {
            next();
        }
    });

    // Ajout du middleware du controle d'accès à l'administration avec les JWT
    app.use('/admin', (req, res, next) => {
        // Si on est admin
        if(typeof res.locals.user.role != 'undefined' && res.locals.user.role == 'admin') {
            next();
            return;
        } 
        return res.sendStatus(401);
    });
}