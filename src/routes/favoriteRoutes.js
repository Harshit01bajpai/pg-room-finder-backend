const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {addToFavorites,getMyFavorites, removeFromFavorites}=require("../controllers/favoriteController");
const authmiddleware = require("../middleware/authMiddleware");

router.post("/:roomId", authMiddleware, addToFavorites);
router.get("/", authMiddleware, getMyFavorites);
router.delete("/:roomId",authmiddleware,removeFromFavorites)

module.exports=router;