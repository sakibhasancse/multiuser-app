module.exports = (req, res, next) => {
    if (!req.session.adminisLoggedIn) {
        return res.redirect('/');
    }
    next();
}