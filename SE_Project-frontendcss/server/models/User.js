const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  batch_year: {
    type: Number,
    required: true,
  },

  // To be discussed
  resume_link: {
    type: String,
    required: true,
  },

  applied_projects: [
    {
      _id: false,
      project_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      proposal: {
        type: String,
      },
    },
  ],

  selected_projects: [
    {
      _id: false,
      project_id:{
        type: mongoose.Schema.Types.ObjectId,
      }
    },
  ],
});

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;
