const {UserSchema} = require("./UserSchema")

const insertUser = userObj =>{
    return new Promise((resolve,reject)=>{
    UserSchema(userObj).save()
    .then(data => console.log(data))
    .catch(error=> console.log(error))
    })
    
}

module.exports={
    insertUser,
}