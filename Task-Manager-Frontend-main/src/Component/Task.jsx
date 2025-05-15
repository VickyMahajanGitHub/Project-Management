// import React, { useState } from 'react';

// const ProjectDetails = ({ project, onClose }) => {
//   if (!project) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl">
//         <div className="p-6 border-b">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold flex items-center gap-3">
//               <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-xl">
//                 {project.icon}
//               </span>
//               {project.taskName}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700">
//               ✕
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Category</h3>
//                 <p className="mt-1">{project.subname}</p>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Status</h3>
//                 <p className="mt-1">
//                   <span className={`px-3 py-1 rounded-full text-white text-sm ${
//                     project.status === 'Completed' ? 'bg-green-500' :
//                     project.status === 'In Progress' ? 'bg-orange-500' : 'bg-red-500'
//                   }`}>
//                     {project.status}
//                   </span>
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Priority</h3>
//                 <p className="mt-1">
//                   <span className={`px-3 py-1 rounded-full text-white text-sm ${
//                     project.priority === 'High' ? 'bg-red-500' :
//                     project.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
//                   }`}>
//                     {project.priority}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
//                 <p className="mt-1">{project.assignedTo}</p>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
//                 <p className="mt-1">{project.deadline}</p>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Progress</h3>
//                 <div className="mt-2 flex items-center gap-2">
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-purple-500 h-2 rounded-full"
//                       style={{ width: `${project.progress}%` }}
//                     />
//                   </div>
//                   <span className="text-sm text-gray-600">{project.progress}%</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8">
//             <h3 className="text-sm font-medium text-gray-500 mb-4">Team Members</h3>
//             <div className="flex items-center gap-2">
//               {[...Array(3)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"
//                 />
//               ))}
//               <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-sm">
//                 +{project.members}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-lg hover:bg-gray-100"
//           >
//             Close
//           </button>
//           <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
//             Edit Project
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Task = () => {
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [tasks, setTasks] = useState([
//     {
//       taskName: 'Website Development',
//       subname: 'Frontend Design',
//       status: 'Pending',
//       deadline: '2025-03-10',
//       assignedTo: 'Shubham',
//       priority: 'High',
//       icon: '💻',
//       hours: 40,
//       members: 4,
//       progress: 25
//     },
//     {
//       taskName: 'Mobile App',
//       subname: 'UI Design',
//       status: 'In Progress',
//       deadline: '2025-03-12',
//       assignedTo: 'Akash',
//       priority: 'Medium',
//       icon: '📱',
//       hours: 35,
//       members: 3,
//       progress: 45
//     },
//     {
//       taskName: 'API Integration',
//       subname: 'Backend Development',
//       status: 'Completed',
//       deadline: '2025-02-28',
//       assignedTo: 'Deepanshu',
//       priority: 'Low',
//       icon: '🔗',
//       hours: 50,
//       members: 4,
//       progress: 100
//     },
//     {
//       taskName: 'Database Setup',
//       subname: 'MongoDB',
//       status: 'Pending',
//       deadline: '2025-03-15',
//       assignedTo: 'Ravi',
//       priority: 'High',
//       icon: '🗄️',
//       hours: 25,
//       members: 2,
//       progress: 15
//     }
//   ]);

//   const getPriorityColor = (priority) => {
//     switch (priority.toLowerCase()) {
//       case 'high':
//         return 'bg-red-500';
//       case 'medium':
//         return 'bg-orange-500';
//       case 'low':
//         return 'bg-blue-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return 'text-green-600';
//       case 'In Progress':
//         return 'text-orange-600';
//       default:
//         return 'text-red-600';
//     }
//   };

//   const handleStatusChange = (index, newStatus) => {
//     const updatedTasks = [...tasks];
//     updatedTasks[index].status = newStatus;
//     setTasks(updatedTasks);
//   };

//   const handleRowClick = (task) => {
//     setSelectedProject(task);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold mb-6 text-center">Active Projects</h2>
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50 text-left text-gray-600">
//                   <th className="p-4">Project Name</th>
//                   <th className="p-4">Hours</th>
//                   <th className="p-4">Status</th>
//                   <th className="p-4">Priority</th>
//                   <th className="p-4">Team</th>
//                   <th className="p-4">Progress</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task, index) => (
//                   <tr
//                     key={index}
//                     className="border-t hover:bg-gray-50 cursor-pointer"
//                     onClick={() => handleRowClick(task)}
//                   >
//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
//                           {task.icon}
//                         </span>
//                         <div>
//                           <div className="font-medium">{task.taskName}</div>
//                           <div className="text-sm text-gray-500">{task.subname}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4 text-gray-600">{task.hours}h</td>
//                     <td className="p-4">
//                       <select
//                         value={task.status}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           handleStatusChange(index, e.target.value);
//                         }}
//                         className={`border rounded p-1 ${getStatusColor(task.status)}`}
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="In Progress">In Progress</option>
//                         <option value="Completed">Completed</option>
//                       </select>
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-white text-sm ${getPriorityColor(task.priority)}`}>
//                         {task.priority}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center">
//                         <div className="flex -space-x-2">
//                           {[...Array(3)].map((_, i) => (
//                             <div
//                               key={i}
//                               className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
//                             />
//                           ))}
//                           <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-sm">
//                             +{task.members}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-600">{task.progress}%</span>
//                         <div className="w-24 bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-purple-500 h-2 rounded-full"
//                             style={{ width: `${task.progress}%` }}
//                           />
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="p-4 border-t text-center">
//             <button className="text-purple-500 hover:text-purple-600 font-medium">
//               View All Projects
//             </button>
//           </div>
//         </div>
//       </div>

//       {selectedProject && (
//         <ProjectDetails
//           project={selectedProject}
//           onClose={() => setSelectedProject(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Task;
