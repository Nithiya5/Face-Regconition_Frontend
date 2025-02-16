import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Registration failed!");

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#111827",
    },
    box: {
      background: "rgba(255, 255, 255, 0.1)",
      padding: "20px",
      borderRadius: "10px",
      width: "320px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#facc15",
      marginBottom: "15px",
    },
    inputGroup: {
      marginBottom: "12px",
      textAlign: "left",
    },
    label: {
      fontSize: "14px",
      color: "#e5e7eb",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      background: "#e5e7eb",
      color: "#000",
      fontSize: "14px",
      marginTop: "5px",
      boxSizing: "border-box",
    },
    errorMessage: {
      color: "#f87171",
      fontSize: "12px",
      marginBottom: "10px",
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      background: "#facc15",
      color: "#000",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.3s",
    },
    buttonHover: {
      background: "#fbbf24",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Register</h2>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = styles.buttonHover.background)}
            onMouseOut={(e) => (e.target.style.background = styles.button.background)}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
