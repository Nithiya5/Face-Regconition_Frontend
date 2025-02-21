import React from "react";
import { Routes, Route, Link,useLocation } from "react-router-dom";
import { FaRegPlayCircle, FaInfoCircle } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import RegisterEmployee from "./RegisterEmployee";
import EmployeeDashboard from "./EmployeeDashboard";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Help from "./Help";
import Aboutus from "./Aboutus";
import Attendance from "./Attendance";
import Emplogs from "./Emplogs";

import Logs from "./Logs";
import EmployeeRecord from "./EmployeeRecord";
import Admindetails from "./Admindetails";

import {ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "./App.css";

import "./App.css"; 


const Header = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/employee-dashboard", "/attendance", "/emp-logs","admin-logs","/emp","/details","/register-employee"];

  if (hideHeaderRoutes.includes(location.pathname)) {
    return null; 
  }
  return (
    <header className="header">
      <div className="logo">Presence Pro</div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <Link to="/help" className="nav-link">Help</Link>
      </nav>
    </header>
  );
};

const Home = () => (
  <div className="container">
    <div className="main">
      <div className="overlay"></div>
      <div className="content">
        <h2 className="title">Next-Gen AI-Powered Face Recognition</h2>
        <p className="paragraph">
          Providing <b>secure, fast, and accurate</b> recognition solutions for businesses and individuals worldwide.
        </p>
        <div className="button-container">
          <Link to="/register">
            <button className="button">
              <FaRegPlayCircle size={20} />
              Get Started
            </button>
          </Link>
          <Link to="/aboutus">
            <button className="button">
              <FaInfoCircle size={20} />
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <div className="body">
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/register-employee" element={<RegisterEmployee />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path ="/forgot"element={<ForgotPassword/>}/>;
        <Route path = "/reset" element ={<ResetPassword/>}/>;
        <Route path = "/help" element ={<Help/>}/>;
        <Route path = "/about" element ={<Aboutus/>}/>;
        <Route path = "/attendance" element ={<Attendance/>}/>;
        <Route path ="/emp-logs" element ={<Emplogs/>}/>;
        <Route path="/details" element={<Admindetails />} />
        <Route path="/emp" element={<EmployeeRecord/>} />
        <Route path="/admin-logs" element={<Logs/>} />
      </Routes>
    </div>
  );
};

export default App;
