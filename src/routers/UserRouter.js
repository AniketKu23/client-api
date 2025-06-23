const express = require("express")
const router = express.Router()
const {insertUser, getUserByEmail} = require("../model/user/UserModel")
const {hashPassword, comparePassword} = require("../helpers/bcryptHelper")
const { useRevalidator } = require("react-router-dom")


router.all('/',(req, res, next)=>{
    // res.json({message: "return form user router"})

    next()
})

//Create new user route
router.post('/',async(req,res)=>{
    const{name,company,address,phone,email,password}= req.body
    try{
    const hashedPass = await hashPassword(password)
    //hash pwd
    const newUserObj={
        name,
        company,
        address,
        phone,
        email,
        password: hashedPass,
    }
    
    const result = await insertUser(newUserObj)

    res.json({ message: "New user created",result})
    }catch(error){
        res.json({ statux:'error', message: error.message })
    }
    
})

// User Sign in Router
router.post("/login", async(req, res) => {
    console.log(req.body)
    const {email, password} = req.body


    ///hash our email and compare with db

    if( !email || !password){
        return res.json({ status: "error", message : "Invalid form submission"})
    }
    const user = await getUserByEmail(email)


    const passFromDb = user && user._id ? user.password : null
    if(!passFromDb) 
        return res.json({status : "error", message: "Invalid email or password!"})
    const result = await comparePassword(password, passFromDb)
    console.log(result)


    res.json({ status: "success", message : "Login Successful!"})
})

module.exports = router
