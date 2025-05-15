import React, { useState, useEffect } from "react";
import { createTask, updateTaskById } from "../api/service";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import {
  FileUp,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  HelpCircle,
} from "lucide-react";

const AddTask = () => {
  // Initialize formData state to match the schema fields
  const [formData, setFormData] = useState({
    tittle: "", // Matching schema field name (note: this has a typo, consider fixing in schema)
    category: "",
    assignedTo: "", // Required enum: "Marketing Team", "Dev Team", "Design Team"
    hours: 0, // Required number field
    priority: "",
    assignedToWork: "", // Required field in schema
    status: "New", // Default value as per schema
    // Keep fields that might be used in frontend but not in schema
    description: "",
    selectedFile: null,
  });

  // For editing existing task
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Optional: Fetch task data if editing
  useEffect(() => {
    if (id) {
      // Fetch task data logic would go here
    }
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        selectedFile: e.target.files[0].name,
      }));
    }
  };

  // Handle Input Change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields according to schema
    if (!formData.tittle) {
      return toast.error("Task title is required");
    }
    if (!formData.category) {
      return toast.error("Category is required");
    }
    if (!formData.assignedTo) {
      return toast.error("Assignment team is required");
    }
    if (!formData.hours || formData.hours <= 0) {
      return toast.error("Valid hours are required");
    }
    if (!formData.priority) {
      return toast.error("Priority is required");
    }
    if (!formData.assignedToWork) {
      return toast.error("Assigned work is required");
    }

    try {
      if (selectedTask?._id) {
        // If task exists, update it
        const updateTaskResponse = await updateTaskById(
          selectedTask._id,
          formData
        );
        if (!updateTaskResponse?.success) {
          return toast.error(updateTaskResponse?.message || "Update failed");
        }
        toast.success(
          updateTaskResponse?.message || "Task Updated Successfully"
        );
        // Redirect to projectDetail.js
        navigate("/projectDetail");
      } else {
        // Create new task
        const createTaskResponse = await createTask(formData);
        if (!createTaskResponse?.success) {
          return toast.error(createTaskResponse?.message || "Creation failed");
        }
        toast.success(
          createTaskResponse?.message || "Task Created Successfully"
        );
        // Redirect to projectDetail.js
        navigate("/projectDetail");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar positioned at the left */}
      <Sidebar />

      {/* Main content area with header and content */}
      <div className="flex flex-col flex-1">
        {/* Header positioned at the top of the main content area */}
        <Header />

        {/* Main content area that takes remaining space */}
        <div className="flex-1 overflow-auto p-4 bg-gray-300">
          {/* Breadcrumbs */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Dashboard
                </a>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1" />
                <a href="#" className="hover:text-blue-600">
                  Tasks
                </a>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-gray-800 font-medium">Add Task</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Left side - Form */}
            <div className="md:w-2/3 bg-white rounded-lg p-6 shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="bg-gradient-to-r from-blue-800 to-purple-600 text-white rounded-lg shadow-md p-2 mb-6">
                  <h2 className="text-xl font-bold text-center text-white">
                    {selectedTask?._id ? "UPDATE TASK" : "ADD NEW TASK"}
                  </h2>
                </div>

                {/* Task Title and Category */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="TASK TITLE..."
                    name="tittle" // Match schema field name
                    className="flex-1 p-2 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={formData.tittle}
                    onChange={handleInputChange}
                  />
                  <select
                    className="flex-1 p-2 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      SELECT CATEGORY
                    </option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="marketing">Marketing</option>
                    {/* Removed "other" as it's not in the schema enum */}
                  </select>
                </div>

                {/* Hours - Added to match schema requirements */}
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="HOURS REQUIRED..."
                    name="hours"
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={formData.hours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                  />
                </div>

                {/* Assigned To Team - Added to match schema requirements */}
                <div className="mb-4">
                  <select
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      ASSIGN TO TEAM
                    </option>
                    <option value="Marketing Team">Marketing Team</option>
                    <option value="Dev Team">Dev Team</option>
                    <option value="Design Team">Design Team</option>
                  </select>
                </div>

                {/* Project type - Keep for UI but map to assignedToWork if needed */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
                  <p className="font-medium text-gray-700 mb-2">PROJECT TYPE</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors">
                      <input
                        type="radio"
                        name="projectType"
                        value="landing-page"
                        checked={formData.projectType === "landing-page"}
                        onChange={(e) => {
                          handleInputChange(e);
                          // Also update assignedToWork field
                          setFormData((prev) => ({
                            ...prev,
                            assignedToWork: "Landing Page",
                          }));
                        }}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm">LANDING PAGE</span>
                    </label>
                    <label className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors">
                      <input
                        type="radio"
                        name="projectType"
                        value="static-website"
                        checked={formData.projectType === "static-website"}
                        onChange={(e) => {
                          handleInputChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            assignedToWork: "Static Website",
                          }));
                        }}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm">STATIC MULTI PAGE WEBSITE</span>
                    </label>
                    <label className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors">
                      <input
                        type="radio"
                        name="projectType"
                        value="dynamic-website"
                        checked={formData.projectType === "dynamic-website"}
                        onChange={(e) => {
                          handleInputChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            assignedToWork: "Dynamic Website",
                          }));
                        }}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm">DYNAMIC WEBSITE</span>
                    </label>
                    <label className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors">
                      <input
                        type="radio"
                        name="projectType"
                        value="ecommerce-website"
                        checked={formData.projectType === "ecommerce-website"}
                        onChange={(e) => {
                          handleInputChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            assignedToWork: "E-commerce Website",
                          }));
                        }}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm">E-COMMERCE WEBSITE</span>
                    </label>
                    <label className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors">
                      <input
                        type="radio"
                        name="projectType"
                        value="mobile-app"
                        checked={formData.projectType === "mobile-app"}
                        onChange={(e) => {
                          handleInputChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            assignedToWork: "Mobile App",
                          }));
                        }}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm">MOBILE APP</span>
                    </label>
                  </div>
                </div>

                {/* AssignedToWork - Direct input if needed */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="ASSIGNED WORK DETAILS..."
                    name="assignedToWork"
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={formData.assignedToWork}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be auto-populated based on project type, but can
                    be edited
                  </p>
                </div>

                <div className="mb-4">
                  <textarea
                    placeholder="ADD BRIEF DESCRIPTION..."
                    name="description"
                    className="w-full p-4 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-24 resize-y"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1 flex items-center">
                    <label className="bg-blue-50 text-blue-600 border border-blue-200 text-center py-2 px-4 rounded cursor-pointer hover:bg-blue-100 transition-colors flex items-center">
                      <FileUp className="mr-2 h-4 w-4" />
                      CHOOSE FILE
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <div className="ml-2 text-gray-600 text-sm">
                      {formData.selectedFile
                        ? formData.selectedFile
                        : "UPLOAD FILE"}
                    </div>
                  </div>
                  <select
                    className="flex-1 p-2 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      SET PRIORITY
                    </option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    {/* Removed "urgent" as it's not in the schema enum */}
                  </select>
                </div>

                {/* Status selection - Added to match schema */}
                <div className="mb-4">
                  <select
                    className="w-full p-2 rounded border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Keep UI for assignees for display purposes */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
                  <p className="font-medium text-gray-700 mb-2">
                    TEAM MEMBERS (For Display Only)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "AKASH UPADHYAY",
                      "HARISH KUMAR",
                      "PRIYA SHARMA",
                      "RAJESH PATEL",
                      "ANITA DESAI",
                    ].map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          disabled
                          className="form-checkbox text-blue-600"
                        />
                        <span className="text-sm">{name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Team assignments are handled through the assignedTo field
                    above
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-500 transition-colors shadow-md flex items-center"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {selectedTask?._id ? "UPDATE TASK" : "ASSIGN TASK"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right side - Task information panel */}
            <div className="md:w-1/3 bg-white rounded-lg p-6 shadow-md">
              <div className="bg-gradient-to-r from-blue-800 to-purple-600 text-white rounded-lg shadow-md p-2 mb-6">
                <h2 className="text-xl font-bold text-center">
                  Task Information
                </h2>
              </div>

              {/* Task Statistics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">24</p>
                    <p className="text-sm text-gray-600">tasks this month</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="font-medium">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">12</p>
                    <p className="text-sm text-gray-600">tasks to complete</p>
                  </div>
                </div>
              </div>

              {/* Schema Required Fields Reminder */}
              <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Required Fields
                </h3>
                <ul className="text-sm text-gray-700 space-y-2 pl-7">
                  <li className="list-disc">
                    <strong>Title (tittle):</strong> Task name (required)
                  </li>
                  <li className="list-disc">
                    <strong>Category:</strong> design, development, or marketing
                  </li>
                  <li className="list-disc">
                    <strong>Assigned To:</strong> Team assignment
                  </li>
                  <li className="list-disc">
                    <strong>Hours:</strong> Time required for task
                  </li>
                  <li className="list-disc">
                    <strong>Priority:</strong> Low, Medium, or High
                  </li>
                  <li className="list-disc">
                    <strong>Assigned Work:</strong> Details of the work
                  </li>
                  <li className="list-disc">
                    <strong>Status:</strong> New, In Progress, or Completed
                  </li>
                </ul>
              </div>

              {/* Tips section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start mb-2">
                  <HelpCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Task Creation Tips
                  </h3>
                </div>
                <ul className="text-sm text-gray-700 space-y-2 pl-7">
                  <li className="list-disc">
                    Be specific with task names for clarity
                  </li>
                  <li className="list-disc">
                    Set appropriate priorities to help team members plan
                  </li>
                  <li className="list-disc">
                    Include estimated hours for better resource planning
                  </li>
                  <li className="list-disc">
                    Assign to the correct team for proper routing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
