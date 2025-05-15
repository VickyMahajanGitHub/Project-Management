// import React from "react";
// import { FileText, PlusCircle, Filter, Edit, Trash2 } from "lucide-react";
// import { NavLink } from "react-router-dom";

// const TaskTable = ({ tasks, handleAdd, getStatusIcon, getStatusColor }) => {
//   return (
//     <div>
//       {/* Task Actions */}
//       <div className="flex flex-col md:flex-row gap-4">
//         <button className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-gray-800 font-medium p-2 rounded-xl flex-grow text-center transition duration-300 flex items-center justify-center shadow-sm border border-blue-100 hover:shadow-md">
//           <FileText className="w-5 h-5 mr-3 text-blue-700" /> VIEW ALL TASKS
//         </button>
//         <button
//           onClick={handleAdd}
//           className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-medium p-2 rounded-xl transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
//         >
//           <PlusCircle className="w-5 h-5 mr-3" /> ADD NEW TASK
//         </button>
//         <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-gray-700 hover:to-indigo-700 text-white text-xs font-medium p-2 rounded-xl transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg">
//           <Filter className="w-5 h-5 mr-3" /> Filter
//         </button>
//       </div>

//       {/* Task Detail Section */}
//       <div className="w-full mt-6">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Task Management</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left bg-blue-500 border-b border-gray-100">
//                   <th className="py-3 px-4 font-medium text-white text-sm">
//                     Task Name
//                   </th>
//                   <th className="py-3 px-4 font-medium text-white text-sm">
//                     Hours
//                   </th>
//                   <th className="py-3 px-4 font-medium text-white text-sm">
//                     Priority
//                   </th>
//                   <th className="py-3 px-4 font-medium text-white text-sm">
//                     Assigned To
//                   </th>
//                   <th className="py-3 px-4 font-medium text-white text-sm">
//                     Status
//                   </th>
//                   <th className="py-3 px-4 font-medium text-white text-sm">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks?.map((task) => (
//                   <tr
//                     key={task.sr}
//                     className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 shadow-md"
//                   >
//                     <td className="py-4 px-4 flex items-center">
//                       <div className="bg-indigo-200 p-2 rounded-lg mr-3">
//                         {getStatusIcon(task.status)}
//                       </div>
//                       <div>
//                         <NavLink
//                           to="/taskdetailpage"
//                           className="font-medium text-gray-800"
//                         >
//                           {task.name}
//                         </NavLink>
//                         <div className="text-xs text-gray-500">
//                           {task.category1}, {task.category2}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-4 text-gray-700">24</td>
//                     <td className="py-4 px-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           task.status === "New"
//                             ? "bg-blue-900 text-blue-800"
//                             : task.status === "IN PROGRESS"
//                             ? "bg-yellow-500 text-yellow-800"
//                             : "bg-green-500 text-green-800"
//                         }`}
//                       >
//                         {task.status === "New"
//                           ? "Medium"
//                           : task.status === "IN PROGRESS"
//                           ? "High"
//                           : "Low"}
//                       </span>
//                     </td>
//                     <td className="py-4 px-4 text-gray-800 font-medium">
//                       {task.assignedTo}
//                     </td>
//                     <td className="py-4 px-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                           task.status
//                         )}`}
//                       >
//                         {task.status}
//                       </span>
//                     </td>
//                     <td className="py-4 px-4 flex space-x-3">
//                       <button className="p-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
//                         <Edit className="w-4 h-4 text-blue-600" />
//                       </button>
//                       <button className="p-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
//                         <Trash2 className="w-4 h-4 text-red-600" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskTable;
