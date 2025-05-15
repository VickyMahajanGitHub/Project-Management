import { useState, useEffect } from "react";
import { AiOutlineBarChart } from "react-icons/ai";
import { FiSun, FiPlayCircle, FiCheck, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { formatDate } from "../utlis/helper";

export default function ProjectTaskCounter({
  projectTitleTask,
  loading,
  totalTasks,
  NewTasks,
  holdTasks,
  inProgressTasks,
  activeTasks,
  setProjectTitleTask,
  setLoading,
  completedTasks,
}) {
  // console.log("Props received in ProjectTaskCounter:", {
  //   projectTitleTask,
  //   loading,
  //   totalTasks,
  //   NewTasks,
  //   holdTasks,
  //   inProgressTasks,
  //   activeTasks,
  //   setProjectTitleTask,
  //   setLoading,
  //   completedTasks,
  // });
  const [projectTitle, setProjectTitle] = useState("");
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchTasksByProjectTitle = async (projectTitle) => {
    setLoading(true);
    try {
      const response = await getTaskByTitle(projectTitle);
      setProjectTitleTask(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Error fetching project data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await getTaskBytitle();
      if (!response.success) {
        toast.error(response?.message || "Failed to fetch tasks");
      }
      // const data = await response.json();
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
      // toast?.error?.("Error fetching tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTasks();
    toast?.success?.("Dashboard refreshed!");
  };

  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(() => {
      fetchTasks();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (projectTitle) {
      fetchTasksByProjectTitle(projectTitle);
    }
  }, [projectTitle]);

  // Calculate % for mini progress bars
  const calculatePercentage = (part) => {
    if (totalTasks === 0) return 0;
    return Math.round((part / totalTasks) * 100);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-700">Task Status</h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">
            Last updated: {formatDate(projectTitleTask[0]?.updatedAt)}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            title="Refresh dashboard"
          >
            <FiRefreshCw
              className={`w-4 h-4 text-gray-600 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <CounterCard
          title="Total Tasks"
          value={totalTasks}
          color="blue"
          Icon={AiOutlineBarChart}
          percentage={100}
          loading={loading}
        />

        {/* In Progress Tasks */}
        <CounterCard
          title="In Progress"
          value={inProgressTasks}
          color="purple"
          Icon={FiSun}
          percentage={calculatePercentage(inProgressTasks)}
          loading={loading}
        />

        {/* Hold Tasks */}
        <CounterCard
          title="hold"
          value={holdTasks}
          color="amber"
          Icon={FiPlayCircle}
          percentage={calculatePercentage(holdTasks)}
          loading={loading}
        />

        {/* Completed Tasks */}
        <CounterCard
          title="Completed"
          value={completedTasks}
          color="green"
          Icon={FiCheck}
          percentage={calculatePercentage(completedTasks)}
          loading={loading}
        />
      </div>
    </div>
  );
}

// Small component for each counter card
function CounterCard({ title, value, color, Icon, percentage, loading }) {
  console.log("CounterCard:", { title, value, color, percentage, loading });
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-xl shadow-md border-l-4 border-${color}-500`}
    >
      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-xs font-bold uppercase text-${color}-500 tracking-wider`}
            >
              {title}
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-800">
              {loading ? "..." : value}
            </h2>
          </div>
          <div className={`bg-${color}-100 p-2 rounded-lg`}>
            <Icon className="h-5 w-5 text-current" />
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${color}-400 h-2 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
