const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email:{
      type: String,
      required: true
    },
    password:{
      type: String,
      required: true
    },
    about:{
      type: String,
      required: true
    },
    role:{
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    is_verified:{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
