const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);
      console.log("Message sent: %s", result.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error); // Fixed: now rejects on error
    }
  });
};

const emailProcessor = ({ email, pin, type, verificationLink = "" }) => {
  let info = "";

  switch (type) {
    case "request-new-password":
      info = {
        from: '"CMR Company" <antonio.roob56@ethereal.email>',
        to: email,
        subject: "Password Reset Pin",
        text: `Here is your password reset pin: ${pin}. This pin will expire in 1 day.`,
        html: `<b>Hello</b><br />
        Here is your pin: <b>${pin}</b><br />
        This pin will expire in 1 day.`,
      };
      return send(info); // Fixed: return to handle promise properly

    case "update-password-success":
      info = {
        from: '"CMR Company" <antonio.roob56@ethereal.email>',
        to: email,
        subject: "Password Updated",
        text: "Your new password has been updated.",
        html: `<b>Hello</b><br />
        <p>Your new password has been updated.</p>`,
      };
      return send(info); // Fixed: return to handle promise properly

    case "new-user-confirmation-required":
      info = {
        from: '"CMR Company" <antonio.roob56@ethereal.email>',
        to: email,
        subject: "Please Verify Your New Account",
        text: "Please follow the link to verify your account before you can login.",
        html: `<b>Hello</b><br />
        <p>Please follow the link to verify your account before you can login:</p>
        <p>${verificationLink}</p>`,
      };
      return send(info); // Fixed: return to handle promise properly

    default:
      return Promise.reject("Invalid email type"); // Optional: throw error for unknown type
  }
};

module.exports = { emailProcessor };
