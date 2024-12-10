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
  const decodedMessage = await jwt.verify(token, "proCookie2024");
  const { _id } = decodedMessage;
  const user = await User.findById({ _id });
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditprofileData(req)) {
      console.log("Validation Failed: Invalid Edit Request");
      throw new Error("Invalid edit request: Check allowed fields");
    }

    const loggedUser = req.user;
    console.log("Logged User Before Update:", loggedUser);

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

    await loggedUser.save();

    console.log("Logged User After Update:", loggedUser);
    res.json({ message: "Profile updated successfully", data: loggedUser });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).send({ error: err.message });
  }
});

module.exports = profileRouter;
