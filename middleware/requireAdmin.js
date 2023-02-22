const requireAdmin = (req, res, next) => {

    if (!req.isAdmin) {
        return res.status(403).json({ message: 'No permission to access this resource.' });
    }
    next();
}

module.exports = requireAdmin;