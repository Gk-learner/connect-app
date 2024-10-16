const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validateEditprofileData } = require("../utils/validations");

const { userAuth } = require("../middlewares/auth");
const app = express();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;
  //validate the token
  const decodedMessage = await jwt.verify(token, "proCookie2024");
  const { _id } = decodedMessage;
  const user = await User.findById({ _id });
  res.send("user is" + " " + _id);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditprofileData(req)) {
      throw new Error("Invalid edit Request");
    }

    const loggedUser = req.user;
    console.log(loggedUser);
    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
    await loggedUser.save();
    console.log(loggedUser);
    // res.send("Profile updated successfully");
    res.json({ message: "Profile updated successfully", data: loggedUser});

  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
