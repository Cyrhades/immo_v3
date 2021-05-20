const UserRepository = require('../repository/UserRepository.js');
const AbstractController = require('./AbstractController.js');

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
            (new UserRepository).findByEmail(request.body.email).then((result) => {
                if( typeof result != 'undefined') {
                    let bcrypt = require('bcryptjs');
                    console.log(bcrypt.compareSync(request.body.password, result.password));
                    if(bcrypt.compareSync(request.body.password, result.password)) {
                        request.session.user = result;
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
        request.flash('notify', 'Vous êtes maintenant déconnecté.');
        response.redirect('/');
    }
};