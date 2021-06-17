const jwt = require('jsonwebtoken')
require('dotenv').config

module.exports = async(req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).json({errors: [{msg: "Not authorized"}]})
    }
    try{
        const decoded = await jwt.verify(token, process.env.SECRET)
        req.user = decoded.user
        next() 
    }catch(error){
        console.log(error)
        return res.status(401).json({errors: [{msg: "Token is not valid"}]})
    }
}
