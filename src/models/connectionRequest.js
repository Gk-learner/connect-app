const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    toUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["ignore", "interested", "accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
