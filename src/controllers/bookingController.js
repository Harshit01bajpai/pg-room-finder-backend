const mongoose=require("mongoose");
const Booking=require("../models/booking");
const Room = require("../models/room");


const createInquiry= async (req,res)=>{
    try{

        const { roomId } = req.params;
    const { message } = req.body;

    // 1️⃣ Logged-in user form auth middleeware
    const studentId = req.user.id;

    // 2️⃣ Room exist check
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 3️⃣ Owner from room
    const ownerId = room.owner;

    // 4️⃣ Create inquiry (status defaults to PENDING)
    const booking = await Booking.create({
      room: roomId,
      student: studentId,
      owner: ownerId,
      message,
    });

    res.status(201).json({
      message: "Inquiry sent successfully",
      booking,
    });
    }catch(error){
        // 5️⃣ Duplicate inquiry (unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already sent an inquiry for this room",
      });
    }

    res.status(500).json({ message: error.message });
    }
};


const getOwnerInquiries = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const inquiries = await Booking.find({ owner: ownerId })
      .populate("room", "title rent city")
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { bookingId } = req.params;
    const { status } = req.body;

    // 1️⃣ Validate status
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 2️⃣ Find booking owned by this owner
    const booking = await Booking.findOne({
      _id: bookingId,
      owner: ownerId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found or unauthorized",
      });
    }

    // 3️⃣ Update status
    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: `Inquiry ${status.toLowerCase()} successfully`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports={createInquiry,getOwnerInquiries,updateBookingStatus};


