const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {createInquiry,getOwnerInquiries,updateBookingStatus}=require("../controllers/bookingController");

router.post("/:roomId", authMiddleware, createInquiry);
router.get("/owner", authMiddleware, getOwnerInquiries);
router.put("/:bookingId/status", authMiddleware, updateBookingStatus);


module.exports=router;