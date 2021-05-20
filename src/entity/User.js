module.exports = class User {
    
    id;
    civility;
    lastname;
    firstname;
    phone;
    email;
    password;
    
    setId(id) {
        this.id = parseInt(id);
    }

    setLastname(lastname) {
        this.lastname = lastname.toUpperCase();
    }
    
    setCivility(civility) {
        this.civility = parseInt(civility);
        if(isNaN(this.civility)) {
            this.civility = 1;
        }
    }
}