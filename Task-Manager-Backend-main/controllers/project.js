const Project = require("../models/project");
const mongoose = require("mongoose");
const Task = require("../models/task");

// Create project
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      companyName,
      contactPerson,
      contactPhone,
      contactEmail,
      address,
      assignedTo,
      notes,
      status,
      priority,
      startDate,
      endDate,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !category ||
      !description ||
      !companyName ||
      !contactPerson ||
      !contactPhone ||
      !contactEmail ||
      !address ||
      !priority ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate if project with the same title already exists
    const projectExists = await Project.findOne({ title });
    if (projectExists) {
      return res
        .status(400)
        .json({ success: false, message: "Project already exists" });
    }

    // Create new project
    const newProject = await Project.create({
      title,
      category,
      description,
      companyName,
      contactPerson,
      contactPhone,
      contactEmail,
      address,
      assignedTo,
      notes,
      status: status || "Pending",
      priority, // Save priority
      startDate, // Save startDate
      endDate, // Save endDate
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      data: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    // Validate the projectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // Find the project by ID
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Show all created task details for the project based on its title
    const tasks = await Task.find({ title: project.title });

    // Combining the project details and tasks into one object
    const projectWithTasks = {
      ...project._doc,
      tasks,
    };

    // Log the result to verify
    console.log("Project found with tasks:", projectWithTasks);

    // Return the response with the project and its associated tasks
    res.status(200).json({
      success: true,
      message: "Project fetched successfully.",
      data: projectWithTasks,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No projects found" });
    }

    //show All created task detail for project
    const projectsWithTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ title: project.title });
        return {
          ...project._doc,
          tasks,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projectsWithTasks,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update project by ID (PUT request)
exports.updateProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const updates = req.body;

    const updatedProject = await Project.findByIdAndUpdate(projectId, updates, {
      new: true, // Return the updated project
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete project by ID (DELETE request)
exports.deleteProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully!" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get project status summary
exports.getProjectStatusSummary = async (req, res) => {
  try {
    const summary = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "summary Fetch successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching project status summary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
