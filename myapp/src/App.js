import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-[#192432] py-4 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-yellow-400 text-2xl font-bold">
        Face<span className="text-white">Recognition</span>
      </h1>
      <nav className="flex space-x-6 text-white">
        <a href="#" className="hover:text-yellow-400 transition">Home</a>
        <a href="#" className="hover:text-yellow-400 transition">Login</a>
        <a href="#" className="hover:text-yellow-400 transition">Register</a>
        <a href="#" className="hover:text-yellow-400 transition">About Us</a>
        <a href="#" className="hover:text-yellow-400 transition">IT Support</a>
      </nav>
    </header>
  );
};

const App = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?technology,ai')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <Header />
      <main className="relative flex flex-col items-center justify-center flex-grow px-6 py-12 text-white text-center">
        <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-lg">Welcome to Face Recognition Attendance</h2>
        <p className="text-gray-300 mt-4 max-w-xl drop-shadow-md">
          Seamless, secure, and efficient employee attendance tracking using AI-powered facial recognition.
        </p>
        <button className="mt-6 bg-yellow-400 text-black py-3 px-6 rounded-lg font-bold shadow-md hover:bg-yellow-500 transition transform hover:scale-105">
          Get Started
        </button>
      </main>
    </div>
  );
};

export default App;
