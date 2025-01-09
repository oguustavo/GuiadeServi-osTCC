module.exports = class AdminControllers {
    static dashboard(req, res) {
        // Verifica se o usuário é um administrador
        if (!req.session.isAdmin) {
            req.flash('message', 'Acesso negado');
            return res.redirect('/');
        }

        // Renderiza a página do dashboard
        res.render('admin/dashboard');
    }
} 