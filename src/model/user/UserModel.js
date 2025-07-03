const User = require("./UserSchema");

const insertUser = async (userObj) => {
  try {
    const newUser = new User(userObj);
    return await newUser.save();
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === 11000) {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

const getUserByEmail = async (email) => {
  if (!email) return null;
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

const getUserById = async (_id) => {
  if (!_id) return null;
  try {
    return await User.findOne({ _id });
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

const storeUserRefreshJWT = async (_id, token) => {
  try {
    return await User.findOneAndUpdate(
      { _id },
      {
        $set: {
          "refreshJWT.token": token,
          "refreshJWT.addedAt": Date.now(),
        },
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error storing refresh token:", error);
    throw error;
  }
};

const updatePassword = async (email, newHashedPass) => {
  try {
    return await User.findOneAndUpdate(
      { email },
      { $set: { password: newHashedPass } },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
  updatePassword,
};
