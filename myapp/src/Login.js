import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Grid, MenuItem } from "@mui/material";
import LoginImage from "../src/image/image.png"; // Ensure you have a login image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Correct the URL with template literals
    let apiUrl = `https://face-regconition-backend.onrender.com/api/${role}/login`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Login failed!");

      localStorage.setItem("token", data.token);

      alert("Login successful!");

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "employee") {
        navigate("/employee-dashboard");
      } else if (role === "visitor") {
        navigate("/visitor-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white", // Light gray background
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          width: "60%",
          backgroundColor: "#ffffff", // White background for container
          display: "flex",
        }}
      >
        <Grid container spacing={0}>
          {/* Left Side - Login Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 3,
              backgroundColor: "#ffffff", // White background for the form
            }}
          >
            <Typography variant="h6" color="#1e40af" fontWeight="bold" mb={2}>
              Login
            </Typography>
            {error && (
              <Typography color="error" fontSize="14px" mb={1}>
                {error}
              </Typography>
            )}
            <form onSubmit={handleLogin} style={{ width: "90%" }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="dense"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  style: { background: "#e0e7ff", color: "#1e40af", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#1e40af" } }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="dense"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  style: { background: "#e0e7ff", color: "#1e40af", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#1e40af" } }}
              />
              <TextField
                fullWidth
                select
                label="Role"
                variant="outlined"
                margin="dense"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                InputProps={{
                  style: { background: "#e0e7ff", color: "#1e40af", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#1e40af" } }}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="visitor">Visitor</MenuItem>
              </TextField>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#1e40af", // Blue
                  color: "#fff", // White text
                  fontWeight: "bold",
                  ":hover": { backgroundColor: "#3b82f6" }, // Lighter blue
                }}
              >
                Login
              </Button>
            </form>
          </Grid>

          {/* Right Side - Image Illustration */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              backgroundColor: "#ffffff", // White background for the image section
            }}
          >
            <Box
              component="img"
              src={LoginImage} // Ensure you have a login image
              alt="Login Illustration"
              sx={{
                width: "90%", // Adjusted width for better fit
                height: "auto",
                borderRadius: 2,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;
