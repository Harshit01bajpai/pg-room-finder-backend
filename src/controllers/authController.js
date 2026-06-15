const User=require("../models/user");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cloudinary = require("../config/coudinary");
const Otp = require("../models/otp");
const transporter = require("../config/mail");
const rateLimit = require("express-rate-limit");

const registerUser= async (req,res)=>{
    try{
        const {name,email,password,confirmpassword,role}=req.body;

         if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }
     if(password!==confirmpassword){
      return res.status(400).json({
        message: "password do not match",
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


const forgotPassword= async (req,res)=>{
  try{

    const {email}=req.body;

    const user= await  User.findOne({email});

    if(!user){
      return res.status(404).json({
        message: "User not found",
      });
    }

     const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
       await Otp.deleteMany({ email });
       const hashedOtp = await bcrypt.hash(otp,10);
      await Otp.create({
         email,
         otp:hashedOtp,
         expiresAt: new Date(
           Date.now() + 10 * 60 * 1000
      ),
      });
  
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });


  }catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyOtp= async (req,res)=>{
  try{
    const { email, otp } = req.body;

    const record= await Otp.findOne({email});

    if(!record){
       return res.status(400).json({
        message: "OTP not found or expired",
      });
    }
   const isMatch = await bcrypt.compare(
  otp,
   record.otp
);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

 const resetPassword= async (req,res)=>{
  try{
    const{email,otp,newpassword,confirmpassword}=req.body;
     
    const record=await Otp.findOne({email});

   if(!record){
       return res.status(400).json({
        message: "OTP not found or expired",
      });
    }
    if (record.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }
     if(newpassword!==confirmpassword){
       return res.status(400).json({
        message: "password do not match",
      });
     }
   
     
    const hashedpassword= await bcrypt.hash(newpassword,10);
   await User.findOneAndUpdate(
   { email },
   {
      password: hashedpassword
   }
);
  
 await Otp.deleteMany({ email });
 res.status(200).json({
      message: "password updated successfully",
    });


  }catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
 }


module.exports = { registerUser, loginUser,updateProfilePicture ,forgotPassword,verifyOtp,resetPassword};