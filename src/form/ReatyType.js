const AbstractType = require('./AbstractType.js');
const ContactType = require('./ContactType.js');

module.exports = class RealtyType extends AbstractType {

    formBuilder() {
        this.fieldsForm = {
           contact : new ContactType()
        };
        return this;
    }
}