const express=require("express");
const authmiddleware=require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router=express.Router();

const { registerUser ,loginUser,updateProfilePicture} = require("../controllers/authController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authmiddleware,(req,res)=>{
     res.json({
    message: "Profile route accessed",
    user: req.user,
  });
})

router.put("/profile-picture",authmiddleware,  upload.single("profilePic"),
  updateProfilePicture
);

module.exports=router;