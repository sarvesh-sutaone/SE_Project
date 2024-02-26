const User = require("../models/User");

exports.Auth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      console.log("No User found");
      batch_year = 2020;
      resume_link = "hello";
      const applied_projects = [];
      const selected_projects = [];
      user = new User({
        name,
        email,
        batch_year,
        resume_link,
        applied_projects,
        selected_projects,
      });
      await user.save();
    } else {
      console.log(`User with ${email} found`);
      return res.status(200).json({ message: "User Found" });
    }

    res.status(201).json({ message: "User authenticated successfully" });
  } catch (error) {
    console.error("Error in authentication:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
