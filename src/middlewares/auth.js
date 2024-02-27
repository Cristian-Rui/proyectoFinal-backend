export const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

export const checkExistingUser = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

export const checkAdmins = (req, res, next) => {
    let user = req.body;
    const admins = [
        'adminCoder@coder.com',
        'cristian.rui98@gmail.com'
    ]
    const validateEmail = admins.some(admin => admin === user.email)
    if (validateEmail) {
        user.role = 'admin'
    };
    next()
};

export const onlyAdmins = (req, res, next) => {
    const user = req.session.user;
    if (user.role !== 'admin') {
        return res.redirect('/');
    }
    next()
}