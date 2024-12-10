const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"]; // Updated to match the schema

      // Validate the status
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type::: " + status });
      }

      // Prevent users from sending connection requests to themselves
      if (fromUserId.toString() === toUserId) {
        return res
          .status(400)
          .send("Invalid connection request: Cannot connect to yourself.");
      }

      // Check if the target user exists
      const user = await User.findById(toUserId);
      if (!user) {
        return res.status(404).send("Error: Target user not found.");
      }

      // Check if a connection request already exists between the users
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send({
          message: "Duplicate request: Connection request already exists.",
        });
      }

      // Create a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const connectionData = await connectionRequest.save();

      // Send a success response
      res.json({
        message: "Connection request sent successfully.",
        connectionData,
      });
    } catch (err) {
      // Catch and handle any errors
      res.status(500).send("Error processing request: " + err.message);
    }
  }
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const { requestId, status } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      console.log(loggedInUser);
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        console.log("gagan", connectionRequest);

        return res
          .status(404)
          .json({ message: "Connection request not found." });
      }

      if (connectionRequest.toUserId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to review this request." });
      }

      // Update the status of the connection request
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      console.log(data);

      // Send a success response
      res.json({ message: "Connection request has been " + status, data });
    } catch (err) {
      // Catch and handle any errors
      res
        .status(500)
        .json({ message: "Error processing request: " + err.message });
    }
  }
);

module.exports = requestsRouter;
