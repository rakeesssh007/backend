const express=require('express')
const logoutRouter=express.Router()
const path = require('path')
const {handleLogout}=require('../controllers/logoutController')
logoutRouter.post('/',handleLogout)
module.exports=logoutRouter