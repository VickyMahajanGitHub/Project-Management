# 🚀 Project Management System

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A full-featured Project Management web application built using **React (Vite)**, **Node.js**, **Express**, and **MongoDB**. This system allows teams to collaborate on projects, manage tasks, track progress with real-time updates, and maintain strict role-based access control.

---

## ✨ Features

- 🔐 **Authentication & Authorization (JWT)**
- 🧑‍💼 **Role-based Access Control**
  - Admin: Full access to users, projects, tasks
  - Users: Assigned project/task management
- 📁 **Project Creation & Assignment**
- ✅ **Task Creation and Tracking**
- 📊 **Real-Time Progress Bar** based on task completion
- 👮 **Protected Routes** on both client & server
- ⚙️ **Admin-only User Management**
- 📈 **Dashboard View with Task Status**

---

## 🧰 Tech Stack

| Layer       | Tech                                    |
|-------------|-----------------------------------------|
| Frontend    | React (Vite), Tailwind CSS or Bootstrap |
| Backend     | Node.js, Express                        |
| Database    | MongoDB (Mongoose)                      |
| Auth        | JWT, bcrypt                             |
| State Mgmt  | Context API / Redux (optional)          |
| HTTP Client | Axios                                   |

---

## 📦 Installation

### 🔧 Clone the Repository

```bash
git clone https://github.com/your-username/project-management-system.git
cd project-management-system



📁 Backend Setup

cd backend
npm install

➕ Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

Run the backend:

npm run dev

💻 Frontend Setup

cd frontend
npm install
npm run dev

