const jwt = require('jsonwebtoken')
const User = require('../models/user')
author = async (req,res,next)=>{
    const token = res.getHeader('Authorization')
    console.log(token)
    if(!token){
        return res.send('Please Authenticate')
    }
    try{
    const decode = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decode._id)
    const user = await User.findOne({"_id":decode._id})
    console.log(user)
    if(user){
        req.user = user;
        next();
    }
    if(!user){
        res.send('Please Authenticate')
    }
}
    catch(e){
     res.send('Token Expired.Login Again!')
    }
    
}
module.exports = author