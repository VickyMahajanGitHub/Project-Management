const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database.js");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/project.js");
const taskRoutes = require("./routes/taskRoutes.js");
const activityRoutes = require("./routes/activityRoutes");
const errorHandler = require("./middleware/error.js");

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

// CORS config for frontend at localhost:5173
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://project-management-psi-three.vercel.app",
    ],
    credentials: true,
  })
);

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/activity", activityRoutes);

// Error middleware (if using)
app.use(errorHandler);

const port = process.env.PORT || 2500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
