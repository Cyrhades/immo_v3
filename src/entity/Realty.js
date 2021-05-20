module.exports = class Realty {
    
    id;
    id_contact;
    // adresse
    seller;
    address1;
    address2;
    zipcode;
    city;
    info_address;
    // bien
    type;
    area;
    room;
    type_product;
    price;    
    amount_commission;
    percentage_commission;
    info_realty;
    plan;
 
    setId(id) {
        this.id = parseInt(id);
    }

    setId_contact(id_contact) {
        if(isNaN(parseInt(id_contact))) id_contact = 0;
        this.id_contact = parseInt(id_contact);
    }

    setType(type) {
        if(isNaN(parseInt(type))) type = 1;
        this.type = parseInt(type);
    }

    setArea(area) {
        if(isNaN(parseInt(area))) area = 0;
        this.area = parseInt(area);
    }

    setRoom(room) {
        if(isNaN(parseInt(room))) room = 0;
        this.room = parseInt(room);
    }

    setType_product(type_product) {
        if(isNaN(parseInt(type_product))) type_product = 1;
        this.type_product = parseInt(type_product);
    }
    
    setPrice(price) {
        if(isNaN(parseFloat(price))) price = 0;
        this.price = parseFloat(price);
    }

    setAmount_commission(amount_commission) {
        if(isNaN(parseFloat(amount_commission))) amount_commission = 0;
        this.amount_commission = parseFloat(amount_commission);
    }

    setPercentage_commission(percentage_commission) {
        if(isNaN(parseFloat(percentage_commission))) percentage_commission = 0;        
        this.percentage_commission = parseFloat(percentage_commission);
    }
}