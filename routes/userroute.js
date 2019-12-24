const express = require('express');
const User = require('../models/user');
var token1='';
const router = new express.Router();
const sharp = require('sharp');
const auth = require('../middleware/auth')
router.use((req,res,next)=>{
    res.setHeader('Authorization',token1);
    next();
})
const multer = require('multer')
const upload =multer({
    limits:{
        fileSize:1024*1024
    } ,
    fileFilter(req,file,cb){
        if(file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(undefined,true);
        }
        else{
            cb(new Error('Must be Image'))
        }
        // cb(new Error('Must be Image'))
        // cb(undefined,true)
    }
})
router.post('/users',async function(req,res){
    console.log(req.body)
    const user1 = new User(req.body);
    console.log(user1)
    const token = await user1.generateToken();
    token1=token;
    console.log(token1)
    try{
       await user1.save();
       res.send('hello')
    }
    catch(e){
       res.send(e)
    } })
router.post('/users/login',async function(req,res){
    const user = req.body;
    console.log(user)
    const finder = await User.findOne({'email':user.email})
    
    if(finder==null){
       return  res.send('Incorrect Credentials')
    }
    if(user.password != finder.password){
        return res.send('Incorrect Credentials')
    }
    token1 = finder.generateToken();
    res.send(user)

}
)    
router.post('/users/logout',async function(req,res){
          token1='';
          res.send('Logged Out')  
}
)

router.get('/profile',auth,async function(req,res){

//console.log(req.user)
  //  res.send(req.user)
  res.send(req.user)
 }) 
 router.delete('/profile/delete',auth,async (req,res)=>{
     const user = await User.findByIdAndDelete(req.user._id);
     res.send('Deleted user');
 })
 router.delete('/profile/avatar/delete',auth,async (req,res)=>{
     req.user.avatar = undefined;
     await req.user.save();   
    res.send('Deleted Image');
})
router.get('/profile/avatar',auth,async (req,res)=>{
     try{
         const user = await User.findById(req.user._id); 
         if(!user || !user.avatar){
             throw new Error('Not found')
         }
         res.setHeader('Content-type','image/jpg')
         res.send(user.avatar)
     }
     catch(e){
         res.status(404).send(e.message)
     }
})

router.post('/profile/avatar',auth,upload.single('upload'),async(req,res)=>{
    //req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer).resize({
        width:250,
        height:250
    }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save(); 
    res.send('Uploaded!');
},(err,req,res,next)=>{
    res.send(err.message)
})
module.exports = router;
