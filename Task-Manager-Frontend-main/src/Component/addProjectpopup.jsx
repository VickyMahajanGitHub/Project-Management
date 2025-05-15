import React, { useState, useEffect } from "react";
import { createProject, updateProjectById } from "../api/service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// Import icons from React Icons
import {
  FaTimes,
  FaBuilding,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSave,
  FaExclamationTriangle,
  FaFlag,
  FaCalendarAlt, // Added calendar icon for dates
} from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi"; // Heroicons outline
import { BiTask, BiCategory, BiNote } from "react-icons/bi";
import { MdDescription, MdAssignmentInd } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { RiCheckboxCircleLine } from "react-icons/ri";

// Add custom scrollbar styles
const scrollbarStyles = `
  /* Custom Scrollbar Styles */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #6366f1);
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #2563eb, #4f46e5);
  }

  /* Slide-in animation for the form */
  @keyframes slideInFromRight {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeInBackdrop {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .slide-in-from-right {
    animation: slideInFromRight 0.4s ease-out forwards;
  }

  .fade-in-backdrop {
    animation: fadeInBackdrop 0.3s ease-out forwards;
  }
  
  /* Error shake animation */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  .input-error {
    animation: shake 0.6s ease-in-out;
    border-color: #ef4444 !important;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 2px;
    display: flex;
    align-items: center;
  }
`;

const AddProject = ({ closePopup, fetchData, selectedProject }) => {
  const navigate = useNavigate();
  const formatDate = (date) => {
    if (!date) return ""; // If no date is provided, return an empty string
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Extracts YYYY-MM-DD format
  };

  const [formData, setFormData] = useState({
    title: selectedProject?.title || "",
    category: selectedProject?.category || "",
    description: selectedProject?.description || "",
    companyName: selectedProject?.companyName || "",
    contactPerson: selectedProject?.contactPerson || "",
    contactPhone: selectedProject?.contactPhone || "",
    contactEmail: selectedProject?.contactEmail || "",
    address: selectedProject?.address || "",
    assignedTo: selectedProject?.assignedTo || "",
    notes: selectedProject?.notes || "",
    status: selectedProject?.status || "Pending",
    priority: selectedProject?.priority || "",
    startDate: formatDate(selectedProject?.startDate), // Format date correctly
    endDate: formatDate(selectedProject?.endDate), // Format date correctly
  });

  // Form validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Show/hide client details section
  const [clientSectionOpen, setClientSectionOpen] = useState(true);
  // State for animation
  const [isClosing, setIsClosing] = useState(false);
  // State for form submission attempt
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate field on change if it's been touched or submission was attempted
    if (touched[name] || attemptedSubmit) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Project title is required";
        } else if (value.trim().length < 3) {
          newErrors.title = "Title must be at least 3 characters";
        } else {
          delete newErrors.title;
        }
        break;
      case "category":
        if (!value) {
          newErrors.category = "Please select a category";
        } else {
          delete newErrors.category;
        }
        break;
      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.trim().length < 10) {
          newErrors.description = "Description must be at least 10 characters";
        } else {
          delete newErrors.description;
        }
        break;
      case "companyName":
        if (!value.trim()) {
          newErrors.companyName = "Please enter a company name.";
        } else if (value.trim().length < 10) {
          newErrors.companyName =
            "Company name should be at least 10 characters.";
        } else {
          delete newErrors.companyName;
        }
        break;
      case "contactEmail":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.contactEmail = "Please enter a valid email address";
        } else {
          delete newErrors.contactEmail;
        }
        break;
      case "contactPhone":
        if (value && !/^[0-9+-\s()]{10,20}$/.test(value)) {
          newErrors.contactPhone = "Please enter a 10-digit phone number";
        } else {
          delete newErrors.contactPhone;
        }
        break;
      case "assignedTo":
        if (!value) {
          newErrors.assignedTo = "Please select a team";
        } else {
          delete newErrors.assignedTo;
        }
        break;
      case "status":
        if (!value) {
          newErrors.status = "Please select a status";
        } else {
          delete newErrors.status;
        }
        break;
      case "priority":
        if (!value) {
          newErrors.priority = "Please select a priority";
        } else {
          delete newErrors.priority;
        }
        break;
      case "startDate":
        if (!value) {
          newErrors.startDate = "Start date is required";
        } else {
          delete newErrors.startDate;
        }
        break;
      case "endDate":
        if (!value) {
          newErrors.endDate = "End date is required";
        } else if (
          formData.startDate &&
          new Date(value) < new Date(formData.startDate)
        ) {
          newErrors.endDate = "End date must be after start date";
        } else {
          delete newErrors.endDate;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allFields);

    // Validate all fields
    let isValid = true;
    let newErrors = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = "Please select a team";
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = "Please select a status";
      isValid = false;
    }

    if (!formData.priority) {
      newErrors.priority = "Please select a priority";
      isValid = false;
    }

    // Validate start date and end date
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
      isValid = false;
    } else if (
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
      isValid = false;
    }

    // Optional fields with format validation
    if (
      formData.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
    ) {
      newErrors.contactEmail = "Please enter a valid email address";
      isValid = false;
    }

    if (
      formData.contactPhone &&
      !/^[0-9+-\s()]{7,20}$/.test(formData.contactPhone)
    ) {
      newErrors.contactPhone = "Please enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector(".input-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const res = selectedProject?._id
        ? await updateProjectById(selectedProject._id, formData)
        : await createProject(formData);

      if (!res || !res.success) {
        toast.error(res?.message || "Operation failed. Please try again.");
        return;
      }

      toast.success(
        res?.message ||
          (selectedProject?._id ? "Project Updated" : "Project Created")
      );
      if (fetchData && typeof fetchData === "function") {
        fetchData();
      }
      closePopup();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  // Handle smooth closing of the form
  const handleClose = () => {
    setIsClosing(true);
    // Allow animation to complete before actually closing
    setTimeout(() => {
      closePopup();
    }, 300);
  };

  // Field focus handler
  const handleFocus = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Hold":
        return "bg-gray-100 text-gray-800";
      case "Active":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-50 text-gray-800";
    }
  };

  // Get priority color
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

  // Add ESC key listener to close the form
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      {/* Include the custom scrollbar and animation styles */}
      <style>{scrollbarStyles}</style>

      <div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 ${
          isClosing ? "opacity-0" : "fade-in-backdrop"
        }`}
        style={{ transition: "opacity 0.3s ease-out" }}
      >
        {/* Click outside to close */}
        <div className="absolute inset-0" onClick={handleClose}></div>

        {/* Form container that slides in from right */}
        <div
          className={`ml-auto bg-white h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl flex flex-col rounded-l-xl ${
            isClosing ? "transform translate-x-full" : "slide-in-from-right"
          }`}
          style={{ transition: "transform 0.3s ease-out" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with modern gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-4 flex justify-between items-center rounded-tl-xl">
            <h2 className="text-lg font-bold text-white flex items-center">
              <BiTask size={22} className="mr-2" />
              {selectedProject?._id
                ? "Update Project Details"
                : "Create New Project"}
            </h2>
            <button
              onClick={handleClose}
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1.5 transition-all duration-200 hover:rotate-90"
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                    <BiTask className="text-blue-500 mr-1" size={16} />
                    Project Title<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    className={`w-full px-3 py-2 border ${
                      errors.title ? "input-error" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white`}
                    placeholder="Enter project title"
                  />
                  {errors.title && (
                    <div className="error-message">
                      <FaExclamationTriangle className="mr-1" size={12} />
                      {errors.title}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                    <BiCategory className="text-blue-500 mr-1" size={16} />
                    Category<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className={`w-full appearance-none px-3 py-2 border ${
                        errors.category ? "input-error" : "border-gray-300"
                      } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white`}
                    >
                      <option value="">Select Category</option>
                      <option value="development">Development</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <HiChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {errors.category && (
                    <div className="error-message">
                      <FaExclamationTriangle className="mr-1" size={12} />
                      {errors.category}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                  <MdDescription className="text-blue-500 mr-1" size={16} />
                  Description<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  rows="2"
                  className={`w-full px-3 py-2 border ${
                    errors.description ? "input-error" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white custom-scrollbar`}
                  placeholder="Brief description of the project"
                />
                {errors.description && (
                  <div className="error-message">
                    <FaExclamationTriangle className="mr-1" size={12} />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Date Fields - Add these fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                    <FaCalendarAlt className="text-blue-500 mr-1" size={16} />
                    Start Date<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    className={`w-full px-3 py-2 border ${
                      errors.startDate ? "input-error" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white`}
                  />
                  {errors.startDate && (
                    <div className="error-message">
                      <FaExclamationTriangle className="mr-1" size={12} />
                      {errors.startDate}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                    <FaCalendarAlt className="text-blue-500 mr-1" size={16} />
                    End Date<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    className={`w-full px-3 py-2 border ${
                      errors.endDate ? "input-error" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white`}
                  />
                  {errors.endDate && (
                    <div className="error-message">
                      <FaExclamationTriangle className="mr-1" size={12} />
                      {errors.endDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Field */}
              <div className="relative">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                  <FaFlag className="text-blue-500 mr-1" size={16} />
                  Priority<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    className={`w-full appearance-none px-3 py-2 border ${
                      errors.priority ? "input-error" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white ${
                      formData.priority
                        ? getPriorityColor(formData.priority)
                        : ""
                    }`}
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <HiChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.priority && (
                  <div className="error-message">
                    <FaExclamationTriangle className="mr-1" size={12} />
                    {errors.priority}
                  </div>
                )}
              </div>

              {/* Client Info - Collapsible section */}
              <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div
                  className="px-4 py-2.5 cursor-pointer flex justify-between items-center bg-gray-50"
                  onClick={() => setClientSectionOpen(!clientSectionOpen)}
                >
                  <h3 className="text-sm font-semibold text-blue-800 flex items-center">
                    <FaBuilding className="mr-2 text-blue-500" />
                    Client Details
                  </h3>
                  <span
                    className={`text-blue-500 transform transition-transform duration-300 ${
                      clientSectionOpen ? "rotate-180" : ""
                    }`}
                  >
                    <HiChevronDown className="h-5 w-5 text-blue-500" />
                  </span>
                </div>

                {clientSectionOpen && (
                  <div className="p-4 space-y-3 bg-opacity-30 animate-slideDown">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaBuilding className="text-blue-400" size={14} />
                          </div>
                          <input
                            name="companyName"
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 hover:border-blue-300"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-blue-400" size={14} />
                          </div>
                          <input
                            name="contactPerson"
                            placeholder="Contact Person"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 hover:border-blue-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="text-blue-400" size={14} />
                          </div>
                          <input
                            name="contactPhone"
                            placeholder="Contact Phone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`w-full pl-9 pr-3 py-2 border ${
                              errors.contactPhone
                                ? "input-error"
                                : "border-gray-300"
                            } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 hover:border-blue-300`}
                          />
                        </div>
                        {errors.contactPhone && (
                          <div className="error-message">
                            <FaExclamationTriangle className="mr-1" size={12} />
                            {errors.contactPhone}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-blue-400" size={14} />
                          </div>
                          <input
                            type="email"
                            name="contactEmail"
                            placeholder="Contact Email"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`w-full pl-9 pr-3 py-2 border ${
                              errors.contactEmail
                                ? "input-error"
                                : "border-gray-300"
                            } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 hover:border-blue-300`}
                          />
                        </div>
                        {errors.contactEmail && (
                          <div className="error-message">
                            <FaExclamationTriangle className="mr-1" size={12} />
                            {errors.contactEmail}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-blue-400" size={14} />
                        </div>
                        <input
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300 hover:border-blue-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Assignment and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                    <AiOutlineTeam className="text-blue-500 mr-1" size={16} />
                    Assigned To<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className={`w-full appearance-none px-3 py-2 border ${
                        errors.assignedTo ? "input-error" : "border-gray-300"
                      } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white`}
                    >
                      <option value="">Select Team</option>
                      <option value="Dev Team">Dev Team</option>
                      <option value="Design Team">Design Team</option>
                      <option value="Marketing Team">Marketing Team</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <HiChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {errors.assignedTo && (
                    <div className="error-message">
                      <FaExclamationTriangle className="mr-1" size={12} />
                      {errors.assignedTo}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                    <RiCheckboxCircleLine
                      className="text-blue-500 mr-1"
                      size={16}
                    />
                    Status<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      className={`w-full appearance-none px-3 py-2 border ${
                        errors.status ? "input-error" : "border-gray-300"
                      } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 ${getStatusColor(
                        formData.status
                      )}`}
                    >
                      <option value="">Select an option</option>
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Hold">Hold</option>
                      <option value="Active">Active</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <HiChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {errors.status && (
                    <div className="error-message">
                      <FaExclamationTriangle className="mr-1" size={12} />
                      {errors.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes (Optional) */}
              <div className="relative">
                <label className="flex items-center text-xs font-medium text-gray-600 mb-1">
                  <BiNote className="text-blue-500 mr-1" size={16} />
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 bg-gray-50 hover:bg-white custom-scrollbar"
                  placeholder="Additional notes or comments"
                />
              </div>
            </form>
          </div>

          {/* Footer with action buttons */}
          <div className="bg-gray-50 px-5 py-4 flex justify-end space-x-3 border-t border-gray-200 rounded-bl-xl">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-100 transition-colors flex items-center"
            >
              <FaTimes className="mr-2" size={12} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md text-sm hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md flex items-center"
            >
              <FaSave className="mr-2" size={14} />
              {selectedProject?._id ? "Update Project" : "Save Project"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProject;
