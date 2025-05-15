import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Clock, AlertCircle, Sparkles } from "lucide-react";
import TaskForm from "./taskfrom";
import { GoTasklist } from "react-icons/go";
import { toast } from "react-hot-toast";
import { BsClipboardPlus } from "react-icons/bs";
import { getTaskByTitle, getTaskById } from "../api/service";
import { formatDate } from "../utlis/helper";
import ProjectTaskCounter from "./ProjectTaskCounter";
import UserActivityTimeline from "./ProjectActivity";

const TaskTable = ({ projectTitle }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [taskById, setTaskById] = useState({});
  const [totalTasks, setTotalTasks] = useState(0);
  const [NewTasks, setNewTasks] = useState(0);
  const [holdTasks, setHoldTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false); // toggle create/update mode
  const [projectTitleTask, setProjectTitleTask] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("projectTitleTask", projectTitleTask);

  const fetchTasksByProjectTitle = async (projectTitle) => {
    setLoading(true);
    try {
      const response = await getTaskByTitle(projectTitle);
      const sortedTasks = response.data;
      console.log("API Response after await:", sortedTasks);
      setProjectTitleTask(sortedTasks);

      // Task counting logic
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      setTotalTasks(
        sortedTasks.filter((task) => new Date(task.createdAt) >= thirtyDaysAgo)
          .length
      );
      setNewTasks(sortedTasks.filter((task) => task.status === "New").length);
      setHoldTasks(sortedTasks.filter((task) => task.status === "Hold").length);
      setInProgressTasks(
        sortedTasks.filter(
          (task) => task.status === "In Progress" || task.status === "running"
        ).length
      );
      setActiveTasks(
        sortedTasks.filter((task) => task.status === "Active").length
      );
      setCompletedTasks(
        sortedTasks.filter((task) => task.status === "Completed").length
      );
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Error fetching project data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch task by ID
  const fetchTaskByID = async (taskId) => {
    try {
      setLoading(true);
      const response = await getTaskById(taskId);
      const taskData = response?.data;
      if (!taskData) {
        toast.error("No task data returned.");
        return;
      }
      setTaskById(taskData);
      navigate("/taskdetail", { state: { task: taskData } });
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error("Error fetching task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-purple-100 text-purple-800";
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const cleanTasks = (tasks) =>
    tasks?.map((task) => ({
      ...task,
      activity: task?.activity || { created: "N/A", updated: null },
    }));

  useEffect(() => {
    if (projectTitle) {
      fetchTasksByProjectTitle(projectTitle);
    }
  }, [projectTitle]);

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => setFormVisible(true), 10);
  };

  const closeForm = () => {
    setFormVisible(false);
    setTimeout(() => {
      setShowForm(false);
      setTaskById(null);
      setIsEditMode(false);
    }, 300);
  };

  // Handle navigation to task detail page
  const navigateToTaskDetail = (taskId) => {
    navigate(`/task/${taskId}`);
    // You can also use toast to notify the user
    toast.success("Navigating to task details");
  };

  return (
    <div className="flex flex-col gap-8">
      <ProjectTaskCounter
        loading={loading}
        setLoading={setLoading}
        projectTitleTask={projectTitleTask}
        totalTasks={totalTasks}
        setProjectTitleTask={setProjectTitleTask}
        NewTasks={NewTasks}
        holdTasks={holdTasks}
        inProgressTasks={inProgressTasks}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
      />

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h3 className="text-white font-bold flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Project Activity Timeline
          </h3>
        </div>
        <div className="p-4">
          <UserActivityTimeline projectTitle={projectTitle} />
        </div>
      </div>

      <div className="w-full">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 mb-5 rounded-t-xl flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center">
            <GoTasklist className="w-5 h-5 mr-2" />
            Project Task Table
          </h3>
          <button
            onClick={openForm}
            className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-2  rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <BsClipboardPlus />
            Add Task
          </button>
        </div>

        {/* Slide-in Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-center z-50">
            <div
              className={`bg-white h-full w-[90%] max-w-xl rounded-l-lg p-6 relative transform transition-transform duration-300 ${
                formVisible ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={closeForm}
              >
                &#x2715;
              </button>
              <TaskForm
                onClose={closeForm}
                taskData={taskById}
                isEditMode={isEditMode}
                redirectAfterSubmit="/project"
              />
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          // Added max height and overflow-y-auto for vertical scrolling
          <div className="overflow-x-auto w-full">
            <div className="max-h-96 overflow-y-auto rounded-b-xl shadow-md">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-blue-900 text-white">
                    <th className="px-4 text-left w-6"></th>
                    <th className="px-4 text-left text-sm">Task Name</th>
                    <th className="py-3 px-4 text-left">Hours</th>
                    <th className="py-3 px-4 text-left">Priority</th>
                    <th className="py-3 px-4 text-left">Assigned To</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTitleTask?.length > 0 ? (
                    projectTitleTask?.map((task) => (
                      <tr
                        key={task?._id || task?.taskName}
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        onClick={() => fetchTaskByID(task._id)}
                      >
                        <td className="py-3 px-4">
                          <div className="w-4 h-4 rounded-full bg-blue-200"></div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{task?.name}</div>
                          <div className="text-gray-500 text-sm">
                            {task?.taskName}
                          </div>
                        </td>
                        <td className="py-3 px-4">{task?.hours}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              task?.priority
                            )}`}
                          >
                            {task?.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">{task?.assignedTo}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              task?.status
                            )}`}
                          >
                            {task?.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Created: {formatDate(task?.createdAt) || "N/A"}
                            </div>
                            {task?.activity?.updated && (
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Updated: {task?.activity?.updated}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-6 text-center text-gray-500"
                      >
                        No tasks available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTable;
