module.exports = () =>{
    return {
        // Erreur 405 : Method not Allowed
        error405(req, res, next) {
            res.status(405).render('errors/error_405');
        },
        // Erreur 404 : Page not Found
        error404(req, res, next) {
            res.status(404).render('errors/error_404');
        }
    }
} 