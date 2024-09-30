const mongoose = require("mongoose");
var validator = require("validator");


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
  gender: { type: String },
  skills: { type: String}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
