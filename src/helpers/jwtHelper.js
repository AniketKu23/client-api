const { referrerPolicy } = require('helmet')
const jwt = require('jsonwebtoken')

const createAccessJWT = (payLoad) =>{
    const accessJWT = jwt.sign(
        { payLoad}, 
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: '15m'}
    )

    return Promise.resolve(accessJWT)
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