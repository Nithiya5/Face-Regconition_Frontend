import React from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";

const Header = () => {
  return (
    <header className="App-header">
      <div className="logo">FaceRecognition</div>
      <div className="nav-container">
        <nav>
          {/* Use <Link> for navigation instead of <a href="#"> */}
          <Link to="/">Home</Link>  
          <Link to="/login">Login</Link>
          <a href="#">Register</a>
          <a href="#">About Us</a>
          <a href="#">IT Support</a>
        </nav>
      </div>
    </header>
  );
};


const Home = () => (
  <main className="relative flex flex-col items-center justify-center flex-grow px-6 py-16 text-white text-center">
    <h2 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">
      The #1 Site for Face Recognition
    </h2>
    <p className="text-gray-300 mt-4 max-w-xl drop-shadow-md text-lg">
      Our AI-powered system provides **secure, efficient, and accurate** facial recognition solutions.
    </p>
    
    <button className="mt-6 bg-yellow-400 text-black py-3 px-6 rounded-lg font-bold shadow-lg hover:bg-yellow-500 transition transform hover:scale-105">
      Get Started
    </button>

    {/* Stats Section */}
    <div className="mt-12 flex space-x-10 text-center">
      <div>
        <h3 className="text-3xl font-bold text-yellow-400">45k+</h3>
        <p className="text-gray-300">Users</p>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-yellow-400">50+</h3>
        <p className="text-gray-300">Industries</p>
      </div>
    </div>
  </main>
);

const App = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-cover bg-center" 
         style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?technology,ai')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
