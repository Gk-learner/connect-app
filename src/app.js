const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validations");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.options("*", cors());

app.post("/signUp", async (req, res) => {
  try {
    //Validation of data

    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    // console.log("user", user);
    const verifiedPassword = await user.validatePassword(password);
    // console.log("gagan", verifiedPassord);
    if (verifiedPassword) {
      //create a JWT token

      const token = await user.getJWT();
      console.log(token);
      res.cookie("token", token);

return res.json(user);   
   } else {
      res.send("Error logging in. Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  const cookies = req.cookies;
  // console.log(cookies);
  const { token } = cookies;
  //validate the token

  const decodedMessage = await jwt.verify(token, "proCookie2024");
  // console.log(decodedMessage);
  const { _id } = decodedMessage;
  // console.log("user is" + " " + _id);
  const user = await User.findById({ _id });
  console.log("user is" + " " + user.firstName);
  res.send("user is" + " " + _id);
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user.firstName + " " + 'has sent a connection request');
  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

app.patch("/updateUser", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    // console.log(user);
    res.send("updated!!");
  } catch (err) {
    // console.log("Error:", err.message);
    res.status(500).send("Error updating users");
  }
});

app.delete("/deleteUser", async (req, res) => {
  const userID = await req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userID });
    res.send("User is deleted");
  } catch (err) {
    res.send("Something went wrong");
  }
});


connectDB()
  .then(() => {
    console.log("database connection successfull");
    app.listen(4000, () => {
      console.log("Server is listening from port 4000");
    });
  })
  .catch((err) => {
    console.log("Error encountered");
  });
