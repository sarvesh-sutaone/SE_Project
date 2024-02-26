const Project = require("../models/Project");
const Alumni = require("../models/Alumni");
const admin = require("firebase-admin");
const User = require("../models/User");

exports.getAllProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const user_id = user._id;
    console.log(user_id);
    const projects = await Project.find({ alumni_id: { $ne: user_id } });
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
    const { pay, duration, description, skills, title } = req.body;

    if (position >= 0) {
      const user = await Alumni.findOne({ email: email });
      if (user) {
        const alumni_id = user._id;
        const applied_users = [];
        const selected_users = [];
        const project = new Project({
          alumni_id,
          title,
          pay,
          duration,
          description,
          applied_users,
          selected_users,
        });
        await project.save();
      } else {
        res.status(400).json({ message: "Alumni Not Found" });
        return;
      }
    } else {
      const user = await User.findOne({ email: email });
      if (user) {
        const alumni_id = user._id;
        const applied_users = [];
        const selected_users = [];
        const project = new Project({
          alumni_id,
          title,
          pay,
          duration,
          description,
          skills,
          applied_users,
          selected_users,
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

exports.getApplicationsByProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    console.log("Aaay")
    
    // Fetch users based on project_id
    const project = await Project.findOne({ _id: project_id });
    if (project) {
      const applied_users = project.applied_users.map(
        (appliedUser) => appliedUser.user_id
      );

      const users = await User.find({ _id: { $in: applied_users } });
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSelectedApplicationsByProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    
    // Fetch users based on project_id
    const project = await Project.findOne({ _id: project_id });
    if (project) {
      const selected_users = project.selected_users.map(
        (selectedUser) => selectedUser.user_id
      );

      const users = await User.find({ _id: { $in: selected_users } });
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.changeSelectToApply = async (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    // Check if the user is already selected for the project
    const project = await Project.findOne({ _id: project_id });
    const user = await User.findOne({ _id: user_id });

    console.log(project);

    const isUserSelected = project.selected_users.some(selectedUser => selectedUser.user_id.equals(user_id));
    const isProjectApplied = user.selected_projects.some(appliedProject => appliedProject.project_id.equals(project_id));

    if (!isUserSelected && !isProjectApplied) {
      // Update project document to move user from applied_users to selected_users
      await Project.findOneAndUpdate(
        { _id: project_id },
        {
          $pull: { applied_users: { user_id: user_id } }, // Remove user from applied_users array
          $addToSet: { selected_users: { user_id: user_id } } // Add user to selected_users array only if it's not already present
        },
        { new: true } // Return the updated document
      );

      // Update user document to move project from applied_projects to selected_projects
      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $pull: { applied_projects: { project_id: project_id } }, // Remove project from applied_projects array
          $addToSet: { selected_projects: { project_id: project_id } } // Add project to selected_projects array only if it's not already present
        },
        { new: true } // Return the updated document
      );

      res.status(200).json({ message: "User selected successfully" });
    } else {
      res.status(400).json({ message: "User or project is already selected or applied" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




