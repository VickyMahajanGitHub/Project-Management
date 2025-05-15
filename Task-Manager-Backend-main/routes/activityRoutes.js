const express = require("express");
const { getAllActivities, createActivity,getActivitiesByProject } = require("../controllers/activityController");
const router = express.Router();
 

router.post("/createActivity", createActivity);
router.get("/getByProject", getActivitiesByProject);
router.get("/", getAllActivities);
 // New route for getting activities by project

module.exports = router;


