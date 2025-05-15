import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Building,
  Phone,
  Mail,
  Star,
  Flag,
  BarChart4,
  CircleCheck,
  CircleAlert,
  FileText,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../api/service";
import TaskTable from "../pages/TaskTable";
import AddProjects from "./addProjectpopup";

export default function ProjectCard() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(true);
  const [showNotes, setShowNotes] = useState(true);

  // Added for edit functionality - taken from ProjectDashboardFile
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [shouldReNew, setShouldReNew] = useState(false);

  // Function to calculate progress based on completed tasks

  const calculateProgress = (tasks) => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(
      (task) => task.status?.toLowerCase().trim() === "completed"
    ).length;
    return (completedTasks / tasks.length) * 100;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await getProjectById(projectId);
        console.log("Project response:", response.data.data);
        setProjectData(response.data.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Error fetching project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, shouldReNew]);

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-300 border-l-blue-300 border-r-blue-300 rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-600 font-medium">
          Loading project details...
        </p>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="p-16 text-center bg-red-50 rounded-xl border border-red-200 shadow-lg">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <CircleAlert className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-red-700">
          Unable to Load Project
        </h3>
        <p className="mt-2 text-red-600">{error || "No project data found."}</p>
        <button className="mt-4 px-4 py-2 bg-white border border-red-300 rounded-full text-red-600 hover:bg-red-50 transition-all">
          Try Again
        </button>
      </div>
    );
  }

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status color based on project status
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "running":
      case "New":
        return "bg-gradient-to-r from-emerald-400 to-green-500 text-white";
      case "in progress":
        return "bg-gradient-to-r from-blue-400 to-indigo-500 text-white";
      case "completed":
        return "bg-gradient-to-r from-teal-400 to-cyan-500 text-white";
      case "on hold":
      case "hold":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-white";
      case "cancelled":
      case "active":
        return "bg-gradient-to-r from-red-400 to-rose-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  // Get priority badge styling
  const getPriorityStyle = (priority) => {
    const priorityLower = priority?.toLowerCase() || "medium";
    switch (priorityLower) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
      case "medium":
        return "bg-gradient-to-r from-orange-500 to-amber-600 text-white";
      case "low":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getCategoryIcon = (category) => {
    const categoryLower = category?.toLowerCase() || "";
    if (categoryLower.includes("dev")) return "💻";
    if (categoryLower.includes("design")) return "🎨";
    if (categoryLower.includes("market")) return "📈";
    return "🔍";
  };

  // Added from ProjectDashboardFile - Handle open popup
  const openPopup = async (project) => {
    setShowPopup(true);
    setSelectedProject(project);
    // Fetch project details and ensure form fields are editable
    if (project?._id) {
      try {
        const projectByIDResponse = await getProjectById(project._id);
        if (projectByIDResponse?.success) {
          setSelectedProject(projectByIDResponse?.data);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    }
  };

  // Added from ProjectDashboardFile - Handle close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedProject(null);
    if (shouldReNew) {
      setShouldReNew(false);
      // Re-fetch project data
      const fetchProject = async () => {
        try {
          setLoading(true);
          const response = await getProjectById(projectId);
          setProjectData(response.data.data);
        } catch (err) {
          console.error("Error fetching project:", err);
          setError("Error fetching project data");
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  };

  // Added from ProjectDashboardFile - Fetch data after update
  const fetchData = () => {
    setShouldReNew(true);
  };

  return (
    <div className="flex flex-row gap-8 px-4">
      {/* Left column - Main Project Card */}
      <div className="w-1/3">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl sticky top-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 h-16 relative overflow-hidden">
            <div className="flex justify-between items-start p-2">
              <div className="flex justify-end space-x-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/30 text-white hover:bg-white/40 transition-all">
                  <Star className="w-4 h-4" />
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/30 text-white hover:bg-white/40 transition-all"
                  onClick={() => openPopup(projectData)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Project overview */}
          <div className="relative px-6 pb-6" style={{ marginTop: "-3rem" }}>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-2xl font-bold">
                {projectData.title
                  ? projectData.title.slice(0, 2).toUpperCase()
                  : "PR"}
              </div>
              <h2 className="mt-3 text-xl font-bold text-gray-800 text-center">
                {projectData.title || "Project Name"}
              </h2>

              <div className="flex flex-wrap mt-3 gap-2 justify-center">
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(
                    projectData.status
                  )}`}
                >
                  {["running", "completed", "active", "New"].includes(
                    projectData.status?.toLowerCase()
                  ) ? (
                    <CircleCheck className="w-3 h-3 mr-1" />
                  ) : (
                    <CircleAlert className="w-3 h-3 mr-1" />
                  )}
                  {projectData.status || "PENDING"}
                </div>

                <div
                  className={`flex items-center px-3 py-1 rounded-full shadow-sm ${getPriorityStyle(
                    projectData.priority
                  )}`}
                >
                  <Flag className="w-3 h-3 mr-1" />
                  <span className="text-xs font-semibold">
                    {projectData.priority || "Medium"} Priority
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* project completion */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-700 flex items-center">
                <BarChart4 className="w-4 h-4 mr-1.5 text-blue-600" />
                Project Progress
              </span>
              <span className="text-xs font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                <p className="">
                  {Math.round(calculateProgress(projectData.tasks))}% Completed
                  (
                  {projectData.tasks?.filter(
                    (task) => task.status?.toLowerCase() === "completed"
                  ).length || 0}
                  /{projectData.tasks?.length || 0})
                </p>
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{
                  width: `${Math.max(
                    1,
                    calculateProgress(projectData.tasks)
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {projectData.tasks?.filter(
                  (task) => task.status?.toLowerCase() === "completed"
                ).length || 0}{" "}
                Tasks Completed
              </span>
            </div>
          </div>

          {/* Description Section */}
          {projectData.description && (
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-blue-100">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-xs font-semibold text-blue-800">
                  Project Description
                </span>
              </div>
              <p className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                {projectData.description}
              </p>
            </div>
          )}

          <div className="p-6 space-y-4">
            {/* Key Project Details - Condensed */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">
                      Created By
                    </div>
                    <div className="text-xs font-medium text-gray-800">
                      {projectData.createdBy || "Unknown"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">
                      Assigned To
                    </div>
                    <div className="text-xs font-medium text-gray-800">
                      {projectData.assignedTo || "Unassigned"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">
                      Created On
                    </div>
                    <div className="text-xs font-medium text-gray-800">
                      {formatDate(projectData.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold">
                      Deadline
                    </div>
                    <div className="text-xs font-medium text-red-600">
                      {formatDate(projectData.endDate) || "Not set"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information - Collapsible */}
            <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden transition-all duration-300">
              <div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowClientDetails(!showClientDetails)}
              >
                <h3 className="text-xs font-bold text-blue-800 flex items-center">
                  <Building className="w-4 h-4 mr-1.5" />
                  Client Information
                </h3>
                <button className="text-blue-500 hover:bg-blue-100 rounded-full p-0.5">
                  {showClientDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {showClientDetails && (
                <div className="p-3 bg-white border-t border-blue-100">
                  <div className="space-y-2">
                    {projectData.companyName && (
                      <div className="flex items-center bg-blue-50 rounded-lg p-2 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-xs text-gray-500 font-semibold">
                            Company
                          </div>
                          <div className="text-xs font-medium">
                            {projectData.companyName}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center bg-blue-50 rounded-lg p-2 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-2">
                        <div className="text-xs text-gray-500 font-semibold">
                          Contact Person
                        </div>
                        <div className="text-xs font-medium">
                          {projectData.contactPerson || "No contact person"}
                        </div>
                      </div>
                    </div>

                    {projectData.contactPhone && (
                      <div className="flex items-center bg-blue-50 rounded-lg p-2 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-xs text-gray-500 font-semibold">
                            Phone
                          </div>
                          <a
                            href={`tel:${projectData.contactPhone}`}
                            className="text-xs font-medium hover:text-blue-600 transition-colors"
                          >
                            {projectData.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}

                    {projectData.contactEmail && (
                      <div className="flex items-center bg-blue-50 rounded-lg p-2 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-xs text-gray-500 font-semibold">
                            Email
                          </div>
                          <a
                            href={`mailto:${projectData.contactEmail}`}
                            className="text-xs font-medium hover:text-blue-600 transition-colors"
                          >
                            {projectData.contactEmail.toLowerCase()}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes Section - Collapsible */}
            {projectData.notes && (
              <div className="bg-white rounded-lg border border-purple-200 shadow-sm overflow-hidden transition-all duration-300">
                <div
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2 flex justify-between items-center cursor-pointer"
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <h3 className="text-xs font-bold text-purple-800 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Additional Notes
                  </h3>
                  <button className="text-purple-500 hover:bg-purple-100 rounded-full p-0.5">
                    {showNotes ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {showNotes && (
                  <div className="px-3 py-2 bg-white border-t border-purple-100">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <p className="text-xs text-gray-700">
                        {projectData.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1 text-gray-400" />
                Last Updated: {formatDate(projectData.updatedAt)}
              </div>
              <button
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-medium hover:opacity-90 transition-all flex items-center"
                onClick={() => openPopup(projectData)}
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Other components */}
      <div className="w-2/3 flex flex-col gap-6">
        {/* Task Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-4">
            <TaskTable projectTitle={projectData?.title} />
          </div>
        </div>
      </div>

      {/* Popup Form - Added from ProjectDashboardFile */}
      {showPopup && (
        <AddProjects
          closePopup={closePopup}
          fetchData={fetchData}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
}
