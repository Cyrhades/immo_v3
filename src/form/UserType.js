const AbstractType = require('./AbstractType.js');

module.exports = class UserType extends AbstractType {

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
            password : {
                pattern : '(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
                regError: 'Le champs doit contenir au moins 8 caractères dont au moins 1 minusucule, 1 majuscule, 1 chiffre et 1 caractère spécial',
                required: true,
                label : false,
                type : 'password',
                attr : {
                    class : "form-control",
                    placeholder : "Mot de passe",
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
            }
        };
        return this;
    }
}