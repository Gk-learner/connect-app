const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gagansasan1991:pJM3Pp4JIXHFJDul@cluster0.zge83.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
};
// mongodb+srv://gagandeep23ca:<db_password>@cluster0.tlnjldz.mongodb.net/
//A98Q5o2fRMvmF2KD
// pJM3Pp4JIXHFJDul
module.exports = connectDB;
