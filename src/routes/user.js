const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const Message = require("../models/message");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

async function hasAcceptedConnection(loggedInUserId, partnerId) {
  const row = await ConnectionRequest.findOne({
    status: "accepted",
    $or: [
      { fromUserId: loggedInUserId, toUserId: partnerId },
      { fromUserId: partnerId, toUserId: loggedInUserId },
    ],
  });
  return Boolean(row);
}

// Pending requests others sent to the logged-in user (mount: /user/... )
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

// Pending requests the logged-in user sent (still awaiting response)
userRouter.get("/requests/sent", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Only hide users with active/accepted relationship states.
    // Rejected/ignored users remain eligible in feed.
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: { $in: ["interested", "accepted"] },
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Peer profile only if you share an accepted connection (for chat header, etc.)
userRouter.get("/peer/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const me = req.user._id;

    if (userId === me.toString()) {
      return res.status(400).json({ message: "Invalid peer" });
    }

    const ok = await hasAcceptedConnection(me, userId);
    if (!ok) {
      return res.status(403).json({ message: "You can only chat with connections." });
    }

    const peer = await User.findById(userId).select(USER_SAFE_DATA);
    if (!peer) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: peer });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Must be registered before "/messages/:partnerUserId"
userRouter.get("/messages/unread/summary", userAuth, async (req, res) => {
  try {
    const me = req.user._id;

    const grouped = await Message.aggregate([
      {
        $match: {
          toUserId: me,
          $or: [{ readAt: null }, { readAt: { $exists: false } }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$fromUserId",
          unreadCount: { $sum: 1 },
          lastText: { $first: "$text" },
          lastAt: { $first: "$createdAt" },
        },
      },
    ]);

    const totalUnread = grouped.reduce((sum, g) => sum + g.unreadCount, 0);

    const senderIds = grouped.map((g) => g._id);
    const senders = await User.find({ _id: { $in: senderIds } }).select(
      USER_SAFE_DATA
    );
    const senderMap = Object.fromEntries(
      senders.map((u) => [u._id.toString(), u])
    );

    const threads = grouped.map((g) => {
      const peer = senderMap[g._id.toString()];
      return {
        fromUserId: g._id,
        unreadCount: g.unreadCount,
        lastText: g.lastText,
        lastAt: g.lastAt,
        peer: peer
          ? {
              firstName: peer.firstName,
              lastName: peer.lastName,
              photoUrl: peer.photoUrl,
            }
          : null,
      };
    });

    res.json({
      data: {
        totalUnread,
        threads,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/messages/:partnerUserId", userAuth, async (req, res) => {
  try {
    const me = req.user._id;
    const { partnerUserId } = req.params;

    if (partnerUserId === me.toString()) {
      return res.status(400).json({ message: "Invalid partner" });
    }

    const ok = await hasAcceptedConnection(me, partnerUserId);
    if (!ok) {
      return res.status(403).json({ message: "You can only chat with connections." });
    }

    await Message.updateMany(
      {
        fromUserId: partnerUserId,
        toUserId: me,
        $or: [{ readAt: null }, { readAt: { $exists: false } }],
      },
      { $set: { readAt: new Date() } }
    );

    const messages = await Message.find({
      $or: [
        { fromUserId: me, toUserId: partnerUserId },
        { fromUserId: partnerUserId, toUserId: me },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(300)
      .lean();

    res.json({ data: messages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.post("/messages", userAuth, async (req, res) => {
  try {
    const me = req.user._id;
    const { toUserId, text } = req.body;

    if (!toUserId || typeof text !== "string") {
      return res.status(400).json({ message: "toUserId and text are required" });
    }

    const trimmed = text.trim();
    if (!trimmed.length) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (toUserId === me.toString()) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    const ok = await hasAcceptedConnection(me, toUserId);
    if (!ok) {
      return res.status(403).json({ message: "You can only chat with connections." });
    }

    const doc = await Message.create({
      fromUserId: me,
      toUserId,
      text: trimmed,
    });

    res.status(201).json({ data: doc });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;