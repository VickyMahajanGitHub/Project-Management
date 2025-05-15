const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/User");

// Create task
exports.createTask = async (req, res) => {
  try {
    let {
      title,
      taskName,
      hours,
      priority,
      assignedToWork,
      status,
      startDate,
      reviewer1,
      reviewer2,
      endDate,
      description,
      onHoldReason,
      onHoldDescription,
    } = req.body;

    title = title?.trim();
    taskName = taskName?.trim();
    priority = priority?.trim();
    if (Array.isArray(assignedToWork)) {
      assignedToWork = assignedToWork.map((name) => name.trim());
    } else {
      return res.status(400).json({
        success: false,
        message: "assignedToWork should be an array of user names",
      });
    }
    status = status?.trim();

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    if (
      !title ||
      !taskName ||
      !hours ||
      !priority ||
      !assignedToWork.length ||
      !status ||
      !startTimestamp ||
      !endTimestamp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // prevent duplicate taskName under the same project
    // let taskExists = await Task.findOne({ title, taskName });
    //if not prevent then use this
    const project = await Project.findOne({ title });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Validate all assigned users
    const usersExist = await User.find({
      name: { $in: assignedToWork },
    });

    if (usersExist.length !== assignedToWork.length) {
      return res.status(404).json({
        success: false,
        message: "One or more assigned users not found",
      });
    }

    // Create new task (no uniqueness check)
    const newTask = new Task({
      title,
      taskName,
      category: project.category,
      assignedTo: project.assignedTo,
      hours,
      priority,
      assignedToWork,
      startDate: startTimestamp,
      endDate: endTimestamp,
      status,
       reviewer1,
      reviewer2,
      description,
      onHoldReason,
      onHoldDescription,
    });

    await newTask.save();

    return res.status(201).json({
      success: true,
      message: "Task created",
      data: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task Fetch successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task Fetch successfully",
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update task by ID
exports.updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // whatever fields you want to update

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true, // return the updated document
      runValidators: true, // validate fields while updating
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Delete task by ID
exports.deleteTaskByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required to delete a task",
      });
    }

    const deletedTask = await Task.findOneAndDelete({ title });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all tasks by project title
exports.getTasksByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required to fetch tasks",
      });
    }

    const tasks = await Task.find({ title });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this title",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
