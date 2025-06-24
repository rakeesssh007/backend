const express = require('express')
const app =express()
const path = require('path')
const verifyJWT=require('./middleware/verifyJWT')
const cookieParser=require('cookie-parser')

const errorHandler=require('./middleware/errHandler')
const {logger}=require('./middleware/logEvents')

const homeRouter=require('./routes/homeRouter')
const employeeRouter=require('./routes/api/employeeRouter')
const registerRouter=require('./routes/api/registerRouter')
const authRouter=require('./routes/authRouter')
const logoutRouter=require('./routes/logoutRouter')

const port=process.env.PORT || 4000;

//built-in middlewares
app.use(express.urlencoded({extended:false})); //parses the data from body of request
app.use(express.json()); //parses json
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))  // helps us serve static files 

//another way of custom middleware is below

//const middle1 = ((req,res,next)=>{
  //  console.log("attempt")
    //next();
//})
//app.use(middle1)
//app.get(
   // /hello(\.html)?/,
    //(req,res,next)=>{
//        console.log("attempt")
  //      next();
  //  },
   // (req,res,next)=>{
     //   console.log("Hello Guys")
       // next();
 //   },
   // (req,res)=>{
     //   res.send("Welcome")
 //   }
//);


//3rd-party middleware
const cors = require('cors')
const corsOptions=require('./config/corsOptions')
app.use(cors(corsOptions))
//custom middleware
app.use(logger)
app.use(require('./middleware/credentials'))

//routes
app.use('/',homeRouter)
app.use('/register',registerRouter)
app.use('/auth',authRouter)
app.use('/refresh',require('./routes/refreshRouter'))
app.use('/logout',require('./routes/logoutRouter'))

//api routes
app.use('/api/employee',verifyJWT,employeeRouter)

app.get(/^\/.*/,(req,res)=>{
    res.status(404)
    if(req.accepts('html'))
        res.sendFile(path.join(__dirname,'nodejs_web_server-main','views','404.html'))
    else if(req.accepts('json'))
        res.send({error:"404 Not Found"})
    else
    res.type('txt'),send('404 Not Found')
})
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`)
})
