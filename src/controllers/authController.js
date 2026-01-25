const User=require("../models/user");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cloudinary = require("../config/coudinary");


const registerUser= async (req,res)=>{
    try{
        const {name,email,password,role}=req.body;

         if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser=await User.findOne({ email });
     if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedpassword= await bcrypt.hash(password,10);

    const user= await User.create({
        name,
        email,
        password:hashedpassword,
        role,
    })

     res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });

}catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
  
const loginUser= async (req,res)=>{
   try{
    const {email,password}=req.body;

    const user= await User.findOne({email});

    if(!user) return res.status(400).json({ message: "Invalid email or password" });

    const ismatch = await bcrypt.compare(password,user.password);

    if (!ismatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token= jwt.sign(
      {
        id:user._id,
        role:user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

     res.json({ message: "Login successful" ,token});
      
   }catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 1️⃣ Agar pehle se image hai → delete
    if (user.profilePic && user.profilePic.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // 2️⃣ Nayi image set karo
    user.profilePic = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = { registerUser, loginUser,updateProfilePicture };