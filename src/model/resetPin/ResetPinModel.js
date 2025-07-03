const Reset_Pin = require("./ResetPinSchema");
const { randomPinNumber } = require("../../utils/randomGenerator");
const ResetPinSchema = require("./ResetPinSchema");

const setPasswordResetPin = async (email) => {
  const pinLength = 6;
  const randPin = await randomPinNumber(pinLength);

  try {
    const result = await Reset_Pin.findOneAndUpdate(
      { email },
      { pin: randPin, addedAt: new Date() },
      { upsert: true, new: true }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const getPinByEmail = (email, pin) => {
  return new Promise((resolve, reject) => {
    Reset_Pin.findOne({ email, pin }, (error, data) => {
      if (error) {
        console.error("Error in getPinByEmail:", error);
        return reject(error);
      }
      resolve(data);
    });
  });
};

const deletePin = (email, pin) => {
  return new Promise((resolve, reject) => {
    Reset_Pin.findOneAndDelete({ email, pin }, (error, data) => {
      if (error) {
        console.error("Error in deletePin:", error);
        return reject(error);
      }
      resolve(data);
    });
  });
};

module.exports = {
  setPasswordResetPin,
  getPinByEmail,
  deletePin,
};
