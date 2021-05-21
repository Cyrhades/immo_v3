const AbstractController = require('./AbstractController.js');
const getFile = require('../../app/getFiles.js')();

module.exports = class UserController extends AbstractController {

    list(request, response) {
        let repo = getFile.repository('UserRepository', request); 
        let page = parseInt(request.query.page) || 1;
        let limit = 10;
        let offset = (limit*page)-limit;

        repo.countBy().then((count) => {
            let last = Math.ceil(count/limit);
            repo.findBy({}, limit, offset).then((users) => {
                response.render('admin/user/list', {
                    users,
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
                getFile.repository('UserRepository', request).findBy({id : request.params.id}).then((user) => {
                    resolve(this.dataToEntity(user[0], getFile.entity('User')) );
                });
            });
        } else {
            wait = Promise.resolve(getFile.entity('User'));
        }
       
        wait.then((user) => {
            // préparation du formulaire
            let form = getFile.form('UserType', user);
            form.handler(request);
            // si formulaire soumis
            if(form.isSubmit()) {
                // vérification du formulaire
                if(form.isValidate()) {
                    user = this.formToEntity(form.entity(), user); 
                    let bcrypt = require('bcryptjs');
                    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));

                    let promise = null;
                    // si modification
                    if(typeof user.id != 'undefined' && user.id > 0) {
                        // on ne permet pas la modification du mot de passe depuis cette interface
                        delete user.password; 
                        promise = getFile.repository('UserRepository', request).update(user);
                    } else {
                        promise = getFile.repository('UserRepository', request).add(user);
                    }
                    promise.then((result) => {
                        if(typeof result != 'undefined' && result.insertId == 0) {
                            request.flash('notify', 'Le collaborateur a bien été modifié.');
                        } else {
                            request.flash('notify', 'Le collaborateur a bien été ajouté.');
                        }
                        response.redirect('/admin/user/');
                    }, (message) => {
                        // erreur global au formulaire
                        request.flash('error', message);
                        response.render('admin/user/form_add', {form : form.createView()} );
                    });
                } else {
                    response.render('admin/user/form_add', {form : form.createView()} );
                }
            } else {
                response.render('admin/user/form_add', {form : form.createView()} );
            }
        });
    }
    
    delete(request, response) {
        let idUser = 0;
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            idUser = parseInt(request.params.id);
        }

        if(idUser > 0) {  
            getFile.repository('UserRepository', request).delete({id :idUser}).then((result) => {
                request.flash('notify', `Le collaborateur a été supprimé`);
                response.redirect('/admin/user');
            });
        } else {
            request.flash('error', `Une erreur est survenue`);
            response.redirect('/admin/user');
        }
    }
};