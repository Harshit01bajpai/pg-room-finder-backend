const express=require("express");
const authRoutes=require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reviewsRoutes=require("./routes/reviewsRoutes");
const bookingRoutes=require("./routes/bookingRoutes");




const app= express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.get("/",(req,res)=>{
    res.send("PG / Room Finder API is running");
});
app.use("/api/review",reviewsRoutes);
app.use("/api/booking",bookingRoutes);

module.exports=app;