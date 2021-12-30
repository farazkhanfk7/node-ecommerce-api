const jwt = require('jsonwebtoken')
const config = require('config')

const auth = (req,res,next) => {
    // get token from header
    const token = req.header('x-auth-token');
    // if no token ( unauthorised )
    if(!token){
        return res.status(401).json({ msg : "No token. Authorization denied"});
    }
    // if token : add decoded user to req.user
    try{
        const decoded = jwt.verify(token , config.get('secretKey'));
        req.user = decoded.user;
        next();
    }catch(err){
        console.error(err.message)
        res.status(401).json({ msg: "Token is not valid"});
    }
}

module.exports = auth;