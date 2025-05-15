import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  createTask,
  getAllProject,
  getAllUsers,
  getTaskById,
  updateTaskById, // Make sure this function exists in your service
} from "../api/service";
import {
  TbLayoutGridAdd,
  TbClockHour4,
  TbFlag,
  TbUserCircle,
  TbStatusChange,
  TbNotes,
  TbAlertCircle,
  TbInfoCircle,
  TbUsers,
  TbCategory,
  TbUserPlus,
  TbEdit, // Added for edit mode icon
} from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa"; // Added FaEdit

const TaskForm = ({ isEditMode, taskData, onClose, fetchTasks }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    taskName: "",
    title: "",
    hours: "",
    priority: "",
    endDate: "",
    startDate: "",
    assignedUsers: [], // Changed to array for multiple users
    assignedType: "",
    reviewer1: "",
    reviewer2: "",
    status: "",
    description: "",
    onHoldReason: "",
    onHoldDescription: "",
  });
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Refs for scrolling
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);
  const dropdownRef = useRef(null); // Add a ref for the dropdown

  // Effect to populate form data when in edit mode
  useEffect(() => {
    if (isEditMode && taskData) {
      setFormData({
        taskName: taskData.taskName || "",
        title: taskData.title || "",
        hours: taskData.hours || "",
        priority: taskData.priority || "",
        endDate: taskData.endDate ? taskData.endDate.split("T")[0] : "", // Format date for input
        startDate: taskData.startDate ? taskData.startDate.split("T")[0] : "", // Format date for input
        assignedUsers: taskData.assignedToWork || [], // Map from assignedToWork to assignedUsers
        assignedType: taskData.assignedType || "",
        reviewer1: taskData.reviewer1 || "",
        reviewer2: taskData.reviewer2 || "",
        status: taskData.status || "",
        description: taskData.description || "",
        onHoldReason: taskData.onHoldReason || "",
        onHoldDescription: taskData.onHoldDescription || "",
      });
    }
  }, [isEditMode, taskData]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !formData.assignedUsers.includes(user.name)
  );

  // Handle click outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        showUserDropdown
      ) {
        setShowUserDropdown(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If status field is changed to "hold", scroll to make submit button visible
    if (name === "status" && value === "hold") {
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const handleUserSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowUserDropdown(true);
  };

  const selectUser = (userName) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: [...prev.assignedUsers, userName],
    }));
    setSearchTerm("");
    setShowUserDropdown(false);
  };

  const removeUser = (userName) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev?.assignedUsers?.filter((user) => user !== userName),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      taskName,
      title,
      startDate,
      endDate,
      hours,
      priority,
      assignedUsers,
      assignedType,
      reviewer1,
      reviewer2,
      status,
    } = formData;

    if (
      !taskName ||
      !title ||
      !hours ||
      !priority ||
      assignedUsers.length === 0 ||
      !assignedType ||
      !startDate ||
      !endDate ||
      !status
    ) {
      toast.error("All fields marked with * are required!");
      return;
    }

    if (formData.status === "hold") {
      if (!formData.onHoldReason || !formData.onHoldDescription) {
        toast.error("Please provide reason and description for Hold status.");
        return;
      }
    }

    try {
      setLoading(true);

      // Create a data object where assignedToWork IS an array
      const submitData = {
        ...formData,
        // Use the array directly instead of converting to a string
        assignedToWork: formData.assignedUsers,
        // Remove the original array to avoid confusion
        assignedUsers: undefined,
      };

      console.log("Submitting data:", submitData);

      let response;

      if (isEditMode) {
        // Update existing task
        response = await updateTaskById(taskData._id, submitData);
        if (response?.success) {
          toast.success(response.message || "Task updated successfully!");
        } else {
          toast.error(response?.message || "Failed to update task");
        }
      } else {
        // Create new task
        response = await createTask(submitData);
        if (response?.success) {
          toast.success(response.message || "Task created successfully!");
        } else {
          toast.error(response?.message || "Failed to create task");
        }
      }

      await fetchTasks(taskData._id, submitData);
      await onClose();
      navigate("/taskmanagement");
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} task:`,
        error
      );
      toast.error("Server error! Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [projectRes, userRes] = await Promise.all([
          getAllProject(),
          getAllUsers(),
        ]);

        if (projectRes?.data) setProjects(projectRes.data);
        if (userRes?.data) setUsers(userRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to fetch users or projects.");
      }
    };

    fetchInitialData();
  }, []);

  // Effect to handle layout adjustments when status changes
  useEffect(() => {
    if (formData.status === "hold") {
      setTimeout(() => {
        submitButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [formData.status]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-blue-500";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="relative py-5 px-6">
        <h2 className="text-xl font-bold text-black relative z-10 flex items-center">
          <span className="mr-3 bg-blue-500 text-white p-2 rounded-full">
            {isEditMode ? <TbEdit size={20} /> : <TbLayoutGridAdd size={20} />}
          </span>
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h2>
      </div>
      <div className="p-6 bg-white max-h-[80vh] overflow-y-auto" ref={formRef}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Name Field */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbInfoCircle className="mr-1 text-blue-500" />
                Task Name*
              </label>
              <input
                type="taskName"
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              />
            </div>

            {/* Project Dropdown */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbInfoCircle className="mr-1 text-blue-500" />
                Project*
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">-- Select Project --</option>
                {projects.map((project) => (
                  <option key={project._id} value={project.title}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hours */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbClockHour4 className="mr-1 text-blue-500" />
                Hours*
              </label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              />
            </div>

            {/* Priority */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbFlag className="mr-1 text-blue-500" />
                Priority*
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className={`w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                  formData.priority ? getPriorityColor(formData.priority) : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbClockHour4 className="mr-1 text-blue-500" />
                Start Date*
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              />
            </div>

            {/* EndDate */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbClockHour4 className="mr-1 text-blue-500" />
                End Date*
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              />
            </div>
          </div>

          {/* Assignment Type - NEW FIELD */}
          <div className="relative">
            <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
              <TbCategory className="mr-1 text-blue-500" />
              Assignment Type*
            </label>
            <select
              name="assignedType"
              value={formData.assignedType}
              onChange={handleChange}
              required
              className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
            >
              <option value="">Select Type</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="QA">QA</option>
              <option value="DevOps">DevOps</option>
              <option value="Management">Management</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbStatusChange className="mr-1 text-blue-500" />
                Status*
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">Select</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="hold">Hold</option>
              </select>
            </div>

            {/* Assigned Users - Multi-select with search functionality */}
            <div className="relative" ref={dropdownRef}>
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbUserCircle className="mr-1 text-blue-500" />
                Assigned Users*
              </label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleUserSearch}
                    onFocus={() => setShowUserDropdown(true)}
                    className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    placeholder="Search for users..."
                  />
                </div>

                {/* Selected users display */}
                {formData.assignedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.assignedUsers.map((user, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                      >
                        <span>{user}</span>
                        <button
                          type="button"
                          onClick={() => removeUser(user)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* User search dropdown */}
                {showUserDropdown && (
                  <div className="absolute z-20 mt-12 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => selectUser(user.name)}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {user.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">
                        {searchTerm
                          ? "No matching users found"
                          : "All users already assigned"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hold Status Fields - Conditionally Rendered */}
          {formData.status === "hold" && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="absolute -top-3 left-4 bg-blue-50 px-2 text-sm font-medium text-blue-700 flex items-center">
                    <TbAlertCircle className="mr-1 text-blue-500" />
                    Hold Reason*
                  </label>
                  <select
                    name="onHoldReason"
                    value={formData.onHoldReason}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="">Select reason</option>
                    <option value="Dependency on other task">
                      Dependency on other task
                    </option>
                    <option value="Client Delay">Client Delay</option>
                    <option value="Resource Unavailable">
                      Resource Unavailable
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute -top-3 left-4 bg-blue-50 px-2 text-sm font-medium text-blue-700 flex items-center">
                    <TbNotes className="mr-1 text-blue-500" />
                    Hold Description*
                  </label>
                  <textarea
                    name="onHoldDescription"
                    value={formData.onHoldDescription}
                    onChange={handleChange}
                    rows="2"
                    required
                    className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    placeholder="Explain the reason for holding this task..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Reviewers - NEW FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reviewer 1 */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbUsers className="mr-1 text-blue-500" />
                Reviewer 1
              </label>
              <select
                name="reviewer1"
                value={formData.reviewer1}
                onChange={handleChange}
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">Select Reviewer</option>
                {users.map((user) => (
                  <option key={`reviewer1-${user._id}`} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reviewer 2 */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
                <TbUsers className="mr-1 text-blue-500" />
                Reviewer 2
              </label>
              <select
                name="reviewer2"
                value={formData.reviewer2}
                onChange={handleChange}
                className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              >
                <option value="">Select Reviewer</option>
                {users.map((user) => (
                  <option key={`reviewer2-${user._id}`} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-medium text-blue-700 flex items-center">
              <TbNotes className="mr-1 text-blue-500" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border-2 border-blue-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              placeholder="Enter task description here..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-3" ref={submitButtonRef}>
            <button
              type="submit"
              disabled={loading}
              className="w-48 py-3 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  {isEditMode ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {isEditMode ? (
                    <>
                      <FaEdit className="h-5 w-5 mr-2" />
                      Update Task
                    </>
                  ) : (
                    <>
                      <FaPlus className="h-5 w-5 mr-2" />
                      Create Task
                    </>
                  )}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"></div>
    </div>
  );
};

export default TaskForm;
