import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDashboard";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TaskManagement from "./pages/TaskManagement";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import AddTask from "./pages/AddTask";
import AddProjectForm from "./pages/AddProjectForm";
import AddUserPage from "./pages/UserManagementPage";
import TaskForm from "./pages/taskfrom";
import Layout from "./Calender/Layout";

const router = createBrowserRouter([
  { path: "/", element: <SignIn /> },
  { path: "/register", element: <SignUp /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/project", element: <ProjectDetails /> },
  { path: "/project/:projectId", element: <ProjectDetailPage /> },
  { path: "/taskform", element: <TaskForm /> },
  { path: "/taskmanagement", element: <TaskManagement /> },
  { path: "/taskdetail", element: <TaskDetailsPage /> },
  { path: "/addtask", element: <AddTask /> },
  { path: "/addprojectform", element: <AddProjectForm /> },
  { path: "/adduser", element: <AddUserPage /> },
  { path: "/layout", element: <Layout /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
