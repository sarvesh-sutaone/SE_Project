const express = require("express");
const admin = require("firebase-admin");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const authRoutes = require("../routes/authRoutes");
const isAuthenticated = require("../middleware/auth");
const serviceAccount = require("../auth.json");
const userRoutes = require("../routes/userRoutes");
const projRoutes = require("../routes/projectRoutes");
const convoRoutes = require("../routes/conversationRoutes");
const reportRoutes = require("../routes/reportRoutes");
const adminRoutes = require("../routes/adminRoutes");
app.use(express.json());

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose.connect(process.env.DATABASE_URL);

app.listen(process.env.PORT, () => {
  console.log("Server running...");
  console.log(process.env.PORT);
});

// ROUTES

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/", authRoutes);
app.use("/", adminRoutes);
app.use("/", reportRoutes);
app.use("/", isAuthenticated, userRoutes);
app.use("/", isAuthenticated, projRoutes);
app.use("/", isAuthenticated, convoRoutes);
