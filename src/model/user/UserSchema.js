const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  company: {
    type: String,
    maxlength: 50,
    required: true,
  },
  address: {
    type: String,
    maxlength: 100,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10,11}$/.test(v); // allow 10 or 11 digit numbers
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  refreshJWT: {
    token: {
      type: String,
      maxlength: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
