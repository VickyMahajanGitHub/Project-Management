import React, { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import {
  Home,
  Users,
  Calendar,
  Settings,
  BarChart2,
  Mail,
  FileText,
  ChevronDown,
  ChevronRight,
  Phone,
  Menu,
  Users2,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { FaRegFolderOpen } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [openSubMenus, setOpenSubMenus] = useState({
    sales: false,
    customers: false,
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      // Automatically collapse sidebar if screen width < 992px
      setIsExpanded(newWidth >= 992);
    };

    window.addEventListener("resize", handleResize);
    // Set initial state
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [width, setWidth] = useState();
  const toggleSubMenu = (menu) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={`bg-gradient-to-r from-blue-900 to-blue-700 text-white h-screen sticky top-0 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } flex flex-col items-center`}
    >
      <div className="p-4">
        {/* Header with Logo and Hamburger */}
        <div className="flex items-center justify-between mb-4">
          {/* Logo area */}
          <div
            className={`flex-grow flex items-center justify-center bg-white rounded-2xl ${
              isExpanded ? "" : ""
            }`}
          >
            {isExpanded ? (
              <img src={logo} alt="Logo" className="h-12 w-40 rounded-xl" />
            ) : (
              <img src={logo} alt="Logo" className="h-12 w-40 rounded-xl" />
            )}
          </div>

          {/* Hamburger Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="ml-2 p-2 hover:bg-blue-800 rounded-lg transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 mt-4">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Dashboard</span>}
          </NavLink>

          {/* Customers Section */}
          <div>
            <button
              onClick={() => toggleSubMenu("customers")}
              className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <FaRegFolderOpen />
                {isExpanded && <span className="ml-3">Project</span>}
              </div>
              {isExpanded &&
                (openSubMenus.customers ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                ))}
            </button>

            {openSubMenus.customers && isExpanded && (
              <div className="ml-4 mt-2 space-y-2">
                <NavLink
                  to="/project"
                  className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="ml-2">Project Dashboard</span>
                </NavLink>

                {/* <NavLink
                  to="/projectform"
                  className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="ml-2">Project Form</span>
                </NavLink> */}
              </div>
            )}
          </div>

          {/* Calendar */}
          <NavLink
            to={"/layout"}
            className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Calendar className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Calendar</span>}
          </NavLink>

          {/* Task Module */}
          <div>
            <NavLink
              to="/taskmanagement"
              className="w-full flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaTasks />
              {isExpanded && <span className="ml-3">Tasks</span>}
            </NavLink>
          </div>

          {/* user-start */}
          <div>
            <button
              className="w-full flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => navigate("/adduser")} // Correctly placed onClick
            >
              <Users2 className="h-5 w-5" />
              {isExpanded && <span className="ml-3">Users</span>}
            </button>
          </div>
          {/* user-end */}

          {/* Communications */}
          <a
            href="#"
            className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Mail className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Email</span>}
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Phone className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Calls</span>}
          </a>

          {/* Documents */}
          <NavLink
            to="/popup"
            className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FileText className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Documents</span>}
          </NavLink>

          {/* Settings */}
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors mt-8"
          >
            <Settings className="h-5 w-5" />
            {isExpanded && <span className="ml-3">Settings</span>}
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
