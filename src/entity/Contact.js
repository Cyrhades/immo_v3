module.exports = class Contact {
    
    id;
    civility;
    lastname;
    firstname;
    mobile;
    phone;
    email;
    info;

    setId(id) {
        this.id = parseInt(id);
    }

    setCivility(civility) {
        if(isNaN(civility)) civility = 1;
        this.civility = parseInt(civility);   
    }
}