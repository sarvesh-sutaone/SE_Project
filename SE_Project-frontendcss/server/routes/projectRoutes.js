const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");

router.get("/projects", ProjectController.getAllProjects);
router.post("/newProject", ProjectController.createProject);
router.get("/myProjects", ProjectController.getProjectsByUser);
router.get("/getApplicationsByProject/:project_id", ProjectController.getApplicationsByProject);
router.get("/getSelectedApplicationsByProject/:project_id",ProjectController.getSelectedApplicationsByProject);
router.post("/applyUser",ProjectController.changeSelectToApply);

module.exports = router;
