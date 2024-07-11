export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next()
    } else {
        res.redirect('/login')
    }
}

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next()
    } else {
        res.redirect('/products')
    }
}

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.session.user.role)) {
            return next()
        } else {
            if (req.session.user.role === "admin") {
                res.redirect("/realtimeproducts")
            } else {
                res.send({ message: "No autorizado" });
            }
        }
    };
};
