import React from "react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";
import CRMCalendar from "../pages/CRMCalendar";
import { NavLink } from "react-router-dom";
import { TbHomeHeart } from "react-icons/tb";
import { TiChevronRight } from "react-icons/ti";
const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto  bg-gray-100">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-4 overflow-auto">
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
          <CRMCalendar />
        </main>
      </div>
    </div>
  );
};

export default Layout;
