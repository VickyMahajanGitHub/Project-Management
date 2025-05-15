const express = require("express");
const {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTaskByTitle,
  getTasksByTitle,
  updateTaskById,
  
} = require("../controllers/taskController.js");
const router = express.Router();

router.post("/createTask", createTask);
router.get("/getAllTasks", getAllTasks);
router.get("/getTaskByTitle", getTasksByTitle);
router.get("/getTaskById/:id", getTaskById);
router.put("/updateTaskById/:id", updateTaskById);
router.delete("/deleteTask", deleteTaskByTitle);

module.exports = router;
