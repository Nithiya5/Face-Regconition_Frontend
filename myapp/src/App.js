import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import aboutImage from "../src/image/About.png";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import "./App.css"; 

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Presence Pro</div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <a href="#" className="nav-link">Help</a>
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
      </div>
    </div>
  </div>
);

const About = () => (
  <main className="about-container">
    <div><img src={aboutImage} alt="About Us" className="about-image" /></div>
    <div className="content">
      <h2 className="about-title">About Us</h2>
      <p className="about-description">
        FaceRecognition is an advanced AI-powered platform designed to provide <strong>secure, fast, and reliable</strong> facial recognition solutions. 
        Our technology helps businesses, security agencies, and individuals enhance safety, efficiency, and user experience.
      </p>
    </div>
    
    <div className="about-section">
      <h3 className="about-subtitle">Our Mission</h3>
      <p className="about-text">
        We aim to revolutionize security and identity verification through <strong>cutting-edge AI and deep learning</strong>.
      </p>
      
      <h3 className="about-subtitle">Why Choose Us?</h3>
      <ul className="about-list">
        <li>AI-driven accuracy</li>
        <li>Secure & privacy-focused</li>
        <li>Easy integration & fast processing</li>
      </ul>
    </div>
  </main>
);

const App = () => {
  return (
    <div className="body">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

export default App;