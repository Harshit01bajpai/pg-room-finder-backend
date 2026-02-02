const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    message: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

// One inquiry per student per room
bookingSchema.index({ student: 1, room: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
