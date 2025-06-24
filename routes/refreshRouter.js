const express=require('express')
const refreshRouter= express.Router()
const refreshController = require('../controllers/refreshController')
const path = require('path')
 
refreshRouter.post('/',refreshController.handleRefreshToken)

module.exports=refreshRouter