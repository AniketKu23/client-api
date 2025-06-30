const { token } = require("morgan");
const Reset_Pin = require("./ResetPinSchema");
const { randomPinNumber } = require("../../utils/randomGenerator");

// const setPasswordResetPin = (email) => {
//   const randPin = 567890;

//   const resetObj = {
//     email,
//     pin: randPin,
//   };
//   return new Promise((resolve, rejct) => {
//     ResetPinSchema(resetObj)
//       .save()
//       .then((data) => resolve(data))
//       .catch((error) => isRejected(error));
//   });
// };

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
module.exports = {
  setPasswordResetPin,
};
