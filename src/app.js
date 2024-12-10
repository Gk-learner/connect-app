const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
// app.use(cors);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
