const AbstractController = require('./AbstractController.js');
const ContactEntity = require('../entity/Contact.js');
const ContactRepository = require('../repository/ContactRepository.js');
const ContactType = require('../form/ContactType.js');
const RealtyRepository = require('../repository/RealtyRepository.js');


module.exports = class ContactController extends AbstractController {

    list(request, response) {
        let repo = (new ContactRepository(request));
        let page = parseInt(request.query.page) || 1;
        let limit = 10;
        let offset = (limit*page)-limit;

        repo.countBy().then((count) => {
            let last = Math.ceil(count/limit);
            repo.findBy({}, limit, offset).then((contacts) => {
                response.render('admin/contact/list', {
                    contacts,
                    page,
                    last
                }); 
            });
        });
    }

    formAddProcess(request, response) {
        let wait = null;
        // En cas de modification
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            wait = new Promise((resolve,reject) => {
                (new ContactRepository(request)).findBy({id : request.params.id}).then((contact) => {
                    resolve(this.dataToEntity(contact[0], new ContactEntity()) );
                });
            });
        } else {
            wait = Promise.resolve(new ContactEntity());
        }

        wait.then((contact) => {
            // préparation du formulaire
            let form = new ContactType(contact);
            form.handler(request);
            // si formulaire soumis
            if(form.isSubmit()) {
                // vérification du formulaire
                if(form.isValidate()) {
                    contact = this.formToEntity(form.entity(), contact); 
                    
                    let promise = null;
                    // si modification
                    if(typeof contact.id != 'undefined' && contact.id > 0) {
                        promise = (new ContactRepository(request)).update(contact);
                    } else {
                        promise = (new ContactRepository(request)).add(contact);
                    }
                    // quand l'enregistrement en BDD a été effectué
                    promise.then((result) => {
                        // si modification
                        if(typeof result != 'undefined' && result.insertId == 0) {
                            request.flash('notify', 'Le contact a bien été modifié.');
                        } else {
                            request.flash('notify', 'Le contact a bien été ajouté.');
                        }
                        response.redirect('/admin/contact/');
                    }, (message) => {
                        // erreur global au formulaire
                        request.flash('error', message);
                        response.render('admin/contact/form_add', {form : form.createView()} );
                    });
                } else {
                    response.render('admin/contact/form_add', {form : form.createView()} );
                }
            } else {                
                response.render('admin/contact/form_add', {form : form.createView()} );
            }
        });
    }


    delete(request, response) {
        let idContact = 0;
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            idContact = parseInt(request.params.id);
        }
        if(idContact > 0) {  
            (new ContactRepository(request)).delete({id : idContact}).then(() => {
                // On sélection également les biens associés à ce contact ...
                (new RealtyRepository(request)).findBy({id_contact : idContact}).then((result) => {
                    // ... pour les supprimer
                    request.flash('notify', `Le contact a été supprimé`);
                    response.redirect('/admin/contact');
                });
            });
        } else {
            request.flash('error', `Le contact n'a pas été supprimé une erreur est survenue`);
            response.redirect('/admin/contact');
        }
    }
};