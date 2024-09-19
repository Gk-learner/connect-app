const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gagandeep23ca:prKUzY9nwtWKyRT4@cluster0.zge83.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/TinderApp"
  );
};

module.exports = connectDB;
