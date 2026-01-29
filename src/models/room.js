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
        type:[String],
        default:[],
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    images: [
  {
    url: String,
    public_id: String,
  }
],

},
{timestamps: true,}
);

roomschema.index({city:1,rent:1});
roomschema.index({owner:1});
roomschema.index({createdAt:-1});

module.exports=mongoose.model("Room",roomschema);