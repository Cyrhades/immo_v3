const AbstractController = require('./AbstractController.js');

module.exports = class HomeController extends AbstractController {
    print(request, response) {
        response.render('home', {text: 'hello world'});  
    }
};