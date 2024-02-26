const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/users", UserController.getAllUsers);
router.get("/myAppliedProjects", UserController.getAppliedProjects);
router.get("/mySelectedProjects", UserController.getSelectedProjects);
router.post("/apply", UserController.applyForProject);
router.put("/updateDetails", UserController.updateDetails);
router.get("/getUserByID", UserController.getUserById);
router.post("/removeProject", UserController.removeProject);

module.exports = router;
