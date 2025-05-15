import React, { useState } from "react";
import Header from "../Component/Header";
import Sidebar from "../Component/Sidebar";

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectCategory: "",
    projectDescription: "",
    subCategories: {
      development: false,
      billing: false,
      development2: false,
      development3: false,
      development4: false,
    },
    companyName: "",
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    address: "",
    assignedTo: [],
    taskName: "",
    taskCategory: "",
    taskPriority: "",
    taskDescription: "",
    startDate: "",
    endDate: "",
  });

  const team = [
    { id: 1, name: "AKASH UPADHYAY" },
    { id: 2, name: "AKASH UPADHYAY" },
    { id: 3, name: "AKASH UPADHYAY" },
    { id: 4, name: "AKASH UPADHYAY" },
    { id: 5, name: "AKASH UPADHYAY" },
    { id: 6, name: "AKASH UPADHYAY" },
  ];

  // Mock data for recent projects
  const recentProjects = [
    {
      id: 1,
      title: "Website Redesign",
      category: "Web Development",
      progress: 75,
      client: "ABC Corp",
    },
    {
      id: 2,
      title: "Mobile App Development",
      category: "Mobile",
      progress: 40,
      client: "XYZ Inc",
    },
    {
      id: 3,
      title: "E-commerce Platform",
      category: "Web Development",
      progress: 90,
      client: "123 Industries",
    },
    {
      id: 4,
      title: "Brand Identity Design",
      category: "Design",
      progress: 60,
      client: "Best Company",
    },
  ];

  // Mock data for team activities
  const teamActivities = [
    {
      id: 1,
      user: "Akash Upadhyay",
      action: "added a new task",
      time: "10 minutes ago",
      project: "Website Redesign",
    },
    {
      id: 2,
      user: "Akash Upadhyay",
      action: "completed a milestone",
      time: "2 hours ago",
      project: "Mobile App",
    },
    {
      id: 3,
      user: "Akash Upadhyay",
      action: "updated project status",
      time: "Yesterday",
      project: "E-commerce",
    },
    {
      id: 4,
      user: "Akash Upadhyay",
      action: "added a comment",
      time: "2 days ago",
      project: "Brand Identity",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, section) => {
    const { name, checked } = e.target;

    if (section === "subCategories") {
      setFormData({
        ...formData,
        subCategories: {
          ...formData.subCategories,
          [name]: checked,
        },
      });
    } else if (section === "assignedTo") {
      const assignedTo = [...formData.assignedTo];

      if (checked) {
        assignedTo.push(name);
      } else {
        const index = assignedTo.indexOf(name);
        if (index > -1) {
          assignedTo.splice(index, 1);
        }
      }

      setFormData({
        ...formData,
        assignedTo,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <div className="flex min-h-screen bg-gray-300">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area with header and form */}
      <div className="flex-1 flex flex-col">
        {/* Header - Only spans the width after sidebar */}
        <Header />

        {/* Main content */}
        <div className="p-4 md:p-6">
          {/* Breadcrumbs */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg
                    className="w-3 h-3 mr-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <a
                    href="#"
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    Projects
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-blue-600 md:ml-2">
                    Add New Project
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side - Form */}
            <div className="w-full lg:w-7/12">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-md md:p-6"
              >
                <div className="bg-blue-600 text-white rounded-md p-2 mb-6 text-center text-lg font-semibold">
                  ADD NEW PROJECTS
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-600 mb-1">
                      PROJECT TITLE
                    </label>
                    <input
                      type="text"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-600 mb-1">
                      PROJECT CATEGORY
                    </label>
                    <select
                      name="projectCategory"
                      value={formData.projectCategory}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile Development</option>
                      <option value="design">Design</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    PROJECT DESCRIPTION
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-600 mb-1">
                    PROJECT SUB CATEGORY
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="development"
                        name="development"
                        checked={formData.subCategories.development}
                        onChange={(e) =>
                          handleCheckboxChange(e, "subCategories")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="development" className="text-sm">
                        DEVELOPMENT
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="billing"
                        name="billing"
                        checked={formData.subCategories.billing}
                        onChange={(e) =>
                          handleCheckboxChange(e, "subCategories")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="billing" className="text-sm">
                        BILLING
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="development2"
                        name="development2"
                        checked={formData.subCategories.development2}
                        onChange={(e) =>
                          handleCheckboxChange(e, "subCategories")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="development2" className="text-sm">
                        DEVELOPMENT
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="development3"
                        name="development3"
                        checked={formData.subCategories.development3}
                        onChange={(e) =>
                          handleCheckboxChange(e, "subCategories")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="development3" className="text-sm">
                        DEVELOPMENT
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="development4"
                        name="development4"
                        checked={formData.subCategories.development4}
                        onChange={(e) =>
                          handleCheckboxChange(e, "subCategories")
                        }
                        className="mr-2"
                      />
                      <label htmlFor="development4" className="text-sm">
                        DEVELOPMENT
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-blue-600 mb-3">
                    CLIENT DETAILS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      name="companyName"
                      placeholder="COMPANY NAME"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <input
                      type="text"
                      name="contactPersonName"
                      placeholder="CONTACT PERSON NAME"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <input
                      type="text"
                      name="contactPersonPhone"
                      placeholder="CONTACT PERSON PHONE"
                      value={formData.contactPersonPhone}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="contactPersonEmail"
                      placeholder="CONTACT PERSON EMAIL ID"
                      value={formData.contactPersonEmail}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <input
                      type="text"
                      name="address"
                      placeholder="ADDRESS"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-blue-600 mb-3">
                    ASSIGNED TO
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {team.map((member) => (
                      <div key={member.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          name={member.id.toString()}
                          onChange={(e) =>
                            handleCheckboxChange(e, "assignedTo")
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor={`member-${member.id}`}
                          className="text-sm"
                        >
                          {member.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-300 my-4"></div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-blue-600 mb-3">
                    TASK & NOTES (OPTIONAL)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      name="taskName"
                      placeholder="TASK NAME"
                      value={formData.taskName}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <input
                      type="text"
                      name="taskCategory"
                      placeholder="CATEGORY"
                      value={formData.taskCategory}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <input
                      type="text"
                      name="taskPriority"
                      placeholder="SET PRIORITY"
                      value={formData.taskPriority}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <textarea
                    name="taskDescription"
                    placeholder="TASK DESCRIPTION"
                    value={formData.taskDescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-gray-100 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  ></textarea>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      name="startDate"
                      placeholder="START DATE"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />

                    <input
                      type="date"
                      name="endDate"
                      placeholder="END DATE"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                  >
                    SAVE AND ADD PROJECT
                  </button>
                </div>
              </form>
            </div>

            {/* Right side - Project summaries & Activities */}
            <div className="w-full lg:w-5/12 space-y-6">
              {/* Project Summary Widget */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">
                  Project Summary
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Total Projects</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-sm text-gray-600">Pending Review</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">1</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">
                  Recent Projects
                </h2>

                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{project.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {project.category}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        Client: {project.client}
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-600 mt-1">
                        {project.progress}% Complete
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Activity */}
              {/* <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Team Activity</h2>
                
                <div className="space-y-4">
                  {teamActivities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 border-b border-gray-200 pb-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {activity.user.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action} on <span className="text-blue-600">{activity.project}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full text-blue-600 text-sm font-medium mt-4 flex items-center justify-center">
                  View All Activities
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectForm;
