const { default: mongoose } = require("mongoose");

const roomschema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        lowercase:true,
    },
    area:{
        type:String,
        required:true,

    },
    rent:{
        type:Number,
        required:true,
    },
    type:{
        type:[String],
        enum:["PG","Room"],
        required:true,
    },
    facilities:{
        type:[string],
        default:[],
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
},
{timestamps: true,}
);

mongoose.exports=mongoose.model("Room",roomschema);