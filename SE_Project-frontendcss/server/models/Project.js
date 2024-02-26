const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  alumni_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  title: {
    type: String,
  },
  pay: {
    type: Number,
    require: true,
  },
  // Will have to check this
  duration: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  skills: [
    {
      _id: false,
      type: String,
    },
  ],
  applied_users: [
    {
      _id: false,
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  selected_users: [
    {
      _id: false,
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

const ProjectModel = mongoose.model("Project", ProjectSchema);
module.exports = ProjectModel;
