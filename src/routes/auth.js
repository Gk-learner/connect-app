const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validations");
const bcrypt = require("bcrypt");

const app = express();

app.use(cookieParser());

authRouter.post("/signUp", async (req, res) => {
  try {
    //Validation of data

    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypt the password

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashedPassowrd", hashedPassword);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("user saved!");
  } catch (err) {
    // console.log("Error saving data" + " " + "hey", err.message);
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    // console.log(user);
    const verifiedPassword = await user.validatePassword(password);
    if (verifiedPassword) {
      const token = await user.getJWT();
      res.cookie("token", token);

      res.send("User verified and Logged in!");
    } else {
      res.send("Error logging in. Invalid credentials");
    }
  } catch (err) {
    res.status(500), res.send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout Successfully");
});

module.exports = authRouter;
