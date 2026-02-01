const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { addReview,getRoomRating } = require("../controllers/reviewController");

// Student adds review for a room
router.post("/:roomId", authMiddleware, addReview);
router.get("/room/:roomId/stats", getRoomRating);

module.exports = router;
