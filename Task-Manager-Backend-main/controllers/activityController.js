const Activity = require("../models/Activity");
const Task = require("../models/task");
const User = require("../models/User");

// Get all activities
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

// Create a new activity
const createActivity = async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ message: "Failed to create activity" });
  }
};

// Function to fetch activities by project name and filter type
const getActivitiesByProject = async (req, res) => {
  const { projectName, filter } = req.query; // Get projectName and filter from the query params

  try {
    let activities;

    // Default case: fetch all activities for the project
    if (filter === 'all') {
      activities = await Activity.find({ projectName: projectName });
    }
    // Filter for completed activities
    else if (filter === 'completed') {
      activities = await Activity.find({ projectName: projectName, type: 'completed' });
    }
    // Filter for assigned activities
    else if (filter === 'assigned') {
      activities = await Activity.find({ projectName: projectName, type: 'assigned' });
    }
    // Filter for overdue activities
    else if (filter === 'overdue') {
      activities = await Activity.find({ projectName: projectName, type: 'overdue' });
    }
    else {
      return res.status(400).json({ error: 'Invalid filter' });
    }

    // If activities are found, send them back
    return res.json(activities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch activities' });
  }
};



module.exports = {
  getAllActivities,
  createActivity,
  getActivitiesByProject,
};
