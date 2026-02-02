const express = require("express");
const router = express.Router();

const { addRoom, getallroom,getsingleroom,getmyroom ,updateroom, deleteroom, getCityWiseStats,getRoomsWithOwner,getRoomsWithRatings} = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");
const upload = require("../middleware/uploadMiddleware");

// owner only route
router.post(
  "/add",
  authMiddleware,
  ownerMiddleware,
  upload.array("images", 5),
  addRoom
);


router.get("/",getallroom);
router.get("/my",authMiddleware,ownerMiddleware,getmyroom);
router.get("/states/city",getCityWiseStats);
router.get("/with-owner", getRoomsWithOwner);
router.get("/with-ratings", getRoomsWithRatings);


router.get("/:id",getsingleroom);
router.put("/:id",authMiddleware,ownerMiddleware,updateroom);
router.delete("/:id",authMiddleware,ownerMiddleware,deleteroom);

module.exports = router;
