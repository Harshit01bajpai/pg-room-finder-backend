const express = require("express");
const router = express.Router();

const { addRoom } = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");

// owner only route
router.post(
  "/add",
  authMiddleware,
  ownerMiddleware,
  addRoom
);

module.exports = router;
