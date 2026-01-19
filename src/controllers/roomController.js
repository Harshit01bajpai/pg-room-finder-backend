const Room= require("../models/room");

const addRoom= async (req,res)=>{
   try{ const {title,city,area,rent}=req.body;

      if (!title || !city || !rent||!area) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

      const room =await Room.create({
        title,
        city,
        area,
        rent,
        owner: req.user.id,
      });
        res.status(201).json({
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
    };


    module.exports={addRoom};