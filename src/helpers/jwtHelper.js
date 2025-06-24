const { referrerPolicy } = require("helmet");
const jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redisHelper");
const { storeUserRefreshJWT } = require("../model/user/UserModel");

const createAccessJWT = async (email, _id) => {
  try {
    const accessJWT = await jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    await setJWT(accessJWT, _id);

    return Promise.resolve(accessJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createRefreshJWT = async (email, _id) => {
  try {
    const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    await storeUserRefreshJWT(_id, refreshJWT);
  } catch (error) {
    return Promise.reject(refreshJWT);
  }
};

module.exports = {
  createAccessJWT,
  createRefreshJWT,
};
