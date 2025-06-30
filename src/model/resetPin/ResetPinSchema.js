const mongoose = require("mongoose");
const { token } = require("morgan");
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({
  email: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
    minlength: 100000,
    maxlength: 999999,
  },
  addedAt: {
    type: Date,
    default: Date.now,
    expires: 900, // auto deletes after 15 min (900 sec)
  },
});

// Compile model and export directly
module.exports = mongoose.model("Reset_Pin", ResetPinSchema);
