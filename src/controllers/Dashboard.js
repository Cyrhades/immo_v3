const AbstractController = require('./AbstractController.js');

module.exports = class DashboardController extends AbstractController {

    print(request, response) {
        if(typeof request.session.user !== 'undefined') {
            response.render('admin/dashboard/index');
        } else {
            response.redirect('/connexion');  
        }
    }

};