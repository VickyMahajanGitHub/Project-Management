import React from "react";
import {
  Calendar,
  Clock,
  FileText,
  User,
  Users,
  Bell,
  Tag,
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  Flag,
  Clock3,
  LayoutGrid,
  CheckCircle,
  Info,
  AlertCircle,
  BookOpen,
  Edit,
  X,
} from "lucide-react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TbHomeHeart } from "react-icons/tb";
import { TiChevronRight } from "react-icons/ti";
import { formatDate } from "../utlis/helper";
import { updateTaskById } from "../api/service";
import { useState } from "react";
import TaskForm from "./taskfrom";

const TaskDetailsPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const taskByID = location.state?.task;

  // Function to open the edit form popup
  const openEditForm = () => {
    setTaskData(taskByID); // save task data
    setShowPopup(true); // open the popup
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to refresh tasks after update
  const fetchTasks = async (taskId, formData) => {
    try {
      const response = await updateTaskById(taskId, formData);
      console.log("Task updated successfully:", response);

      // After successful update, you can navigate
      navigate("/taskdetail");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!taskByID) {
    return <div className="p-4 text-gray-600">No task data found.</div>;
  }

  if (!taskByID) {
    return <div className="p-4 text-gray-600">No task data found.</div>;
  }

  // Convert assignedToWork to array if it's not already one
  const assignedToArray = Array.isArray(taskByID?.assignedToWork)
    ? taskByID?.assignedToWork
    : taskByID?.assignedToWork
    ? [taskByID?.assignedToWork]
    : [];

  // Convert notifyBy to array if it's not already one
  const notifyByArray = Array.isArray(taskByID?.notifyBy)
    ? taskByID?.notifyBy
    : taskByID?.notifyBy
    ? [taskByID?.notifyBy]
    : [];

  // Get the priority color based on priority value
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-blue-500 bg-blue-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Get status style based on status value
  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Active":
        return "bg-emerald-100 text-emerald-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "hold":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="fixed h-full">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 ml-12 sm:ml-12 md:ml-[15rem] lg:ml-64 flex flex-col">
        <Header />

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <NavLink
                    to="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <TbHomeHeart className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <div className="flex items-center">
                    <TiChevronRight className="w-4 h-4 text-gray-400" />
                    <NavLink
                      to="/project"
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 md:ml-2"
                    >
                      Projects
                    </NavLink>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <TiChevronRight className="w-4 h-4 text-gray-400" />
                    <NavLink
                      to="/taskdetail"
                      className="ml-1 text-sm font-medium text-blue-600 md:ml-2"
                    >
                      Task Detail
                    </NavLink>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
              <div className="flex justify-between items-center mb-6">
                <div className="text-blue-500 p-4 flex items-center">
                  <h2 className="text-2xl font-bold tracking-wide">
                    TASK DETAILS
                  </h2>
                </div>
                {/* Edit Button Added Here */}
                <button
                  onClick={openEditForm}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200 shadow-md"
                >
                  <Edit size={16} />
                  <span className="font-medium">Edit Task</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-3/5 bg-white rounded-lg p-5 border border-gray-200 shadow-md">
                  <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText size={16} className="text-indigo-500" />
                      {taskByID?.taskName || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={14} className="text-indigo-500" />
                      CREATED AT
                    </div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="font-bold text-lg text-indigo-700">
                      {taskByID?.title || "N/A"}
                    </div>
                    <div className="text-xs bg-indigo-50 px-2 py-1 rounded-md text-indigo-700">
                      {formatDate(taskByID?.createdAt)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-5 border-l-4 border-indigo-400">
                    <p className="text-sm text-gray-700">
                      {taskByID?.description || "No description available"}
                    </p>
                  </div>

                  {/* Required Fields Display */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-5 overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {/* Task Name Field */}
                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <Info size={14} className="text-indigo-500" />
                            TASK NAME*
                          </td>
                          <td className="text-sm py-3 px-3 font-medium text-right text-gray-700">
                            {taskByID?.taskName || "N/A"}
                          </td>
                        </tr>

                        {/* Project Title */}
                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            PROJECT*
                          </td>
                          <td className="text-sm py-3 px-3 font-medium text-right text-gray-700">
                            {taskByID?.title || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <User size={14} className="text-indigo-500" />
                            CREATED BY
                          </td>
                          <td className="text-sm py-3 px-3 font-medium text-right text-gray-700">
                            {taskByID?.createdBy || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <Flag size={14} className="text-indigo-500" />
                            PRIORITY*
                          </td>
                          <td className="text-sm py-3 px-3 text-right">
                            <span
                              className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(
                                taskByID?.priority
                              )}`}
                            >
                              {taskByID?.priority || "N/A"}
                            </span>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <Clock3 size={14} className="text-indigo-500" />
                            HOURS*
                          </td>
                          <td className="text-sm py-3 px-3 text-right text-gray-700 font-medium">
                            {taskByID?.hours || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <LayoutGrid size={14} className="text-indigo-500" />
                            ASSIGNMENT TYPE*
                          </td>
                          <td className="text-sm py-3 px-3 text-right text-gray-700">
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                              {taskByID?.assignedTo || "N/A"}
                            </span>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <CheckCircle
                              size={14}
                              className="text-indigo-500"
                            />
                            STATUS*
                          </td>
                          <td className="text-sm py-3 px-3 text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                taskByID?.status
                              )}`}
                            >
                              {taskByID?.status || "N/A"}
                            </span>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <Calendar size={14} className="text-green-500" />
                            START DATE*
                          </td>
                          <td className="text-sm py-3 px-3 text-right text-green-600">
                            {formatDate(taskByID?.startDate) || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <Calendar size={14} className="text-red-500" />
                            END DATE*
                          </td>
                          <td className="text-sm py-3 px-3 text-right text-red-600">
                            {formatDate(taskByID?.endDate) || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <Users size={14} className="text-indigo-500" />
                            ASSIGNED USERS*
                          </td>
                          <td className="text-sm py-3 px-3 text-right">
                            <div className="flex flex-wrap justify-end gap-1">
                              {assignedToArray && assignedToArray.length > 0 ? (
                                assignedToArray.map((person, index) => (
                                  <span
                                    key={index}
                                    className="text-xs font-medium py-1 text-gray-700 bg-blue-50 px-2 rounded-full inline-block"
                                  >
                                    {person}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500">
                                  No assignees
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Reviewer 1 */}
                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <User size={14} className="text-purple-500" />
                            REVIEWER 1
                          </td>
                          <td className="text-sm py-3 px-3 text-right text-gray-700">
                            {taskByID?.reviewer1 || "Not assigned"}
                          </td>
                        </tr>

                        {/* Reviewer 2 */}
                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <User size={14} className="text-purple-500" />
                            REVIEWER 2
                          </td>
                          <td className="text-sm py-3 px-3 text-right text-gray-700">
                            {taskByID?.reviewer2 || "Not assigned"}
                          </td>
                        </tr>

                        {/* Description */}
                        <tr className="border-b border-gray-100">
                          <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                            <BookOpen size={14} className="text-indigo-500" />
                            DESCRIPTION
                          </td>
                          <td className="text-sm py-3 px-3 text-right text-gray-700">
                            <div className="max-w-xs ml-auto text-right">
                              {taskByID?.description
                                ? taskByID.description.length > 50
                                  ? `${taskByID.description.substring(
                                      0,
                                      50
                                    )}...`
                                  : taskByID.description
                                : "No description provided"}
                            </div>
                          </td>
                        </tr>

                        {/* Display hold information if status is hold */}
                        {taskByID?.status === "hold" && (
                          <>
                            <tr className="border-b border-gray-100">
                              <td className="text-sm py-3 px-3 bg-orange-50 font-medium flex items-center gap-2">
                                <AlertCircle
                                  size={14}
                                  className="text-orange-500"
                                />
                                HOLD REASON*
                              </td>
                              <td className="text-sm py-3 px-3 text-right text-orange-700">
                                {taskByID?.onHoldReason || "N/A"}
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="text-sm py-3 px-3 bg-orange-50 font-medium flex items-center gap-2">
                                <MessageSquare
                                  size={14}
                                  className="text-orange-500"
                                />
                                HOLD DESCRIPTION*
                              </td>
                              <td className="text-sm py-3 px-3 text-right text-orange-700">
                                <div className="max-w-xs ml-auto text-right">
                                  {taskByID?.onHoldDescription
                                    ? taskByID.onHoldDescription.length > 50
                                      ? `${taskByID.onHoldDescription.substring(
                                          0,
                                          50
                                        )}...`
                                      : taskByID.onHoldDescription
                                    : "N/A"}
                                </div>
                              </td>
                            </tr>
                          </>
                        )}

                        {/* Notify By row if available */}
                        {notifyByArray && notifyByArray.length > 0 && (
                          <tr>
                            <td className="text-sm py-3 px-3 bg-gray-50 font-medium flex items-center gap-2">
                              <Bell size={14} className="text-indigo-500" />
                              NOTIFY BY
                            </td>
                            <td className="text-sm py-3 px-3 text-right text-gray-700">
                              <div className="flex flex-wrap justify-end gap-1">
                                {notifyByArray.map((method, index) => (
                                  <span
                                    key={index}
                                    className="inline-block bg-indigo-50 text-indigo-700 text-xs rounded-full px-2 py-1"
                                  >
                                    {method}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="w-full md:w-2/5 bg-white rounded-lg p-5 border border-gray-200 shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                      <MessageSquare size={18} className="text-indigo-500" />
                      ACTIVITY LOG
                    </h3>
                  </div>

                  {taskByID?.activities && taskByID.activities.length > 0 ? (
                    <div className="space-y-4">
                      {taskByID.activities.map((activity, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-green-400 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2
                              size={18}
                              className="text-green-500"
                            />
                            <div className="font-bold text-green-700">
                              {activity.status}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mb-3">
                            {activity.timestamp}
                          </div>
                          <div className="text-xs space-y-2 mt-3">
                            {activity.notes && Array.isArray(activity.notes)
                              ? activity.notes.map((note, noteIndex) => (
                                  <div
                                    key={noteIndex}
                                    className="p-2 bg-white rounded-md border-l-2 border-indigo-300 shadow-sm"
                                  >
                                    {note}
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-6">
                      No activity recorded yet
                    </div>
                  )}

                  <div className="p-5 border border-dashed border-gray-300 rounded-lg text-center mt-4">
                    <button className="text-indigo-600 font-medium text-sm flex items-center justify-center gap-2 w-full">
                      <PlusCircle size={18} />
                      ADD NEW ACTIVITY
                    </button>
                  </div>
                </div>

                {showPopup && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
                    <div
                      className="bg-white h-full w-full max-w-lg shadow-lg transform transition-transform duration-300 ease-in-out"
                      style={{
                        transform: showPopup
                          ? "translateX(0)"
                          : "translateX(100%)",
                        animation: showPopup
                          ? "slideIn 0.3s forwards"
                          : "slideOut 0.3s forwards",
                      }}
                    >
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          Edit Task
                        </h3>
                        <button
                          onClick={closePopup}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
                          aria-label="Close"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="overflow-y-auto h-[calc(100%-60px)]">
                        <TaskForm
                          isEditMode={true}
                          formData={taskByID}
                          taskData={taskByID}
                          onClose={closePopup}
                          fetchTasks={fetchTasks}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
