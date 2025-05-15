const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      require: true,
      enum: ["design", "development", "marketing"],
    },
    description: {
      type: String,
      require: true,
    },
    onHoldReason: {
      type: String,
      require: true,
    },
    onHoldDescription: {
      type: String,
      require: true,
    },
    assignedTo: {
      type: String,
      required: true,
      enum: ["Marketing Team", "Dev Team", "Design Team"],
    },
    hours: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    assignedToWork: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    reviewer1: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    reviewer2: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "New",
        "In Progress",
        "Completed",
        "Active",
        "Inactive",
        "Overdue",
        "hold",
      ],
      default: "New",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
