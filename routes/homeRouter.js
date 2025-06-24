const express=require('express')
const homeRouter=express.Router()
const path = require('path')

homeRouter.get(/^\/$|^\/index(\.html)?/,(req,res)=>{
    res.sendFile(path.join(__dirname,'..','nodejs_web_server-main','views','index.html'))
})

module.exports=homeRouter

