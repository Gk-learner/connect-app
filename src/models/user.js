const mongoose = require("mongoose");
var validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 5, maxLength: 15 },
  lastName: { type: String },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new error("Invalid email address" + value);
      }
    },
  },
  password: { type: String, max: 20 },
  age: { type: String },
  gender: {
    type: String,
    // enum: {
    //   value: ["Male", "female"], // use wherher enum or validate. It's one and teh same thing
    //   message: `{value} is not a valid gender`,
    // },
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
      }
      throw new Error
      ("Gender data is not valid");
    },
  },
  photoUrl: { type: String },
  skills: { type: String },
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "proCookie2024");

  return token;
};

userSchema.methods.validatePassword = async function (passwordinputByUser) {
  const user = this;
  const isPasswordvalid = await bcrypt.compare(
    passwordinputByUser,
    user.password //passwordHash
  );

  return isPasswordvalid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
