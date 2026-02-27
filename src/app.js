const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const requestRouter = require("./routes/requests");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validations");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const userRouter = require("./routes/user");
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],

}));
app.use(express.json()); //to fetch json data from server/postman and send it as obj to client
app.use(cookieParser());

app.use("/request", requestRouter);
app.use("/user",userRouter)
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
    console.log("Error saving data" + " " + "hey", err.message);
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    const verifiedPassword = await user.validatePassword(password);
    if (verifiedPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
});

return res.json(user);   
   } else {
      res.send("Error logging in. Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  console.log("profile route is hit");
  const cookies = req.cookies;
  const { token } = cookies;
  const decodedMessage = await jwt.verify(token, "proCookie2024");
  const { _id } = decodedMessage;
  console.log("user is" + " " + _id);
  const user = await User.findById({ _id });
  console.log("user is" + " " + user.firstName);
  res.send("user is" + " " + user.firstName);
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send("Error fetching feed");
  }
});

// app.post("/request", userAuth, async (req, res) => {
//   try {
//     const user = req.user;
//         const { emailId, password } = req.body;
//     res.send(user.firstName + " " + 'has sent a connection request');
//   } catch (err) {
//     res.status(404).send("something went wrong");
//   }
// });

app.patch("/updateUser", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;
    console.log(data)

    const user = await User.findByIdAndUpdate({ _id: userId }, data,{
      returnDocument:"after",
      runValidators: "true"
    });
        console.log(user)

    return res.json(user);   

      } catch (err) {
  res.status(500).send("Error updating users: " + err.message);
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
