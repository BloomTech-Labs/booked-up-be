module.exports = (role) => {
    return function(req,res,next) {
        if (req.decodedJwt.userType.includes('author') || req.decodedJwt.userType.includes('fan') || req.decodedJwt.userType.includes('agent') || req.decodedJwt.userType.includes('admin')) {
            next()
        } else {
            res.status(403).json({ message: "You do not have permission" }); 
        }
    }
}