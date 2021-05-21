const AbstractController = require('./AbstractController.js');
const getFile = require('../../app/getFiles.js')();

module.exports = class ResetPassword extends AbstractController {
    
    print(request, response) {
        response.render('admin/dashboard/regenerate_password.pug');
    }

    process(request, response, app) {
        let MailerService = getFile.service('Mailer')
        let mailer = new MailerService();
        let email = request.body.email; 
        // On génére le mail
        app.render('mails/regenerate_password.pug', {}, function(err, html) {
            // On vérifie si l'adresse email existe dans notre NDD
            getFile.repository('UserRepository').existsEmail(email).then((result) => {
                // si l'email existe
                if(result) {
                    // on envoi le mail
                    mailer.send(email, 'Mot de passe oublié', html);
                }
                // Dans tout les cas on met une flashbag et une redirection
                request.flash('notify', 'Un mail vous a été envoyé.');
                response.redirect('/admin');
            }).then((error) => {
                request.flash('notify', 'Une erreur est survenue.');
                response.redirect('/admin');
            });
        });
    }
};