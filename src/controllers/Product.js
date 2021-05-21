const getFile = require(`${__dirname}/../../app/getFiles.js`)();
const AbstractController = require('./AbstractController.js');

const ContactEntity = require('../entity/Contact.js');
const ContactRepository = require('../repository/ContactRepository.js');
const RealtyEntity = require('../entity/Realty.js');
const RealtyRepository = require('../repository/RealtyRepository.js');

const RealtyType = require('../form/RealtyType.js');

module.exports = class ProductController extends AbstractController {
    
    list(request, response) {
        let repo = (new RealtyRepository(request));
        let page = parseInt(request.query.page) || 1;
        let limit = 10;
        let offset = (limit*page)-limit;

        repo.countBy().then((count) => {
            let last = Math.ceil(count/limit);
            repo.findBy({}, limit, offset).then((products) => {
                response.render('admin/product/list', {
                    products,
                    page,
                    last
                }); 
            });
        });
    }

    formAddProcess(request, response) {  
        request = getFile.service('LcParserService')(request);

        let wait = null;
        // En cas de modification
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            wait = new Promise((resolve,reject) => {
                (new RealtyRepository(request)).findBy({id : request.params.id}).then((realty) => {
                    if(realty.length == 1 && realty[0].id_contact > 0) {
                        (new ContactRepository(request)).findBy({id : realty[0].id_contact}).then((contact) => {
                            resolve({
                                'realty' : this.dataToEntity(realty[0], new RealtyEntity()),
                                'contact' : this.dataToEntity(contact[0], new ContactEntity())
                            });
                        });
                    } else { reject(); }
                });
            });
        } else {
            wait = Promise.resolve({'realty' : new RealtyEntity(), 'contact' : new ContactEntity()});
        }

        wait.then((data) => {  
            // préparation du formulaire
            let form = new RealtyType(data);
            form.handler(request);
            // si formulaire soumis
            if(form.isSubmit()) {
                // vérification du formulaire
                if(form.isValidate()) {
                    
                    let contact = this.formToEntity(form.entity('contact'), data.contact); 
                    let realty = this.formToEntity(form.entity('realty'), data.realty);

                    let promise = new Promise((resolve, reject) => {
                        // modification d'un bien
                        if(     typeof contact.id != 'undefined' && contact.id > 0
                            &&  typeof realty.id != 'undefined' && realty.id > 0
                        ) {
                            (new ContactRepository(request)).update(contact).then(() => {
                                (new RealtyRepository(request)).update(realty).then(() => {
                                    resolve(realty.id)
                                });
                            });
                        } else {                 
                            (new ContactRepository(request)).add(contact).then((idContact) => {
                                if(idContact > 0) {
                                    realty.id_contact = idContact;
                                    (new RealtyRepository(request)).add(realty).then(resolve);
                                } else {
                                    reject();
                                }
                            });
                        }
                    });
                    
                    promise.then((idProduct) => {                
                        let photos = this.addPhoto(request, idProduct);
                        Promise.all(photos).then((values) => {
                            // si modification
                            if(typeof realty.id != 'undefined' && realty.id > 0) {
                                request.flash('notify', 'Le bien a été modifié.');
                            } else {
                                request.flash('notify', 'Le bien a été ajouté.');
                            }
                            response.redirect('/admin/product');
                        });
                    }, () => { 
                        request.flash('error', `L'enregistrement du bien a échoué`);
                        response.render('admin/product/form_add', {form : form.createView()} );
                    });
                } else {
                    response.render('admin/product/form_add', {form : form.createView()} );
                }
            }
            else {
                response.render('admin/product/form_add', {form : form.createView()} );
            }
        });
    }

    addPhoto(request, idProduct)
    {
        let photos = [];
        // Enregistrement des images
        if(typeof request.files != 'undefined' && request.files != null) {
            const UploadImageProduct = getFile.service('UploadImageProduct'); 
            if(typeof request.files.photos != 'undefined') {
                if(typeof request.files.photos === 'object') {
                    request.files.photos = [request.files.photos];
                }
                if(request.files.photos.length > 0) {
                    Object.values(request.files.photos).forEach(file => {
                        let newImg = UploadImageProduct.moveFile(file, idProduct).then((url) => {
                            // @todo enregistrer en BDD pour permettre la gestion de l'ordre des images
                        });
                        photos.push(newImg);
                    });
                } 
            }                     
        }
        return photos;
    }

    delete(request, response) {
        let idProduct = 0;
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            idProduct = parseInt(request.params.id);
        }
        if(idProduct > 0) {  
            // On va supprimer les photos du produits
            (new RealtyRepository(request)).delete({id : idProduct}).then(() => {
                request.flash('notify', `Le bien a été supprimé`);
                response.redirect('/admin/product');
            });
        } else {
            request.flash('error', `Le bien n'a pas été supprimé une erreur est survenue`);
            response.redirect('/admin/product');
        }
    }
}