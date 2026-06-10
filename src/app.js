const express=require("express");
const path=require("path");
const authRoutes=require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reviewsRoutes=require("./routes/reviewsRoutes");
const bookingRoutes=require("./routes/bookingRoutes");
const favoriteRoutes=require("./routes/favoriteRoutes");




const app= express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/review",reviewsRoutes);
app.use("/api/booking",bookingRoutes);
app.use("/api/favorite",favoriteRoutes);

module.exports=app;
