module.exports = class AbstractType {
    constructor(entity = null) {
        this.defaultErrors = {
            regError: 'Le champ ne correspond pas à une valeur attendue',
            maxError: 'Le champs doit contenir au maximum %maxlength% caractères',
            minError: 'Le champs doit contenir au moins %minlength% caractères',
        };
        this.dataEntity = entity;
        this.error = null;  // erreur global
        this.errors = {};   // erreur spécifique sur un champs
        this.fieldsForm = {};
        this.request;
        this.formBuilder()
    }

    handler(request) {
        this.request = request;
    }

    isSubmit() {
        return (typeof this.request.body != 'undefined');
    }

    isValidate() {
        let isValid = false;
        if(this.isSubmit()) {
            isValid = true;
            Object.keys(this.fieldsForm).forEach((key) => {
                if(typeof this.fieldsForm[key].type != 'undefined') {
                    switch(this.fieldsForm[key].type) {
                        case 'select' :                 
                            if(this.isValidSelect(key) != true) {
                                isValid = false;
                            }
                            break;
                        
                        default :
                            if(this.isValidInput(key) != true) {
                                isValid = false;
                            }                            
                            break;
                    }
                }
                else if(this.isValidInput(key) != true) isValid = false;
            });
        } 

        return isValid;
    }

    createView() {
        let fields = {label:{}, widget:{}, row:{}, error:{}};
        Object.keys(this.fieldsForm).forEach((key) => {
            fields.label[key] = this.getLabel(key);
            fields.widget[key] = this.getField(key);
            fields.row[key] = fields.label[key]+' '+fields.widget[key];
            fields.error[key] = (typeof this.errors[key] != 'undefined' 
                ? `<div class="alert alert-sm alert-danger">${this.errors[key]}</div>`
                : ''
            );
        });

        return fields;
    }    

    entity(entityName = null) {
        if(this.isSubmit()) {            
            if(entityName === null) {
                return this.request.body;
            } else if(typeof this.request.body[entityName] != 'undefined') {
                return this.request.body[entityName];
            }
        }
        return {};
    }

    getField(key) {
        if(typeof this.fieldsForm[key].type != 'undefined') {
            switch(this.fieldsForm[key].type) {
                case 'email' : 
                case 'password' : 
                case 'text' : 
                case 'tel' :
                    return  this.getInput(key, this.fieldsForm[key].type);
                    break;
                case 'select' :                 
                    return  this.getSelect(key);
                    break;
            }
        } else {
            // par défaut on considére comme un champ texte
            return  this.getInput(key, 'text');
        }
    }

    getLabel(key) {
        if(typeof this.fieldsForm[key].label != 'undefined' && this.fieldsForm[key].label !== false) {
            return `<label for="${key}">${this.fieldsForm[key].label}</label>`;   
        } else {
            return  ``;
        }
    }

    getInput(key, type) {
        let attrs = ` id="${key}" name="${key}"`;
        if(typeof this.fieldsForm[key].maxlength != 'undefined') {
            attrs += ` maxlength="${this.fieldsForm[key].maxlength}"`;
        }
        if(typeof this.fieldsForm[key].pattern != 'undefined') {
            attrs += ` pattern="${this.fieldsForm[key].pattern}"`;
        }
        if(typeof this.fieldsForm[key].regError != 'undefined') {
            attrs += ` title="${this.fieldsForm[key].regError}"`;
        }
        if(typeof this.fieldsForm[key].required != 'undefined') {
            attrs += ` required`;
        }
        
        // On boucle sur les attributs propre à HTML
        if(typeof this.fieldsForm[key].attr != 'undefined') {
            Object.keys(this.fieldsForm[key].attr).forEach((name) => {
                attrs += ` ${name}="${this.fieldsForm[key].attr[name]}"`;
            });
        }

        // si le formulaire à été soumis
        let data = [];        
        if (typeof this.request.body != 'undefined') {
            if(typeof this.request.body[key] != 'undefined') {
                data[key] = this.request.body[key];
            }
            let className = (typeof this.errors[key] != 'undefined' 
                ? `is-invalid`
                : 'is-valid'
            );
            if(attrs.indexOf('class="')== -1)  {
                attrs += ` class="${className}"`;
            }
            else {
                attrs = attrs.replace( `class="`,  `class="${className} `);
            }   
        } 
        else if (typeof this.dataEntity != 'undefined') {
       
            if(typeof this.dataEntity[key] != 'undefined') {
                data[key] = this.dataEntity[key];
            }
        }

        if(typeof data[key] != 'undefined') {
            attrs += ` value="${data[key].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;")}"`;        
        }
        return `<input type="${type}"${attrs}>`;   
    }    

    getSelect(key) {
        let options = '';
        let attrs = ` id="${key}" name="${key}"`;
        if(typeof this.fieldsForm[key].required != 'undefined') {
            attrs += ` required`;
        }

        if(typeof this.fieldsForm[key].choices != 'undefined') {
            Object.keys( this.fieldsForm[key].choices).forEach((option) => {
                let selected = '';
                if (typeof this.request.body != 'undefined' && typeof this.request.body[key] != 'undefined') {
                    if (option == this.request.body[key]) selected = 'selected="selected"';
                } 
                else if (typeof this.dataEntity != 'undefined') {       
                    if(typeof this.dataEntity[key] != 'undefined') {
                        if (option == this.dataEntity[key]) selected = 'selected="selected"';
                    }
                }


                options += `<option value="${option}"${selected}>${this.fieldsForm[key].choices[option]}</option>`;
            });
        }
        // On boucle sur les attributs propre à HTML
        if(typeof this.fieldsForm[key].attr != 'undefined') {
            Object.keys(this.fieldsForm[key].attr).forEach((name) => {
                attrs += ` ${name}="${this.fieldsForm[key].attr[name]}"`;
            });
        }
        let className = (typeof this.errors[key] != 'undefined' 
            ? `is-invalid`
            : 'is-valid'
        );

        if(attrs.indexOf('class="')== -1)  {
            attrs += ` class="${className}"`;
        }
        else {
            attrs = attrs.replace( `class="`,  `class="${className} `);
        } 
  
        return `<select${attrs}>${options}</select>`;   
    }


    isValidSelect(key) {
        
        if(typeof this.request.body[key] == 'undefined') {
            // @todo le formulaire a été modifié
        }
        else {
            // si le champs est vide mais qu'il n'est pas obligatoire
            if(this.request.body[key] == '' && 
                (typeof this.fieldsForm[key].required == 'undefined' || this.fieldsForm[key].required !== true)) {
                    return true;
            }
            else if(typeof this.fieldsForm[key].choices != 'undefined') {
                // on boucle sur les options
                for (let option of Object.keys(this.fieldsForm[key].choices)) { 
                    // si la valeur reçue correspond à une valeur attendue
                    if(option == this.request.body[key]) {
                        return true;
                    }
                }
            }
        }
        // dans les autres cas on considére que ce n'est pas correct
        return false;
    }

    isValidInput(key) {
        if(typeof this.request.body[key] == 'undefined') {
            // @todo le formulaire a été modifié
        }
        else {
            // si le champs est vide mais qu'il n'est pas obligatoire
            if(this.request.body[key] == '' 
                && (typeof this.fieldsForm[key].required == 'undefined' 
                    || this.fieldsForm[key].required !== true)
            ) {
                return true;
            }

            // sinon il doit correspondre à tout les autres critéres
            if(typeof this.fieldsForm[key].maxlength != 'undefined') {
                
                if(this.request.body[key].length > this.fieldsForm[key].maxlength) {
                    this.errors[key] = (typeof this.fieldsForm[key].maxError != 'undefined'
                        ? this.fieldsForm[key].maxError.replace('%maxlength%', this.fieldsForm[key].maxlength) 
                        : this.defaultErrors.maxError.replace('%maxlength%', this.fieldsForm[key].maxlength) 
                    );
                    return false;
                }
            }

            if(typeof this.fieldsForm[key].minlength != 'undefined') {
                if(this.request.body[key].length < this.fieldsForm[key].minlength) {
                    
                    this.errors[key] = (typeof this.fieldsForm[key].minError != 'undefined' 
                        ? this.fieldsForm[key].minError.replace('%minlength%', this.fieldsForm[key].minlength)  
                        : this.defaultErrors.minError.replace('%minlength%', this.fieldsForm[key].minlength)  
                    );
                    return false;
                }
            }

            if(typeof this.fieldsForm[key].pattern != 'undefined') {
                let reg = new RegExp(this.fieldsForm[key].pattern);
                if(reg.test(this.request.body[key]) !== true) {
                    this.errors[key] = (typeof this.fieldsForm[key].minError != 'undefined' 
                        ? this.fieldsForm[key].regError 
                        : this.defaultErrors.regError  
                    );
                    return false;
                }
            }
        }
        // le champ respect l'ensemble des conditions imposéss
        return true;
    }
}
