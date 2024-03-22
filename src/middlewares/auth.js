export const checkExistingUser = (req, res, next) => {
    if (req.user) {
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