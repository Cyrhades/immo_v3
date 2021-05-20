const assert = require('assert');
let stubRequest = { session : {} };
let stubResponse = { locals : {}, status : (code) => { return stubResponse; }, send : (message) => { stubResponse.message = message; } };
const token = require('../src/services/LcCsrfToken.js')();

describe(`Création d'un token csrf`, () => {
    it(`Test avant la generation d'un CSRF`, (done) => {
        assert.strictEqual(typeof stubRequest.session.token_csrf, 'undefined');
        assert.strictEqual(typeof stubResponse.locals.token_csrf, 'undefined');
        done();
    });

    it(`Test après la generation d'un CSRF`, (done) => {
        token.generate(stubRequest, stubResponse, ()=>{});
        assert.strictEqual(stubResponse.locals.token_csrf, stubRequest.session.token_csrf);
        assert.strictEqual((new RegExp('[0-9a-f]{40}')).test(stubResponse.locals.token_csrf), true);

        done();
    });

    it(`Test de la vérification d'un CSRF correct`, (done) => {
        stubRequest.body = { csrf : stubResponse.locals.token_csrf} 
        assert.strictEqual(token.verify(stubRequest, stubResponse, () => true), true);
        done();
    });

    it(`Test de la vérification d'un CSRF incorrect`, (done) => {
        stubRequest.body = { csrf : 'Mauvais token'} 
        token.verify(stubRequest, stubResponse, () => true)
        assert.strictEqual(stubResponse.message, 'Cross-site request forgery détecté!');
        done();
    });

    it(`Test de la vérification sans CSRF`, (done) => {
        stubRequest.body = {};
        token.verify(stubRequest, stubResponse, () => true)
        assert.strictEqual(stubResponse.message, 'Cross-site request forgery détecté!');
        done();
    });
});