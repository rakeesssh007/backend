const userDB ={
    users:require("../models/users.json"),
    setUsers:function(data) {this.users=data}
};

const path=require('path')
const fsPromises=require('fs').promises
const bcrypt = require('bcrypt')

const handleNewUser=async(req,res)=>{
    const{username,password}=req.body;
    if(!username || !password)
        return res.status(400).json({"message":"Username and Password are required"})
    const duplicate = userDB.users.find(user=>user.username===username)
    if(duplicate)
        return res.status(409).json({ message: "Username already exists" });
    try{
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser ={username,password:hashedPassword,roles:{"User":2001}}
        userDB.setUsers([...userDB.users,newUser])
        console.log(newUser)
        await fsPromises.writeFile(path.join(__dirname,'..','models','users.json'),JSON.stringify(userDB.users))
        res.status(201).json({"message":"`New user is created"})
    }
    catch(error){
        res.status(500).json({"message":error.message})

    }
}

module.exports={handleNewUser}