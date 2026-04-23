module.exports = function (roles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization denied' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }

    next();
  };
};
