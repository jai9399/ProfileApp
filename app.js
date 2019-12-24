const express = require('express')
const app = express();

const User = require('./models/user')
const route1 = require('./routes/userroute')

app.use(express.json())
app.use(express.urlencoded())
app.use(route1)

const multer = require('multer')
const upload= multer({
    dest:'images',
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
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send();
})
const port = process.env.port;
app.listen(port,()=>{
    console.log('Running',port)
})
