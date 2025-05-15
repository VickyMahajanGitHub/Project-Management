import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import { useState } from "react";
import ProjectCard from "../Component/projectDetailCard";

const ProjectDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const { projectId } = useParams();

  const handleAdd = () => {
    window.location.href = "/addtask";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-auto">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col pl-64">
        <div className="sticky top-0 z-40">
          <Header />
        </div>
        {/* Main content area */}
        <div className="flex-1  bg-gray-100">
          <div className="container mx-auto p-2">
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <NavLink
                    to="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
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
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="ml-1 text-sm font-medium text-blue-600 md:ml-2">
                      Project Detail
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Content Area - Left & Right Layout */}
            <div className="flex flex-col space-y-2">
              {/* Header Section with Title and possible action buttons */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Project Overview
                </h2>
              </div>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
                <div className="xl:col-span-1 ">
                  <ProjectCard projectId={projectId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
