const { referrerPolicy } = require('helmet')
const jwt = require('jsonwebtoken')
const { setJWT, getJWT } = require('./redisHelper')




const createAccessJWT = async(email, _id) =>{
    try {
        const accessJWT = await jwt.sign(
        { email }, 
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: '15m'}
    )
    await setJWT(accessJWT, _id)

    return Promise.resolve(accessJWT)
    } catch (error) {
        return Promise.reject(error)
    }
}

const createRefreshJWT = (payLoad) =>{
    const refreshJWT = jwt.sign(
        { payLoad}, 
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: '30d'}
    )

    return Promise.resolve(refreshJWT)
}


module.exports = {
    createAccessJWT,
    createRefreshJWT,
}