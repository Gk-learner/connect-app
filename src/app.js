const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const User = require("./models/user");

//parsing json req
app.use(express.json());

app.post("/signUp", async (req, res) => {
  try {
    //creating an instance of user model
    const user = new User(req.body);

    await user.save();
    res.send("user saved!");
  } catch (err) {
    console.log("Error saving data", err.message);
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

app.put("/updateUser", async (req, res) => {
  try {
    // Find users where lastName is blank and unset (remove) the lastName field
    const result = await User.updateMany(
      { lastName: "Singh " }, // Find users with blank lastName
      { $unset: { lastName: "" } } // Remove the lastName field
    );

    if (result.matchedCount === 0) {
      return res.status(404).send("No users found with a blank last name");
    }

    res.send(
      `${result.modifiedCount} user(s) updated by removing lastName field`
    );
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).send("Error updating users");
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
