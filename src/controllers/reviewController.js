const mongoose = require("mongoose");
const Review = require("../models/reviews");
const Room = require("../models/room");

const addReview = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { rating, comment } = req.body;

    // 1️⃣ Validate input
    if (!rating) {
      return res.status(400).json({
        message: "Rating is required",
      });
    }

    // 2️⃣ Check room exists or not
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // 3️⃣ Create review
    const review = await Review.create({
      user: req.user.id, // from authMiddleware
      room: roomId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    // 4️⃣ Duplicate review case (unique index error)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already reviewed this room",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


const getRoomRating = async (req, res) => {
  try {
    const { roomId } = req.params;

    const stats = await Review.aggregate([
      // 1️⃣ Sirf is room ke reviews
      {
        $match: {
          room: new mongoose.Types.ObjectId(roomId),
        },
      },

      // 2️⃣ Group & calculate
      {
        $group: {
          _id: "$room",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },

      // 3️⃣ Clean output
      {
        $project: {
          _id: 0,
          roomId: "$_id",
          avgRating: { $round: ["$avgRating", 1] },
          totalReviews: 1,
        },
      },
    ]);

    // Agar koi review hi nahi hai
    if (stats.length === 0) {
      return res.json({
        roomId,
        avgRating: 0,
        totalReviews: 0,
      });
    }

    res.status(200).json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addReview ,getRoomRating};
