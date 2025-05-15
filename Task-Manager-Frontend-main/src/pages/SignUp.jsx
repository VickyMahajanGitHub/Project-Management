import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/service";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBriefcase,
  FaCheck,
  FaShieldAlt,
  FaNewspaper,
  FaToggleOn,
} from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    designation: "",
    permission: "",
    postModule: "",
    status: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "User Type is required";
    if (!formData.designation)
      newErrors.designation = "Designation is required";
    if (!formData.permission) newErrors.permission = "Permission is required";
    if (!formData.postModule) newErrors.postModule = "Post Module is required";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await register(formData);
        if (response.success) {
          toast.success(`User Registered: ${response.data}`);
          navigate("/");
        } else {
          toast.error(
            `Registration Failed: ${response.message || "Unknown error"}`
          );
        }
      } catch (error) {
        toast.error(`Sign Up Error: ${error.message || error}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h2>
          <p className="text-gray-500 mt-2">
            Join our community and get started today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-500" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaLock className="mr-2 text-blue-500" /> Security
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Role & Permissions Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-blue-500" /> Role & Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Type
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select User Type</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.designation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.designation}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Level
                </label>
                <div className="relative">
                  <select
                    name="permission"
                    value={formData.permission}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select Permission</option>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaShieldAlt className="text-gray-400" />
                  </div>
                </div>
                {errors.permission && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.permission}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Module
                </label>
                <div className="relative">
                  <select
                    name="postModule"
                    value={formData.postModule}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select Post Module</option>
                    <option value="blog">Blog</option>
                    <option value="news">News</option>
                    <option value="project">Project</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FaNewspaper className="text-gray-400" />
                  </div>
                </div>
                {errors.postModule && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postModule}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FaToggleOn className="text-gray-400" />
                </div>
              </div>
              <label className="text-sm text-gray-600">Status</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="termsAccepted"
                id="terms"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I accept the{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Terms and Conditions
                </span>
              </label>
            </div>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:-translate-y-0.5"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
