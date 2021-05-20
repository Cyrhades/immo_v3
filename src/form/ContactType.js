const AbstractType = require('./AbstractType.js');

module.exports = class ContactType extends AbstractType {

    formBuilder() {
        this.fieldsForm = {
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
                pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,20}$',
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
                pattern : '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,20}$',
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
            }
        };
        return this;
    }
}