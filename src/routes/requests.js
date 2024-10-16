const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const connectionData = await connectionRequest.save();

      console.log(connectionData);
      res.json({
        message: "Connection request sent successfully",
        connectionData,
      });
    } catch (err) {
      res.status(400).send("ERROR" + " " + err.message);
    }
  }
);

module.exports = requestsRouter;
