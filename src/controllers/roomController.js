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

    const getallroom= async (req,res)=> {
        
        try {

            const{city,maxRent}=req.query;
            let filter={};

             if (city) {
      filter.city = city;
    }

    if (maxRent) {
      filter.rent = { $lte: Number(maxRent) };
    }
    const rooms = await Room.find(filter);

    res.status(200).json({
      count: rooms.length,
      rooms: rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
    }

    const getsingleroom= async (req,res)=>{
        try{
            const {id}=req.params;

            const room = await Room.findById(id);
             if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json(room);

        }catch{error}{
             res.status(400).json({
      message: "Invalid room id",
    });
        };
    }

    const getmyroom= async (req,res)=>{
      try{

        const ownerid= req.user.id;

        const rooms= await Room.find({owner:ownerid});

        res.status(200).json({
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateroom= async (req,res)=>{
  try{
    const {id}= req.params;

    const room =await Room.findById(id);

    if(!room){
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this room",
      });
    }

       const updatedRoom = await Room.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  }catch(error){
        res.status(400).json({
      message: error.message,
    });
  }
}

const deleteroom= async (req,res)=>{

  try{
    const {id}=req.params;
    const room= await Room.findById(id);

       if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this room",
      });
    }

    await Room.findByIdAndDelete(id);

    res.status(200).json({
      message: "Room deleted successfully",
    });

  }catch(error){
    res.status(400).json({
      message: error.message,
    });

  }
}

    module.exports={addRoom,getallroom,getsingleroom,getmyroom,updateroom,deleteroom};
