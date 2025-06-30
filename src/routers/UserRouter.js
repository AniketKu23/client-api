const express = require("express");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
} = require("../model/user/UserModel");
const { hashPassword, comparePassword } = require("../helpers/bcryptHelper");
const { useRevalidator } = require("react-router-dom");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwtHelper");
const { userAuthorization } = require("../middlewares/authMiddle");
const {
  setPasswordResetPin,
  getPinByEmail,
  deletePin,
} = require("../model/resetPin/ResetPinModel");
const { emailProcessor } = require("../helpers/emailHelper");
const {
  resetPassReqValidation,
  updatePassValidation,
} = require("../middlewares/formValidationMiddleware");

router.all("/", (req, res, next) => {
  // res.json({message: "return form user router"})

  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;

  const userProf = await getUserById(_id);

  res.json({ user: req.userId });
});

//Create new user route
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    const hashedPass = await hashPassword(password);
    //hash pwd
    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };

    const result = await insertUser(newUserObj);

    res.json({ message: "New user created", result });
  } catch (error) {
    res.json({ statux: "error", message: error.message });
  }
});

// User Sign in Router
router.post("/login", resetPassReqValidation, async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  ///hash our email and compare with db

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form submission" });
  }
  const user = await getUserByEmail(email);

  const passFromDb = user && user._id ? user.password : null;
  if (!passFromDb)
    return res.json({ status: "error", message: "Invalid email or password!" });
  const result = await comparePassword(password, passFromDb);

  if (!result) {
    return res.json({ status: "error", message: "Invalid email or password!" });
  }

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);

  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Login Successful!",
    accessJWT,
    refreshJWT,
  });
});

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await getUserByEmail(email);

  if (user && user._id) {
    const pin = await setPasswordResetPin(email);

    const result = await emailProcessor({
      email,
      pin: pin.pin,
      type: "request-new-password",
    });

    if (result?.messageId) {
      return res.json({
        status: "success",
        message:
          "If the email exists in our database, the password reset pin will be sent shortly.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to send reset pin email.",
    });
  }

  return res.json({
    status: "success",
    message:
      "If the email exists in our database, the password reset pin will be sent shortly.",
  });
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;

  if (!email || !pin || !newPassword) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields.",
    });
  }

  try {
    const getPin = await getPinByEmail(email, pin);
    if (!getPin || !getPin._id) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired pin.",
      });
    }

    const dbDate = new Date(getPin.addedAt);
    const expiresIn = 1; // days
    const expDate = new Date(dbDate);
    expDate.setDate(dbDate.getDate() + expiresIn);

    if (new Date() > expDate) {
      return res.status(400).json({
        status: "error",
        message: "Reset pin has expired.",
      });
    }

    const hashedPass = await hashPassword(newPassword);
    const updatedUser = await updatePassword(email, hashedPass);

    if (!updatedUser || !updatedUser._id) {
      return res.status(500).json({
        status: "error",
        message: "Failed to update password.",
      });
    }

    await emailProcessor({ email, type: "update-password-success" });
    await deletePin(email, pin);

    return res.json({
      status: "success",
      message: "Your password has been updated.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
});

module.exports = router;
