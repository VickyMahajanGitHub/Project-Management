import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "../context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <ThemeProvider> */}
    <App />
    <Toaster position="top-center" reverseOrder={false} closeOnClick={false} />
    {/* </ThemeProvider> */}
  </React.StrictMode>
);
