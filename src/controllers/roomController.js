const Room= require("../models/room");

const addRoom= async (req,res)=>{
   try{ const {title,city,area,rent}=req.body;

      if (!title || !city || !rent||!area) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const images = req.files?.map(file => ({
  url: file.path,
  public_id: file.filename,
}));


      const room =await Room.create({
        title,
        city,
        area,
        rent,
        images,
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
        
        const getallroom = async (req, res) => {
  try {
    const {
      city,
      minRent,
      maxRent,
      facilities,
      sort = "createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    // 🔹 City filter
    if (city) {
      filter.city = city.toLowerCase();
    }

    // 🔹 Rent range filter
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    // 🔹 Facilities filter
    if (facilities) {
      filter.facilities = {
        $in: facilities.split(","),
      };
    }

    // 🔹 Sorting
    let sortOption = {};
    if (sort) {
      const field = sort.replace("-", "");
      const order = sort.startsWith("-") ? -1 : 1;
      sortOption[field] = order;
    }

    // 🔹 Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 🔹 Query
    const rooms = await Room.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .populate("owner", "name email");

    const totalRooms = await Room.countDocuments(filter);

    res.status(200).json({
      page: pageNumber,
      limit: limitNumber,
      totalRooms,
      totalPages: Math.ceil(totalRooms / limitNumber),
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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

const getCityWiseStats = async (req, res) => {
  try {
    const stats = await Room.aggregate([
      // Group by city
      {
        $group: {
          _id: "$city",
          avgRent: { $avg: "$rent" },
          totalRooms: { $sum: 1 },
        },
      },

      // Sort by average rent (high to low)
      {
        $sort: { avgRent: -1 },
      },

      //  Shape final output
      {
        $project: {
          _id: 0,
          city: "$_id",
          avgRent: 1,
          totalRooms: 1,
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


    module.exports={addRoom,getallroom,getsingleroom,getmyroom,updateroom,deleteroom,getCityWiseStats};
