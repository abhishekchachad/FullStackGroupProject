const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
{
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  licenseNumber: { type: String, default: "" },
  age: { type: Number, default: 0 },
  
  carDetails: {
    make: { type: String, default: "" },
    model: { type: String, default: "" },
    year: { type: Number, default: 0 },
    plateNumber: { type: String, default: "" }
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  TestType: {
    type: String,
    default: "Default", // Default value if not supplied
  },
  Comments: {
    type: String,
    default: ""
  },
  isPassed: {
    type: Boolean,
  },
  
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
});

userSchema.pre("save", async function (next) 
{
  
  if (this.isModified("password") || this.isNew) 
  {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);