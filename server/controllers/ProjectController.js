const Project = require("../models/Project");
const admin = require("firebase-admin");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
//const { sendEmail } = require('../service/emailService');
const sendEmail = require("../service/transporter");

exports.getAllProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const user_id = user._id;

    // Get the current date
    const currentDate = new Date();

    // Find projects where the deadline is after the current date
    const projects = await Project.find({
      alumni_id: { $ne: user_id },
      deadline: { $gt: currentDate },
    });

    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.getProjectByID = async (req, res) => {
  try {
    const { project_id } = req.params;
    const project = await Project.findOne({ _id: project_id });
    if (!project) {
      return res.status(400).json({ message: "Project Not Found" });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.filterProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const user_id = user._id;

    // Extract filters from request body
    const { minPay, maxPay, minDuration, maxDuration, skills } = req.body;

    // Get the current date
    const currentDate = new Date();

    // Construct query object
    const query = {
      alumni_id: { $ne: user_id },
      deadline: { $gt: currentDate },
    };

    // Add filters based on minimum and maximum pay
    if (minPay !== undefined && maxPay !== undefined) {
      query.pay = { $gte: minPay, $lte: maxPay };
    } else if (minPay !== undefined) {
      query.pay = { $gte: minPay };
    } else if (maxPay !== undefined) {
      query.pay = { $lte: maxPay };
    }

    // Add filters based on minimum and maximum duration
    if (minDuration !== undefined && maxDuration !== undefined) {
      query.duration = { $gte: minDuration, $lte: maxDuration };
    } else if (minDuration !== undefined) {
      query.duration = { $gte: minDuration };
    } else if (maxDuration !== undefined) {
      query.duration = { $lte: maxDuration };
    }

    // Add filter based on skills
    if (skills && skills.length > 0) {
      query.skills = { $in: skills }; // Projects must contain any one of the specified skills
    }

    // Find projects matching the query
    const projects = await Project.find(query);

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
    const {
      pay,
      duration,
      description,
      skills,
      title,
      deadline,
      jobDescription,
    } = req.body;
    const deadlineDate = new Date(deadline);
    let project;
    const user = await User.findOne({ email: email });
    if (user) {
      const alumni_id = user._id;
      const alumni_name = user.name;
      const alumni_email = user.email;
      const applied_users = [];
      const selected_users = [];
      const rejected_users = [];
      project = new Project({
        alumni_id,
        alumni_name,
        alumni_email,
        title,
        pay,
        duration,
        description,
        skills,
        applied_users,
        selected_users,
        rejected_users,
        deadline: deadlineDate,
        jobDescription,
      });
      await project.save();
      const subject = "Project Created Successfully";
      const body = `Dear ${alumni_name},\n\nYour project: ${title} has been successfully created.\n\nProject Description: ${description}\n\nThank you for creating this project.\n\nBest Regards,\nBITSConnect`;
      console.log("Subject:", subject);
      await sendEmail(email, subject, body);

      console.log(project);
    } else {
      res.status(400).json({ message: "User Not Found" });
    }

    res.status(200).json(project);
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

    const project = await Project.findOne({ _id: project_id });
    const user = await User.findOne({ _id: user_id });

    const isUserSelected = project.selected_users.some((selectedUser) =>
      selectedUser.user_id.equals(user_id)
    );
    const isProjectApplied = user.selected_projects.some((appliedProject) =>
      appliedProject.project_id.equals(project_id)
    );

    if (!isUserSelected && !isProjectApplied) {
      await Project.findOneAndUpdate(
        { _id: project_id },
        {
          $pull: { applied_users: { user_id: user_id } },
          $addToSet: { selected_users: { user_id: user_id } },
        },
        { new: true }
      );

      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $pull: { applied_projects: { project_id: project_id } },
          $addToSet: { selected_projects: { project_id: project_id } },
        },
        { new: true }
      );

      const subject = "Your Application has been Selected";
      const body = `Dear ${user.name},\n\nCongratulations! Your application for the project: ${project.title} has been selected.\n\nThank you for your interest and participation in our project. We look forward to working with you.\n\nBest regards,\nBITSConnect`;
      console.log("Subject:", subject);
      await sendEmail(user.email, subject, body);

      // Check if conversation already exists
      const existingConversation = await Conversation.findOne({
        participants: { $all: [project.alumni_id, user_id] },
      });

      console.log("Existing Conversation:", existingConversation);

      if (!existingConversation) {
        // If conversation doesn't exist, create a new one
        const newConversation = new Conversation({
          participants: [project.alumni_id, user_id],
        });
        console.log("New Conversation:", newConversation);
        await newConversation.save();
      }

      res.status(200).json({ message: "User selected successfully" });
    } else {
      res
        .status(400)
        .json({ message: "User or project is already selected or applied" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.changeSelectToReject = async (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    const project = await Project.findOne({ _id: project_id });
    const user = await User.findOne({ _id: user_id });

    const isUserSelected = project.selected_users.some((selectedUser) =>
      selectedUser.user_id.equals(user_id)
    );
    const isProjectApplied = user.selected_projects.some((appliedProject) =>
      appliedProject.project_id.equals(project_id)
    );

    if (!isUserSelected && !isProjectApplied) {
      await Project.findOneAndUpdate(
        { _id: project_id },
        {
          $pull: { applied_users: { user_id: user_id } },
          $addToSet: { rejected_users: { user_id: user_id } },
        },
        { new: true }
      );

      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $pull: { applied_projects: { project_id: project_id } },
          $addToSet: { rejected_projects: { project_id: project_id } },
        },
        { new: true }
      );

      const subject = "Your Application has been Rejected";
      const body = `Dear ${user.name},\n\nWe regret to inform you that your application for the project: ${project.title} has been rejected.\n\nThank you for your interest and participation in our project. We appreciate your effort and encourage you to apply for future opportunities.\n\nBest regards,\nBITSConnect`;
      console.log("Subject:", subject);
      await sendEmail(user.email, subject, body);

      res.status(200).json({ message: "User rejected successfully" });
    } else {
      res
        .status(400)
        .json({ message: "User or project is already selected or applied" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const {
      pay,
      duration,
      description,
      skills,
      title,
      deadline,
      jobDescription,
    } = req.body;
    const deadlineDate = new Date(deadline);
    const { project_id } = req.params;
    const project = await Project.findOne({ _id: project_id });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (project) {
      project.pay = pay;
      project.duration = duration;
      project.description = description;
      project.skills = skills;
      project.title = title;
      project.deadline = deadlineDate;
      project.jobDescription = jobDescription;
      await project.save();
      return res.status(200).json(project);
    }

    res.json({ message: "Project Not Found" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const decodedToken = await admin.auth().verifyIdToken(authHeader);
    const email = decodedToken.email;
    const user = await User.findOne({ email: email });
    const { project_id } = req.params;

    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the project details
    const project = await Project.findById(project_id);
    if (!project) {
      console.error("Project not found");
      return res.status(404).json({ message: "Project not found" });
    }

    // Remove project_id from applied_projects array of all users
    await User.updateMany(
      { _id: { $in: project.applied_users.map((user) => user.user_id) } },
      { $pull: { applied_projects: { project_id: project_id } } }
    );

    // Remove project_id from selected_projects and rejected_projects arrays of all users
    await User.updateMany(
      { _id: { $in: project.selected_users.map((user) => user.user_id) } },
      { $pull: { selected_projects: { $eq: project_id } } }
    );

    await User.updateMany(
      { _id: { $in: project.rejected_users.map((user) => user.user_id) } },
      { $pull: { rejected_projects: { $eq: project_id } } }
    );

    // Delete the project
    await Project.findByIdAndDelete(project_id);

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
