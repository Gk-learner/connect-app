const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Message from hello");
});

app.use("/", (req, res) => {
  res.send("Message from server");
});
app.listen(3000, () => {
  console.log("Server is listening from port 3000");
});
