const jwt = require("jsonwebtoken");
const  errorHandler = require("./error.js");

const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return (errorHandler(401, 'Unauthorized'))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return (errorHandler(401, 'Unauthorized'))
        }
        req.user = user
        next()
    })
};

module.exports = verifyUser



