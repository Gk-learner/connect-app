const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, max: 20, default: "******" },

  age: {type: String,},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
