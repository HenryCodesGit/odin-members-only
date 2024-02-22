exports.read_get = function(req, res, next) {
    req.logout(
        (err) => {
            if (err) next(err);
            res.redirect("/");
    })
}