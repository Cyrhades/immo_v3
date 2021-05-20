const getFile = require(`${__dirname}/../../app/getFiles.js`)();
const config = require('../../app/config.js');
const AbstractController = require('./AbstractController.js');

const ContactEntity = require('../entity/Contact.js');
const ContactRepository = require('../repository/ContactRepository.js');
const RealtyEntity = require('../entity/Realty.js');
const RealtyRepository = require('../repository/RealtyRepository.js');


module.exports = class ProductController extends AbstractController {
    
    delete(request, response) {
        let idProduct = 0;
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            idProduct = parseInt(request.params.id);
        }
        if(idProduct > 0) {  
            // On va supprimer les photos du produits
            //config.directory_product_image+id_product+'/';
            (new RealtyRepository(request)).delete({id : idProduct}).then(() => {
                request.flash('notify', `Le bien a été supprimé`);
                response.redirect('/admin/product');
            });
        } else {
            request.flash('error', `Le bien n'a pas été supprimé une erreur est survenue`);
            response.redirect('/admin/product');
        }
    }

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

    formAddPrint(request, response) {
        response.render('admin/product/form_add', { product : { contact : {}}});  
    }

    formAddProcess(request, response) {  
        request = getFile.service('LcParserService')(request);

        let contact = this.formToEntity(request.body.contact, new ContactEntity()); 
        let realty = this.formToEntity(request.body.realty, new RealtyEntity());

        (new ContactRepository(request)).add(contact).then((idContact) => {
            if(idContact > 0) {
                realty.id_contact = idContact;
                (new RealtyRepository(request)).add(realty).then((idProduct) => {
                    if(idProduct > 0) {
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
                        Promise.all(photos).then((values) => {
                            request.flash('success', `Le bien a été enregistré`);
                            response.redirect('/admin/product');
                        });
                    } else {
                        request.flash('error', `L'enregistrement du bien a échoué`);
                        response.redirect('/admin/product/add');
                    }
                });
            } else {
                request.flash('error', `L'enregistrement du bien a échoué`);
                response.redirect('/admin/product/add');
            }
        }, (message) => {
            request.flash('error', `L'enregistrement du bien a échoué`);
            response.redirect('/admin/product/add');
        });
    }


    formUpdatePrint(request, response) {
        let idProduct = 0;
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            idProduct = parseInt(request.params.id);
        }

        if(idProduct > 0) {
            (new RealtyRepository(request)).findById(idProduct).then((product) => {
                response.render('admin/product/form_add', {product});  
            });
        } else {
            request.flash('error', `Le bien n'a pas été trouvé, une erreur est survenue`);
            response.redirect('/admin/product');
        }
    }

    formUpdateProcess(request, response) {  
        request = getFile.service('LcParserService')(request);

        let idProduct = 0;
        if(typeof request.params != 'undefined' && typeof request.params.id != 'undefined') {
            idProduct = parseInt(request.params.id);
        }

        if(idProduct > 0) {
            (new RealtyRepository(request)).findById(idProduct).then((product) => {
                let photos = [];
                // Enregistrement de nouvelles images
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
                Promise.all(photos).then((values) => {
                    request.flash('success', `Le bien a été enregistré`);
                    response.redirect('/admin/product');
                });
            });
        } else {
            request.flash('error', `Le bien n'a pas été trouvé, une erreur est survenue`);
            response.redirect('/admin/product');
        }
    }
}