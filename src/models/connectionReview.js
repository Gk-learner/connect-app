const mongoose = require("mongoose");

const connectionReviewSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["accepted", "rejected"],
      required: true,
        },
        requestId: { type: mongoose.Schema.Types.ObjectId, required: true },

  },
  { timestamps: true }
);

const connectionReviewModel = new mongoose.model(
  "connectionReview",
  connectionReviewSchema
);

module.exports = connectionReviewModel;
