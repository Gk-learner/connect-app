const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const bcrypt = require("bcrypt");

const { validateSignUpData } = require("./utils/validations");
const User = require("./models/user");

//parsing json req
app.use(express.json());

app.post("/signUp", async (req, res) => {
  try {
    //Validation of data

    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    //encrypt the password

    const hashedPassowrd = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassowrd,
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

    const user = await User.find({ emailId });

    const verifiedPassword = bcrypt.compare(password, user.password);

    if (verifiedPassword) {
      res.send("User verified and Logged in!");
    } else {
      res.send("Error logging in. Invalid credentials");
    }
  } catch (err) {
    res.status(500), res.send(err.message);
  }
});
app.get("/allUsers", async (req, res) => {
  try {
    const user = await User.find({});

    res.send(user);
  } catch (err) {
    res.status(404).send("something went wrong");
  }
});

app.patch("/updateUser", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      lean,
      g,
    });
    console.log(user);
    res.send("updated!!");
  } catch (err) {
    console.log("Error:", err.message);
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
