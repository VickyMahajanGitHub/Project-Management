import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  Trash2,
  Edit,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllTasks, deleteTaskByTitle, getTaskById } from "../api/service";
import Sidebar from "../Component/Sidebar";
import Header from "../Component/Header";
import StatusDashboard from "../Component/statusDashboard";
import TaskForm from "./taskfrom";
import { TbHomeHeart } from "react-icons/tb";
import { TiChevronRight } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { formatDate } from "../utlis/helper";

const TaskManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [taskById, setTaskById] = useState({});
  const [taskByIdUpdate, setTaskByIdUpdate] = useState({});
  const [totalTasks, setTotalTasks] = useState(0);
  const [NewTasks, setNewTasks] = useState(0);
  const [holdTasks, setHoldTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false); // toggle create/update mode

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(5);
  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    assignedTo: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTasks();
      if (!response?.success) {
        toast.error(response?.message || "Failed to fetch tasks");
        return;
      }
      const sortedTasks = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAllTasks(sortedTasks);
      setFilteredTasks(sortedTasks);
      //  Status counts
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
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error fetching tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (title) => {
    try {
      setLoading(true);
      const response = await deleteTaskByTitle(title);
      if (response?.success) {
        toast.success("Task deleted successfully");
        setAllTasks(allTasks.filter((task) => task.title !== title));
        setFilteredTasks(filteredTasks.filter((task) => task.title !== title));
      } else {
        toast.error(response?.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "IN PROGRESS":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "IN PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => setFormVisible(true), 10);
  };

  const closeForm = () => {
    setFormVisible(false);
    setTimeout(() => {
      setShowForm(false);
      setTaskById(null); // clear task state
      setIsEditMode(false);
    }, 300); // matches transition
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

  // For update API
  const handleEditClick = async (taskId) => {
    try {
      const response = await getTaskById(taskId);
      const taskData = response?.data;
      if (!taskData) {
        toast.error("No task data returned.");
        return;
      }
      setTaskById(taskData);
      setIsEditMode(true); // switch to update mode
      setShowForm(true);
      setTimeout(() => setFormVisible(true), 100);
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error("Error fetching task. Please try again.");
    }
  };

  const handleDeleteWithConfirmation = (title) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteTask(title);
        Swal.fire("Deleted!", "The task has been deleted.", "success");
      }
    });
  };

  // Filter tasks based on filters state
  useEffect(() => {
    let result = [...allTasks];
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }
    if (filters.assignedTo) {
      result = result.filter(
        (task) =>
          task.assignedToWork &&
          task.assignedToWork
            .toLowerCase()
            .includes(filters.assignedTo.toLowerCase())
      );
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          (task.taskName && task.taskName.toLowerCase().includes(searchTerm)) ||
          (task.title && task.title.toLowerCase().includes(searchTerm)) ||
          (task.category1 &&
            task.category1.toLowerCase().includes(searchTerm)) ||
          (task.category2 && task.category2.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredTasks(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, allTasks]);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      search: "",
      assignedTo: "",
    });
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch task by ID if ID is provided in URL
  useEffect(() => {
    if (id) {
      fetchTaskByID(id);
    }
  }, [id]);

  // Fetch task for update if ID is provided in URL
  useEffect(() => {
    if (id) {
      fetchTaskByIDUpdate(id);
    }
  }, [id]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <nav className="flex mb-2" aria-label="Breadcrumb">
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
                  <span className="ml-1 text-sm font-medium text-blue-600 md:ml-2">
                    Task Detail
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <StatusDashboard />
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header and Buttons */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Task Management
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  <Filter className="w-5 h-5" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                <button
                  onClick={openForm}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                  <IoMdAdd className="w-5 h-5" />
                  Create New Task
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className={`mb-6 ${showFilters ? "block" : "hidden"}`}>
              {/* Status Summary */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4 text-sm">
                <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-center">
                  <p className="font-semibold">Total</p>
                  <p>{totalTasks}</p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center">
                  <p className="font-semibold">New</p>
                  <p>{NewTasks}</p>
                </div>
                <div className="bg-purple-100 text-purple-800 p-3 rounded-lg text-center">
                  <p className="font-semibold">In Progress</p>
                  <p>{inProgressTasks}</p>
                </div>
                <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
                  <p className="font-semibold">Active</p>
                  <p>{activeTasks}</p>
                </div>
                <div className="bg-red-100 text-red-800 p-3 rounded-lg text-center">
                  <p className="font-semibold">Hold</p>
                  <p>{holdTasks}</p>
                </div>
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg text-center">
                  <p className="font-semibold">Completed</p>
                  <p>{completedTasks}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 p-2.5 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search tasks..."
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </div>

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="hold">Hold</option>
                </select>

                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <input
                  type="text"
                  className="p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Assigned to..."
                  name="assignedTo"
                  value={filters.assignedTo}
                  onChange={handleFilterChange}
                />

                <div className="flex space-x-2">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                  <select
                    value={tasksPerPage}
                    onChange={(e) => setTasksPerPage(Number(e.target.value))}
                    className="p-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="15">15 per page</option>
                    <option value="20">20 per page</option>
                  </select>
                </div>
              </div>
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
                    fetchTasks={fetchTasks}
                    taskData={taskById}
                    isEditMode={isEditMode}
                  />
                </div>
              </div>
            )}

            {/* Results count */}
            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredTasks.length > 0 ? indexOfFirstTask + 1 : 0} to{" "}
              {Math.min(indexOfLastTask, filteredTasks.length)} of{" "}
              {filteredTasks.length} tasks
            </div>

            {/* Task Table */}
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : currentTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-blue-900 border-b border-gray-100">
                      <th className="py-3 px-4 font-medium text-white text-sm">
                        Task Name
                      </th>
                      <th className="py-3 px-4 font-medium text-white text-sm">
                        Hours
                      </th>
                      <th className="py-3 px-4 font-medium text-white text-sm">
                        Priority
                      </th>
                      <th className="py-3 px-4 font-medium text-white text-sm">
                        Assigned To
                      </th>
                      <th className="py-3 px-4 font-medium text-white text-sm">
                        Status
                      </th>
                      <th className="py-3 px-4 font-medium text-white text-sm">
                        Activity
                      </th>
                      <th className="py-3 px-4 font-medium text-white text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTasks.map((task) => (
                      <tr
                        key={task._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {/* Task Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="bg-indigo-200 p-2 rounded-lg mr-3">
                              {getStatusIcon(task.status)}
                            </div>
                            <div>
                              <NavLink
                                to="#"
                                onClick={() => fetchTaskByID(task._id)}
                                className="font-medium text-gray-800 hover:text-blue-600"
                              >
                                <div className="min-w-0">
                                  <h2 className="text-sm font-bold text-gray-800 truncate">
                                    {task.taskName}
                                  </h2>
                                  <p className="text-gray-600 text-xs">
                                    {task.title}
                                  </p>
                                </div>
                              </NavLink>
                              <div className="text-xs text-gray-500">
                                {task.category1}
                                {task.category2 && `, ${task.category2}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {task.hours || 24}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              task.priority === "High"
                                ? "bg-yellow-100 text-yellow-800"
                                : task.priority === "Medium"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority || "Medium"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-800 font-medium">
                          {task.assignedToWork || "Unassigned"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          Created: {formatDate(task.createdAt)} <br />
                          Updated: {formatDate(task.updatedAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-3">
                            <button
                              className="p-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                              onClick={() =>
                                handleDeleteWithConfirmation(task.title)
                              }
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tasks found. Create a new task to get started.
              </div>
            )}

            {/* Pagination */}
            {filteredTasks.length > 0 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    &lt;
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    // Only show 5 page numbers at most
                    if (
                      i === 0 || // Always show first page
                      i === totalPages - 1 || // Always show last page
                      (i >= currentPage - 2 && i <= currentPage + 2) // Show 2 pages before and after current
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === i + 1
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (
                      (i === 1 && currentPage > 4) ||
                      (i === totalPages - 2 && currentPage < totalPages - 3)
                    ) {
                      // Show ellipsis
                      return <span key={i}>...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskManagement;
