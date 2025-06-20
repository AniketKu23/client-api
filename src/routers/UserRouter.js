const express = require("express")
const router = express.Router()
const {insertUser} = require("../model/user/UserModel")
const {hashPassword} = require("../helpers/bcryptHelper")


router.all('/',(req, res, next)=>{
    // res.json({message: "return form user router"})

    next()
})

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
    console.log(result)

    res.json({ message: "New user created",result})
    }catch(error){
        res.json({ statux:'error', message: error.message })
    }
    
})

module.exports = router