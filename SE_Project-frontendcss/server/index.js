const express = require("express");
const admin = require("firebase-admin");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const isAuthenticated = require("./middleware/auth");
const serviceAccount = require("./auth.json");
const userRoutes = require("./routes/userRoutes");
const projRoutes = require("./routes/projectRoutes");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose.connect(process.env.DATABASE_URL);

app.listen(process.env.PORT, () => {
  console.log("Server running...");
  console.log(process.env.PORT);
});

// ROUTES

app.use("/", authRoutes);
app.use("/", isAuthenticated, userRoutes);
app.use("/", isAuthenticated, projRoutes);
