import {
  FileText,
  Users,
  PlayCircle,
  Zap,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllTasks } from "../api/service";

// Create a context for task updates (add this to a separate context file in a real app)
export const TaskUpdateContext = React.createContext({
  lastUpdate: new Date(),
  triggerUpdate: () => {},
});

const StatusDashboard = () => {
  const [projectData, setProjectData] = useState({
    stats: {
      totalTasks: 0,
      totalMembers: 0,
      activeTasks: 0,
      NewTasks: 0,
      completedTasks: 0,
      inactiveTasks: 0,
      overdueTasks: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await getAllTasks();
      // console.log("📦 Full API response:", response);

      const tasks = response?.data || [];

      const stats = {
        totalTasks: tasks.length,
        totalMembers: new Set(tasks.map((task) => task.assignedTo)).size,
        activeTasks: tasks.filter(
          (task) => task.status?.toLowerCase().trim() === "active"
        ).length,
        NewTasks: tasks.filter(
          (task) => task.status?.toLowerCase().trim() === "new"
        ).length,
        completedTasks: tasks.filter(
          (task) => task.status?.toLowerCase().trim() === "completed"
        ).length,
        inactiveTasks: tasks.filter(
          (task) => task.status?.toLowerCase().trim() === "inactive"
        ).length,
        holdTasks: tasks.filter(
          (task) => task.status?.toLowerCase().trim() === "hold"
        ).length,
      };

      setProjectData({ stats });
      setLastRefresh(new Date());
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      toast.error("Error fetching tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTasks();

    // Set up a polling interval (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchTasks();
    }, 30000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchTasks();
    toast.success("Dashboard refreshed!");
  };

  // New status card component for smaller counters
  const StatusCard = ({
    icon,
    count,
    label,
    color,
    to = "/taskmangementpage",
  }) => {
    const IconComponent = icon;
    return (
      <NavLink
        to={to}
        className={`bg-white rounded-md shadow-sm p-3 hover:shadow transition-all duration-200 border-l-4 border-${color}-500 flex items-center justify-between group`}
      >
        <div className="flex items-center">
          <div
            className={`bg-${color}-50 w-8 h-8 rounded-full flex items-center justify-center mr-3 group-hover:bg-${color}-100`}
          >
            <IconComponent className={`w-4 h-4 text-${color}-600`} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {label}
            </div>
            <div className="text-lg font-bold text-gray-800">
              {loading ? "..." : count}
            </div>
          </div>
        </div>
      </NavLink>
    );
  };

  return (
    <div className="relative p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-blue-700">Project Status</h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            title="Refresh dashboard"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-600 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatusCard
          icon={FileText}
          count={projectData.stats.totalTasks}
          label="Total Tasks"
          color="blue"
        />
        <StatusCard
          icon={Users}
          count={projectData.stats.totalMembers}
          label="Team Members"
          color="indigo"
        />
        <StatusCard
          icon={PlayCircle}
          count={projectData.stats.activeTasks}
          label="Active Tasks"
          color="green"
        />
        <StatusCard
          icon={Zap}
          count={projectData.stats.NewTasks}
          label="New Tasks"
          color="cyan"
        />
        <StatusCard
          icon={CheckCircle}
          count={projectData.stats.completedTasks}
          label="Completed"
          color="emerald"
        />
        <StatusCard
          icon={AlertTriangle}
          count={projectData.stats.inactiveTasks}
          label="Inactive"
          color="gray"
        />
      </div>

      {/* Overdue Tasks - Slightly different styling to highlight it */}
      <div className="mt-3 max-w-sm">
        <NavLink
          to="/projectdetail"
          className="bg-white rounded-md shadow-sm p-3 hover:shadow transition-all duration-200 border-l-4 border-yellow-500 flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="bg-yellow-50 w-8 h-8 rounded-full flex items-center justify-center mr-3 group-hover:bg-yellow-100">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hold Tasks
              </div>
              <div className="text-lg font-bold text-yellow-600">
                {loading ? "..." : projectData.stats.holdTasks}
              </div>
            </div>
          </div>
          <span className="text-xs text-yellow-500 font-medium">
            Requires review
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default StatusDashboard;
