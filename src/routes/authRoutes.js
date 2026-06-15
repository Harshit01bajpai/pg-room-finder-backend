const express=require("express");
const authmiddleware=require("../middleware/authMiddleware");
const { forgotPasswordLimiter,} = require("../middleware/ratelimitMiddleware");
const upload = require("../middleware/uploadMiddleware");


const router=express.Router();

const { registerUser ,loginUser,updateProfilePicture,forgotPassword,verifyOtp,resetPassword} = require("../controllers/authController");


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authmiddleware,(req,res)=>{
     res.json({
    message: "Profile route accessed",
    user: req.user,
  });
})
router.post("/forgot-pass",forgotPasswordLimiter,forgotPassword);
router.post("/verify-otp",verifyOtp);
router.post("/reset-pass",resetPassword)
router.put("/profile-picture",authmiddleware,  upload.single("profilePic"),
  updateProfilePicture
);


module.exports=router;