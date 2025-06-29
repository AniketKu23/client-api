const UserSchema = require("./UserSchema");
const User = require("./UserSchema"); // Import the model directly

const insertUser = async (userObj) => {
  try {
    const newUser = new User(userObj);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle duplicate email error specifically
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
    console.error("Error finding user:", error);
    throw error;
  }
};

const getUserById = async (_id) => {
  if (!_id) return null;

  try {
    return await User.findOne({ _id });
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

const storeUserRefreshJWT = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate(
        { _id },
        {
          $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
};
