const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const User = require("./models/user");

app.post("/signUp", async (req, res) => {
  //creating an instance of user model

  const user = new User({
    firstName: "Gagandeep",
    emailId: "gk@gmail.com",
    password: "1234",
    age: "33",
  });

  await user.save();
  res.send("user saved!");
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
