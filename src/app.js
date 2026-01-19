const express=require("express");
const authRoutes=require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");




const app= express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.get("/",(req,res)=>{
    res.send("PG / Room Finder API is running");
});

module.exports=app;