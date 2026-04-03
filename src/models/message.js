const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

messageSchema.index({ fromUserId: 1, toUserId: 1, createdAt: 1 });
messageSchema.index({ toUserId: 1, readAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
