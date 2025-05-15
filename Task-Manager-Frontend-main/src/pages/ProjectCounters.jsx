import React from "react";
import { useEffect, useState } from "react";
import { getAllProject } from "../api/service";
import {
  MdAssignment,
  MdPeople,
  MdPlayCircleFilled,
  MdBolt,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";

const ProjectCounter = ({ icon, label, count }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="flex items-center p-4">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <div className="text-indigo-600">{icon}</div>
        </div>
        <div className="ml-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-800">{count}</p>
        </div>
      </div>
    </div>
  );
};

const ProjectDashboard = () => {
  // Create separate state variables for different metrics
  const [completedProjects, setCompletedProjects] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [holdProjects, setholdProjects] = useState(0);
  const [inProgressProjects, setInProgressProjects] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [NewProjects, setNewProjects] = useState(0);

  // Fetch project data from the API
  const fetchProjects = async () => {
    try {
      const data = await getAllProject();
      const projects = data?.data;
      if (!Array.isArray(projects)) {
        console.error("❌ 'data.data' is not an array", projects);
        return;
      }
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      setTotalProjects(
        projects.filter(
          (project) => new Date(project.createdAt) >= thirtyDaysAgo
        ).length
      );
      setNewProjects(
        projects.filter((project) => project.status === "New").length
      );
      setholdProjects(
        projects.filter((project) => project.status === "Hold").length
      );
      setInProgressProjects(
        projects.filter(
          (project) =>
            project.status === "In Progress" || project.status === "running"
        ).length
      );
      setActiveProjects(
        projects.filter((project) => project.status === "Active").length
      );
      setCompletedProjects(
        projects.filter((project) => project.status === "Completed").length
      );
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">Project Metrics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ProjectCounter
          icon={<MdAssignment className="text-lg" />}
          label="Total Projects"
          count={totalProjects}
        />

        <ProjectCounter
          icon={<MdPeople className="text-lg" />}
          label="New"
          count={NewProjects}
        />

        <ProjectCounter
          icon={<MdPeople className="text-lg" />}
          label="Hold"
          count={holdProjects}
        />

        <ProjectCounter
          icon={<MdPlayCircleFilled className="text-lg" />}
          label="In Progress"
          count={inProgressProjects}
        />

        <ProjectCounter
          icon={<MdBolt className="text-lg" />}
          label="Active"
          count={activeProjects}
        />

        <ProjectCounter
          icon={<MdCheckCircle className="text-lg" />}
          label="Completed"
          count={completedProjects}
        />
      </div>
    </div>
  );
};

export default ProjectDashboard;
