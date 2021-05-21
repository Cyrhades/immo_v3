const AbstractType = require('./AbstractType.js');
const ContactType = require('./ContactType.js');

module.exports = class RealtyType extends AbstractType {

    formBuilder() {
        this.groupFieldsForm = {
            realty : {
                seller : {
                    pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,80}$',
                    regError: 'Le nom ne doit pas comporter de caractères spéciaux',
                    maxlength: 80,
                    minlength: 1,
                    required: true,
                    label : 'Nom du vendeur',
                    type : 'text',
                    attr : {
                        class : "form-control",
                        placeholder : "Nom du vendeur"
                    }
                },
                address1 : {
                    pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?|=]{1,80}$',
                    regError: `L'adresse ne doit pas comporter de caractères spéciaux`,
                    maxlength: 80,
                    minlength: 1,
                    required: true,
                    label : 'Adresse',
                    type : 'text',
                    attr : {
                        class : "form-control",
                        placeholder : "Adresse"
                    }
                },
                address2 : {
                    pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?|=]{1,80}$',
                    regError: `L'adresse ne doit pas comporter de caractères spéciaux`,
                    maxlength: 80,
                    minlength: 0,
                    required: false,
                    label : false,
                    type : 'text',
                    attr : {
                        class : "form-control",
                        placeholder : "suite adresse (facultatif)"
                    }
                },
                zipcode : {
                    pattern : '[0-9]{1,10}$',
                    regError: `L'adresse ne doit pas comporter de caractères spéciaux`,
                    maxlength: 10,
                    minlength: 4,
                    required: false,
                    label : 'Code postal',
                    type : 'text',
                    attr : {
                        class : "form-control",
                        placeholder : "Code postal"
                    }
                },
                city : {
                    pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?|=]{1,80}$',
                    regError: `La ville ne doit pas comporter de caractères spéciaux`,
                    maxlength: 80,
                    required: false,
                    label : 'Ville',
                    type : 'text',
                    attr : {
                        class : "form-control",
                        placeholder : "Ville"
                    }
                },
                info_address : {
                    maxlength: 5000,
                    required: false,
                    label : 'Informations complémentaires',
                    type : 'textarea',
                    attr : {
                        style : "height:200px;width:100%;",
                        class : "form-control",
                        placeholder : "Distances des transports en commun, commerces de proximités, etc"
                    }
                },
                type : {
                    required: true,
                    label : 'Type de bien',
                    type : 'select',
                    attr : {
                        class : "form-control"
                    },
                    choices : {
                        1 : 'Maison',
                        2 : 'Appartement',
                        3 : 'Terrain',
                        4 : 'Parking',
                        5 : 'Local / Bureau',
                        6 : 'Autres'
                    }
                },
                price : {
                    maxlength: 5,
                    minlength: 1,
                    required: false,
                    label : 'Prix net vendeur',
                    type : 'number',
                    attr : {
                        class : "form-control",
                        placeholder : "Prix net vendeur"
                    }
                },
                amount_commission : {
                    maxlength: 5,
                    minlength: 1,
                    required: false,
                    label : 'Commision',
                    type : 'number',
                    attr : {
                        class : "form-control",
                        placeholder : "Montant de commission"
                    }
                },
                percentage_commission : {
                    maxlength: 5,
                    minlength: 1,
                    required: false,
                    label : false,
                    type : 'number',
                    attr : {
                        class : "form-control",
                        placeholder : "% de commission"
                    }
                },
                area : {
                    maxlength: 5,
                    minlength: 1,
                    required: false,
                    label : 'Surface (m²)',
                    type : 'number',
                    attr : {
                        min :"0",
                        step :"1",
                        class : "form-control",
                        placeholder : "Surface (m²)"
                    }
                },
                percentage_commission : {
                    maxlength: 5,
                    minlength: 1,
                    required: false,
                    label : 'Pièces',
                    type : 'number',
                    attr : {
                        min :"0",
                        step :"1",
                        class : "form-control",
                        placeholder : "Nombre de pièces"
                    }
                },
                type_product : {
                    required: true,
                    label : 'Type de ventes',
                    type : 'select',
                    attr : {
                        class : "form-control"
                    },
                    choices : {
                        1 : 'Ancien',
                        2 : 'Neuf',
                        3 : 'Viager'
                    }
                },
                info_realty : {
                    maxlength: 5000,
                    required: false,
                    label : 'Informations complémentaires sur le bien',
                    type : 'textarea',
                    attr : {
                        style : "height:90px;width:100%;",
                        class : "form-control",
                        placeholder : "Travaux à effectuer, classe énergie, GES, etc"
                    }
                },
                plan : {
                    required: false,
                    label : false,
                    type : 'textarea',
                    id : 'homeRoughData',
                    attr : {                        
                        style : "dhisplay:none;"
                    }
                },
            },
            contact : {
                email : {
                    pattern : '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
                    regError: 'Le champs doit être au format email',
                    required: true,
                    label : 'Email',
                    type : 'email',
                    attr : {
                        class : "form-control",
                        placeholder : "Email"
                    }
                },
                civility : {
                    required: true,
                    label : false,
                    type : 'select',
                    attr : {
                        class : "form-control"
                    },
                    choices : {
                        1 : 'Monsieur',
                        2 : 'Madame'
                    }
                },
                lastname : {
                    pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,40}$',
                    regError: 'Le nom ne doit pas comporter de caractères spéciaux',
                    maxlength: 40,
                    minlength: 1,
                    required: true,
                    label : false,
                    type : 'text',
                    attr : {
                        class : "form-control",
                        placeholder : "Nom"
                    }
                },
                firstname : {
                    pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,40}$',
                    regError: 'Le prénom ne doit pas comporter de caractères spéciaux',
                    maxlength: 40,
                    minlength: 3,
                    required: true,
                    label : false,
                    type : 'text',
                    attr : {
                        class : "form-control",
                        placeholder : "Prénom"
                    }
                },
                phone : {
                    pattern: '^(0|\\+33|0033)+[0-9\. ]{9,13}$',                
                    regError: 'Le numéro de téléphone doit être au format français',
                    label : false,
                    type : 'tel',
                    attr : {
                        class : "form-control",
                        placeholder : "Téléphone"
                    }
                },
                mobile : {
                    pattern: '^(0|\\+33|0033)+[0-9\. ]{9,13}$',                
                    regError: 'Le numéro de mobile doit être au format français',
                    label : false,
                    type : 'tel',
                    attr : {
                        class : "form-control",
                        placeholder : "Mobile"
                    }
                },
                info : {
                    maxlength: 5000,
                    required: false,
                    label : 'Informations complémentaires',
                    type : 'textarea',
                    attr : {
                        style : "height:90px;width:100%;",
                        class : "form-control",
                        placeholder : "Disponibilités"
                    }
                },
            }
        };
        return this;
    }
}