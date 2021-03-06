const urlencodedParser = require('body-parser').urlencoded({extended: true});
const uploadFile = require('express-fileupload')({createParentPath: true});
const csrf = require('../src/middleware-express/ho-csrf.js');
let errorsHTTP = require('./errorsHTTP.js')();
let getFile = require('./getFiles.js')();

module.exports = (app) => {
   // Ajout du middleware de gestion des JWT
   getFile.service('LcAppJwtService')(app);

    // ACCUEIL
    app.route("/")
        .get(getFile.controller('Home').print)
        .all(errorsHTTP.error405);
    
    // MOT DE PASSE OUBLIE
    app.route("/mot_de_passe_oublie")
        .get(csrf.token, getFile.controller('ResetPassword').print)        
        .post(urlencodedParser, csrf.verify,  (req, res, next) => {
            // cas particulier ou on envoi l'app pour générer l'email à partir d'un template
            // on a donc besoin de l'app express pour utiliser render sans retourner une réponse 
            getFile.controller('ResetPassword').process(req, res, app)
        })
        .all(errorsHTTP.error405);


    // CONNEXION
    app.route("/connexion")
        .get(csrf.token, getFile.controller('Authenticate').print)
        .post(urlencodedParser, csrf.verify, getFile.controller('Authenticate').process)
        .all(errorsHTTP.error405);

    app.route("/deconnexion")
        .get(getFile.controller('Authenticate').disconnect)
        .all(errorsHTTP.error405);
    
    //...
    //-------------------------------------------------------------------------------------
    //                  ADMIN
    //-------------------------------------------------------------------------------------
    // Dashboard
    app.route("/admin")
        .get(getFile.controller('Dashboard').print)
        .all(errorsHTTP.error405);
    
    //-------------------------------------------------------------------------------------
    //                  Les produits
    //-------------------------------------------------------------------------------------
    let Product = getFile.controller('Product');
    // Listing des Produits
    app.route("/admin/product")
        .get(Product.list)
        .all(errorsHTTP.error405);

    // ajout de produit
    app.route("/admin/product/add")
        .get(csrf.token, Product.formAddProcess.bind(Product))
        .post(urlencodedParser, uploadFile, csrf.verify, Product.formAddProcess.bind(Product))
        .all(errorsHTTP.error405);    

    // modification de produit
    app.route("/admin/product/edit/:id")
        .get(csrf.token, Product.formAddProcess.bind(Product))
        .post(urlencodedParser, uploadFile,  csrf.verify, Product.formAddProcess.bind(Product))
        .all(errorsHTTP.error405);    

    // suppression de produit
    app.route("/admin/product/delete/:id")
        .get(Product.delete)
        .all(errorsHTTP.error405); 
 
    //-------------------------------------------------------------------------------------
    //                  Les conacts
    //-------------------------------------------------------------------------------------
    let Contact = getFile.controller('Contact');
    // Listing des contacts
    app.route("/admin/contact")
        .get(Contact.list)
        .all(errorsHTTP.error405); 

    // ajout de contact
    app.route("/admin/contact/add")
        .get(csrf.token, Contact.formAddProcess.bind(Contact))
        .post(urlencodedParser, csrf.verify, Contact.formAddProcess.bind(Contact))
        .all(errorsHTTP.error405); 

    // modification de contact
    app.route("/admin/contact/edit/:id")
        .get(csrf.token, Contact.formAddProcess.bind(Contact))
        .post(urlencodedParser, uploadFile, csrf.verify, Contact.formAddProcess.bind(Contact))
        .all(errorsHTTP.error405);    

    // suppression
    app.route("/admin/contact/delete/:id")
        .get(Contact.delete)
        .all(errorsHTTP.error405); 


    //-------------------------------------------------------------------------------------
    //                  Les collaborateurs
    //-------------------------------------------------------------------------------------
    let User = getFile.controller('User');
    // Listing des collaborateurs
    app.route("/admin/user")
        .get(User.list)
        .all(errorsHTTP.error405); 

    // ajout de collaborateur   
    app.route("/admin/user/add")
        .get(csrf.token, User.formAddProcess.bind(User))
        .post(urlencodedParser, csrf.verify, User.formAddProcess.bind(User))
        .all(errorsHTTP.error405); 

    // modification de collaborateur   
    app.route("/admin/user/edit/:id")
        .get(csrf.token, User.formAddProcess.bind(User))
        .post(urlencodedParser, csrf.verify, User.formAddProcess.bind(User))
        .all(errorsHTTP.error405); 
        
    // suppression
    app.route("/admin/user/delete/:id")
        .get(User.delete)
        .all(errorsHTTP.error405); 

    
    //-------------------------------------------------------------------------------------
    //                  Erreur 404 (doit être en derniere)
    //-------------------------------------------------------------------------------------
    app.route("*").all(errorsHTTP.error404);
};