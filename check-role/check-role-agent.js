module.exports = (role) => function (req, res, next) {
  if (req.decodedJwt.userType.includes('agent') || req.decodedJwt.userType.includes('admin')) {
    next();
  } else {
    res.status(403).json({ message: 'You do not have permission' });
  }
};
