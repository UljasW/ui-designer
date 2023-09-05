import React from "react";
import DesignerTool from "./pages/designerTool/DesignerTool";
import Login from "./pages/authentication/login/login"; // Capitalize 'Login'
import Home from "./pages/home/home"
import Register from "./pages/authentication/register/register";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"; // Use 'BrowserRouter as Router' if using 'react-router-dom'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/designer" element={<DesignerTool />} /> 
      </Routes>
    </Router>
  );
}
