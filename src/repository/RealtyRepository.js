const AbstractRepository = require('./AbstractRepository.js');
const ContactRepository = require('../repository/ContactRepository.js');

module.exports = class RealtyRepository extends AbstractRepository {
    findById(id, limit = 0, offset = 0, select = '*') {
        return new Promise((resolve, reject) => {
            this.findBy({id}).then((product) => {
                if(product[0] !== null) {
                    let repoContact = new ContactRepository();
                    repoContact.findBy({id:product[0].id_contact}).then((contact) => {
                        product[0].contact = contact[0];
                        resolve(product[0]);
                    });
                }
                else { 
                    reject();
                }
            }, () => { reject(); });
        });
    }
}