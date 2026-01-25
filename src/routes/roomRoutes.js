const express = require("express");
const router = express.Router();

const { addRoom, getallroom,getsingleroom,getmyroom ,updateroom, deleteroom} = require("../controllers/roomController");
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
router.get("/:id",getsingleroom);
router.put("/:id",authMiddleware,ownerMiddleware,updateroom);
router.delete("/:id",authMiddleware,ownerMiddleware,deleteroom);

module.exports = router;
