const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gagandeep91ca:A98Q5o2fRMvmF2KD@cluster0.zqf7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
};
// mongodb+srv://gagandeep23ca:<db_password>@cluster0.tlnjldz.mongodb.net/
//A98Q5o2fRMvmF2KD
module.exports = connectDB;
