const mongoose = require("mongoose");

const AlumniSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  current_position: {
    type: String,
    require: true,
  },
  office: {
    type: String,
    require: true,
  },
});

const AlumniModel = mongoose.model("Alumni", AlumniSchema);
module.exports = AlumniModel;
