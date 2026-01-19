const express=require("express");
const authmiddleware=require("../middleware/authMiddleware");
const router=express.Router();

const { registerUser ,loginUser} = require("../controllers/authController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authmiddleware,(req,res)=>{
     res.json({
    message: "Profile route accessed",
    user: req.user,
  });
})

module.exports=router;