const AbstractController = require('./AbstractController.js');
const getFile = require('../../app/getFiles.js')();
const config = require('../../app/config.js');

module.exports = class Authenticate extends AbstractController {

    print(request, response) {
        if(typeof request.session.user !== 'undefined') {
            response.redirect('/');
        }
        response.render('admin/dashboard/login.pug');
    }

    process(request, response) {
        if(typeof request.session.user !== 'undefined') {
            response.redirect('/');
        }
        // on doit recevoir les champs email et password
        if(request.body.email != undefined && request.body.password != undefined) {
            getFile.repository('UserRepository').findByEmail(request.body.email).then((user) => {
                if( typeof user != 'undefined') {
                    let bcrypt = require('bcryptjs');
                    
                    if(bcrypt.compareSync(request.body.password, user.password)) {
                        //request.session.user = user;
                        let jwt = require('jsonwebtoken');
                        let Cookies = require( "cookies" );
                        let accessToken = jwt.sign({
                            username: user.email, 
                            firstname : user.firstname, 
                            lastname: user.lastname, 
                            role: user.role || 'user'
                        }, config.appKey, {expiresIn: 604800});   

                        new Cookies(request, response).set('access_token', accessToken, {httpOnly: true, secure: false });
                        request.flash('notify', 'Vous êtes maintenant connecté.');
                        response.redirect('/admin');
                    } else {
                        request.flash('error', `Erreur d'identification`);
                        response.redirect('/connexion');
                    } 
                } else {
                    request.flash('error', `Erreur d'identification`);
                    response.redirect('/connexion');
                }                
            }, () => {
                request.flash('error', `Erreur d'identification`);
                response.redirect('/connexion');
            });
        } else {
            request.flash('error', `Petit malin ^^`);
            response.redirect('/');
        }
    }

    disconnect(request, response) {
        if(typeof request.session.user !== 'undefined') {
            delete request.session.user;
        }
        let Cookies = require( "cookies" );
        new Cookies(request, response).set('access_token', null, {maxAge:0});
        request.flash('notify', 'Vous êtes maintenant déconnecté.');
        response.redirect('/');
    }
};