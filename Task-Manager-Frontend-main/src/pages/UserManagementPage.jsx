import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../Component/Sidebar";
import Header from "../Component/Header";
import UserForm from "../Component/UserForm";
import { MdPersonAdd, MdDelete } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import {
  getAllUsers,
  deleteUserById,
  updateUserById,
  createUser,
} from "../api/service";
import Profile from "../assets/images/girlpicture.png";
import { NavLink } from "react-router-dom";
import { TbHomeHeart } from "react-icons/tb";
import { TiChevronRight } from "react-icons/ti";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Component/ui//table.jsx";

const UserManagementPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all users
  const fetchData = async () => {
    try {
      const getAllUsersResponse = await getAllUsers();
      if (getAllUsersResponse?.success === false) {
        return toast.error(getAllUsersResponse?.message);
      }
      setAllUsers(getAllUsersResponse?.data || []);
    } catch (error) {
      toast.error("Error fetching users.");
      setAllUsers([]);
    }
  };

  // Open form popup - used for both add and edit
  const openPopup = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setIsEditing(true);
    } else {
      setSelectedUser(null);
      setIsEditing(false);
    }
    setShowPopup(true);
  };

  // Close form popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  // Handle delete user
  const handleDelete = async (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteUserById(_id);
          if (response?.success) {
            toast.success("User deleted successfully");
            fetchData(); // Refresh data
          } else {
            toast.error(response?.message || "Failed to delete user");
          }
        } catch (error) {
          toast.error("Error deleting user");
        }
      }
    });
  };

  // Handle edit user
  const handleEdit = (user) => {
    openPopup(user);
  };

  // Handle form submission - works for both add and edit
  const handleFormSubmit = async (userData) => {
    setIsLoading(true);
    try {
      let response;
      if (isEditing) {
        // Update existing user
        response = await updateUserById(selectedUser._id, userData);
      } else {
        // Create new user
        response = await createUser(userData);
      }
      if (response?.success) {
        toast.success(
          isEditing ? "User updated successfully" : "User created successfully"
        );
        fetchData();
        closePopup();
      } else {
        toast.error(
          response?.message ||
            `Failed to ${isEditing ? "update" : "create"} user`
        );
      }
    } catch (error) {
      toast.error(`Error ${isEditing ? "updating" : "creating"} user`);
      console.error(`${isEditing ? "Update" : "Create"} user error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 w-full mb-4 bg-gray-100 min-h-screen">
          {/* Breadcrumb navigation */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
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
                    User Management
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Add User Button */}
          <button
            className="bg-blue-600 rounded shadow p-4 hover:bg-blue-800 text-white font-bold py-2 mb-4 px-4"
            onClick={() => openPopup()}
          >
            <MdPersonAdd className="inline-block mr-2" /> Add Users
          </button>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 text-white">
                <TableHead className="text-center">Profile</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Permission</TableHead>
                <TableHead className="text-center">Post Module</TableHead>
                <TableHead className="text-center">User Type</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers && allUsers.length > 0 ? (
                allUsers.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <img
                        src={row.profileImage || Profile}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      {Array.isArray(row.permission)
                        ? row.permission.join(", ")
                        : typeof row.permission === "string"
                        ? row.permission
                        : "None"}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(row.postModule)
                        ? row.postModule.join(", ")
                        : typeof row.postModule === "string"
                        ? row.postModule
                        : "None"}
                    </TableCell>
                    <TableCell>{row.role || row.role || "N/A"}</TableCell>
                    <TableCell
                      className={`p-4 font-bold ${
                        row.status?.toLowerCase() === "active"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {row.status || "Inactive"}
                    </TableCell>
                    <TableCell className="flex gap-2 text-xl">
                      <LiaUserEditSolid
                        onClick={() => handleEdit(row)}
                        className="hover:text-blue-700 text-blue-500 cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => handleDelete(row._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* User Form popup */}
      {showPopup && (
        <UserForm
          closePopup={closePopup}
          addUser={handleFormSubmit}
          isEditing={isEditing}
          userData={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
