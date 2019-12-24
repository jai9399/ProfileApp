const mongoose = require('mongoose');
const validator = require('validator');
require('../db/mongoose')
const UserSchema = mongoose.Schema({
      age:{type:Number,required:true,validate(value){
          if(value<0 || value>100){
              throw new Error('Invalid Age')
          }
      }
    },
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Incorrect Email');
        }}},
    password:{type:String,minlength:8,required:true},
    avatar:{
        type:Buffer
    }},
{timestamps:true});
const jwt = require('jsonwebtoken');
UserSchema.methods.generateToken= function(){
     const user = this ;
     const token =jwt.sign({ _id:user._id.toString() },process.env.JWT_SECRET,{expiresIn:"10 minutes"});
     return token
}
const User = mongoose.model('Users',UserSchema);

module.exports = User;