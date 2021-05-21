const AbstractController = require('./AbstractController.js');

module.exports = class DashboardController extends AbstractController {

    print(request, response) {
        response.render('admin/dashboard/index');
    }

};