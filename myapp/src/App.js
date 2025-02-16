import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const styles = {
  body: {
    fontFamily: "Poppins, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#000",
    color: "white",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "fixed",
  },
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
  },
  header: {
    width: "100%",
  
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: "0px 4px 8px rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(0px)",
  },
  logo: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#facc15",
    textShadow: "2px 2px 10px rgba(255, 255, 0, 0.6)",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    color: "#facc15",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.3s ease-in-out",
  },
  main: {
   
    width: "108vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundImage:
      "url('https://eocortex.com/uploads/media/articleImage/04/3814-face.jpg?v=1-0')",
    backgroundSize: "cover",
    backgroundPosition: "left-center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  content: {
    position: "relative",
    zIndex: 10,
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#facc15",
    textShadow: "3px 3px 6px rgba(0, 0, 0, 0.7)",
  },
  paragraph: {
    color: "#d1d5db",
    marginTop: "10px",
    maxWidth: "600px",
    fontSize: "1.1rem",
  },
  button: {
    marginTop: "20px",
    backgroundColor: "#facc15",
    color: "black",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(255, 255, 0, 0.6)",
    transition: "all 0.3s ease-in-out",
    border: "none",
  },
  buttonHover: {
    backgroundColor: "#fbbf24",
    transform: "scale(1.05)",
  },
};

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>Presence Pro</div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>
          Home
        </Link>
        <Link to="/login" style={styles.navLink}>
          Login
        </Link>
        <a href="/register" style={styles.navLink}>
          Register
        </a>
        <a href="#" style={styles.navLink}>
          About Us
        </a>
        <a href="#" style={styles.navLink}>
          Help
        </a>
      </nav>
    </header>
  );
};

const Home = () => (
  <div style={styles.container}>
    <div style={styles.main}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <h2 style={styles.title}>Next-Gen AI-Powered Face Recognition</h2>
        <p style={styles.paragraph}>
          Providing <b>secure, fast, and accurate</b> recognition solutions for businesses and individuals worldwide.
        </p>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.background = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.background = styles.button.backgroundColor)}
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <div style={styles.body}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
