const Project = require("../models/Project");
const Alumni = require("../models/Alumni");
const admin = require("firebase-admin");
const User = require("../models/User");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.createProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    var position = email.search("alumni");
    const { pay, duration, description, skills } = req.body;

    if (position >= 0) {
      const user = await Alumni.findOne({ email: email });
      if (user) {
        const alumni_id = user._id;
        const project = new Project({ alumni_id, pay, duration, description });
        await project.save();
      } else {
        res.status(400).json({ message: "Alumni Not Found" });
        return;
      }
    } else {
      const user = await User.findOne({ email: email });
      if (user) {
        const alumni_id = user._id;
        const project = new Project({
          alumni_id,
          pay,
          duration,
          description,
          skills,
        });
        await project.save();
      } else {
        res.status(400).json({ message: "User Not Found" });
      }
    }

    res.status(200).json({ message: "Project Created Succesfully" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.getProjectsByUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const id = user._id;
      const projects = await Project.find({ alumni_id: id });
      res.status(200).json(projects);
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
};


