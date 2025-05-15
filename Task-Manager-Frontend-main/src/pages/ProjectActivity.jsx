import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, Users, Plus } from "lucide-react";
import { getActivitiesByProject, createActivity } from "../api/service";

export default function UserActivityTimeline({ projectName, projectTitle }) {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: "assigned",
    taskName: "",
    assignedTo: [],
    user: "",
  });

  async function fetchActivities() {
    if (!projectName) return;
    try {
      setLoading(true);
      const data = await getActivitiesByProject(projectName, filter);
      console.log("Fetched Activities:", data); // Log the data being fetched
      // Handle different response formats
      if (Array.isArray(data)) {
        setActivities(data);
      } else if (data && Array.isArray(data.activities)) {
        setActivities(data.activities);
      } else if (data && typeof data === "object") {
        // If data is an object but not in the expected format
        setActivities([]);
        console.error("Unexpected data format:", data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      alert(
        "Failed to load activities. Please check your network or try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateActivity(e) {
    e.preventDefault();
    console.log("Creating activity with data:", newActivity);
    if (!newActivity.taskName || !newActivity.user) {
      alert("Please fill out all required fields");
      return;
    }
    try {
      setLoading(true);
      // Add projectName to the activity data
      const activityData = {
        ...newActivity,
        projectName,
        timestamp: new Date().toISOString(),
      };
      const response = await createActivity(activityData);
      console.log("Activity created response:", response);
      // Add the new activity to the current state immediately for better UX
      const newActivityWithTimestamp = {
        ...activityData,
        // Use the server's timestamp if available, or use the local timestamp
        timestamp: response?.timestamp || activityData.timestamp,
      };
      setActivities((prevActivities) => [
        ...prevActivities,
        newActivityWithTimestamp,
      ]);
      // Reset form fields
      setNewActivity({
        type: "assigned",
        taskName: "",
        assignedTo: [],
        user: "",
      });
      // Close the form
      setShowCreateForm(false);
      // ReNew activities to ensure server data is synced
      setTimeout(fetchActivities, 500);
    } catch (error) {
      console.error("Failed to create activity:", error);
      alert("Failed to create activity. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Split the comma-separated string into an array
  function handleAssignedToChange(e) {
    const users = e.target.value
      .split(",")
      .map((user) => user.trim())
      .filter((user) => user);
    setNewActivity({
      ...newActivity,
      assignedTo: users,
    });
  }

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((activity) => activity.type === filter);

  function formatDate(dateString) {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " at " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Unknown date";
    }
  }

  function getActivityIcon(type) {
    switch (type) {
      case "completed":
        return <CheckCircle className="text-green-500" size={20} />;
      case "assigned":
        return <Clock className="text-blue-500" size={20} />;
      case "overdue":
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  }

  function getActivityText(activity) {
    const { type, taskName, projectName, user, assignedTo } = activity;
    switch (type) {
      case "completed":
        return (
          <span>
            <span className="font-medium">{user}</span> completed task{" "}
            <span className="font-medium">{taskName}</span> in project{" "}
            <span className="font-medium">{projectName}</span>
          </span>
        );
      case "assigned":
        return (
          <span>
            <span className="font-medium">{user}</span> assigned task{" "}
            <span className="font-medium">{taskName}</span> in project{" "}
            <span className="font-medium">{projectName}</span> to{" "}
            {assignedTo?.length > 0
              ? assignedTo.length > 1
                ? "multiple users"
                : assignedTo[0]
              : "no users"}
          </span>
        );
      case "overdue":
        return (
          <span>
            Task <span className="font-medium">{taskName}</span> in project{" "}
            <span className="font-medium">{projectName}</span> assigned to{" "}
            <span className="font-medium">
              {assignedTo?.length > 0 ? assignedTo.join(", ") : "no users"}
            </span>{" "}
            is overdue
          </span>
        );
      default:
        return (
          <span>
            Action performed on task{" "}
            <span className="font-medium">{taskName}</span> in project{" "}
            <span className="font-medium">{projectName}</span>
          </span>
        );
    }
  }

  useEffect(() => {
    fetchActivities();
  }, [projectName, filter]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Project Activities {projectName ? `- ${projectName}` : ""}
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            {showCreateForm ? "Cancel" : "Create Activity"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <form onSubmit={handleCreateActivity}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={newActivity.type}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, type: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="assigned">Assigned</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={newActivity.taskName}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        taskName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newActivity.user}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, user: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newActivity.assignedTo.join(", ")}
                    onChange={handleAssignedToChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter assigned users (comma-separated)"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Activity"}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="mt-2 flex space-x-2">
          {["all", "completed", "assigned", "overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === f
                  ? f === "completed"
                    ? "bg-green-100 text-green-800"
                    : f === "assigned"
                    ? "bg-blue-100 text-blue-800"
                    : f === "overdue"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto p-4">
        {loading && !showCreateForm ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredActivities && filteredActivities.length > 0 ? (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-6 w-px bg-gray-200"></div>

            {filteredActivities.map((activity, index) => (
              <div
                key={`${activity.taskName}-${activity.timestamp}-${index}`}
                className="mb-6 relative"
              >
                <div className="flex items-start">
                  <div className="relative flex items-center justify-center bg-white z-10">
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-700">
                        {getActivityText(activity)}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </div>

                      {activity.assignedTo?.length > 0 && (
                        <div className="mt-2 flex items-center">
                          <Users size={16} className="text-gray-400 mr-1" />
                          <div className="flex -space-x-2">
                            {activity.assignedTo
                              .slice(0, 3)
                              .map((user, idx) => (
                                <div
                                  key={idx}
                                  className="h-6 w-6 rounded-full bg-gray-300 border border-white flex items-center justify-center text-xs text-gray-700"
                                >
                                  {user ? user.charAt(0) : "?"}
                                </div>
                              ))}
                            {activity.assignedTo.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs text-gray-700">
                                +{activity.assignedTo.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No activities found. {!projectName && "Please select a project."}
          </div>
        )}
      </div>
    </div>
  );
}
