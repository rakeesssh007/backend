const express=require('express')
const path = require('path')
const registerRouter = express.Router()

const registerController = require('../../controllers/registerController.js')
registerRouter.post('/',registerController.handleNewUser)
module.exports=registerRouter