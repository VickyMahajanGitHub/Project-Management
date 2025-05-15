import React, { useState, useEffect } from "react";
import { TbCamera, TbX } from "react-icons/tb";
import { createUser } from "../api/service";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

const UserForm = ({
  closePopup,
  addUser,
  isEditing = false,
  userData = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
    designation: "",
    permission: [],
    postModule: [],
    status: "",
    termsAccepted: false,
    department: "",
    profileImage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Populate form when editing existing user
  useEffect(() => {
    if (isEditing && userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        userType: userData.userType || "",
        designation: userData.designation || "",
        permission: userData.permission || [],
        postModule: userData.postModule || [],
        status: userData.status || "",
        termsAccepted: userData.termsAccepted || false,
        department: userData.department || "",
        profileImage: userData.profileImage || "",
      });
    }
  }, [isEditing, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const userFormData = { ...formData };
      // If there's an image file, handle it
      if (imageFile) {
        // In a real implementation, you'd upload the image to a server
        // and get a URL back to store in userData.profileImage
        // For now, we'll just keep the URL as is
      }
      // If editing, don't send password if it's empty
      if (isEditing && !userFormData.password) {
        delete userFormData.password;
      }
      // Call the parent's addUser function (which will call either createUser or updateUserById)
      // return console.log("userFormData", userFormData);
      await addUser(userFormData);
      // Close popup will be handled by parent component after successful operation
    } catch (error) {
      const actionType = isEditing ? "updating" : "creating";
      toast.error(`Error ${actionType} user`);
      console.error(`Error ${actionType} user:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={closePopup}
            className="text-gray-500 hover:text-gray-700"
          >
            <TbX size={24} />
          </button>
        </div>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200"></div>
            )}
            <label className="absolute bottom-0 right-0 bg-white border p-1 rounded-full cursor-pointer">
              <TbCamera />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Full Name *</span>
            <input
              type="text"
              name="name"
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Email *</span>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </label>

          <label className="block relative">
            <span className="text-gray-700 font-medium">
              {isEditing
                ? "Password (leave blank to keep current)"
                : "Password *"}
            </span>
            <input
              type={showPassword ? "text" : "password"} // Toggle between password and text type
              name="password"
              placeholder={
                isEditing
                  ? "Enter new password or leave blank"
                  : "Enter password"
              }
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10" // Added pr-10 for space for the eye icon
              required={!isEditing}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Department *</span>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Department</option>
              <option value="hr">HR</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="it">IT</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Post Module *</span>
            <select
              name="postModule"
              value={formData.postModule}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Post Module</option>
              <option value="blog">Blog</option>
              <option value="news">News</option>
              <option value="project">Project</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Designation *</span>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Designation</option>
              <option value="Manager">Manager</option>
              <option value="Senior Executive">Senior Executive</option>
              <option value="Junior Executive">Junior Executive</option>
              <option value="Intern">Intern</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">User Type *</span>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select User Type</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={closePopup}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              disabled={isSubmitting}
            >
              <TbX className="inline-block mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
