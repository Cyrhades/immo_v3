const config = require('../../app/config.js');

module.exports = {
    moveFile(file, id_product) {
        return new Promise((resolve, reject) => {
            const regex = /[^a-z0-9_]/i;
            let baseName = file.name.replace(regex,'_').replace('__','_');
            let uploadPath = config.directory_product_image+id_product+'/'+baseName;
            file.mv(uploadPath, (err) => resolve(id_product+'/'+baseName));
        });
    }
}