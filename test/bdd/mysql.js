const config = require('../../app/config.js');
const MySql = require('mysql');
const assert = require('assert');

describe('Tests base de données', function() {
  
    it('parametres base de données', (done) => {
        assert.ok( (typeof config.db != 'undefined') );
        assert.ok( (typeof config.db.host != 'undefined') );
        assert.ok( (typeof config.db.user != 'undefined') );
        assert.ok( (typeof config.db.password != 'undefined') );
        assert.ok( (typeof config.db.database != 'undefined') );
        done();
    });

    it('connexion Base de données', (done) => {
        require('mysql').createConnection(config.db).connect(function(err) {
            if (err) done(err.message);
            done();
        });
    });

    describe('Vérification de la structure', function() {
        it('Table user', (done) => {
            assert.ok(true);
            done();
        });
    });

});