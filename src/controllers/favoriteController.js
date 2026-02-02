const { findById } = require("../models/booking");
const Favorite = require("../models/favorite");
const Room = require("../models/room");

const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const favorite = await Favorite.create({
      user: userId,
      room: roomId,
    });

    res.status(201).json({
      message: "Room added to favorites",
      favorite,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Room already in favorites",
      });
    }
    res.status(500).json({ message: error.message });
  }
};


const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate("room", "title rent city")
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    await Favorite.findOneAndDelete({
      user: userId,
      room: roomId,
    });

    res.status(200).json({
      message: "Room removed from favorites",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToFavorites,
  getMyFavorites,
  removeFromFavorites,
};



