const express=require('express')
const path = require('path')
const authRouter = express.Router()

const authController = require('../controllers/authController')
authRouter.post('/',authController.handleLogin)
module.exports=authRouter