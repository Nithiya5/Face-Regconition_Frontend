import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, Typography, TextField, MenuItem, Button } from "@mui/material";
import LoginImage from "../src/image/Login.png"; // Adjust the path if needed



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    let apiUrl = `https://face-regconition-backend.onrender.com/api/${role}/login`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Login failed!");

      // ✅ Store token and userId correctly
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.userId); // Store userId if needed

      alert("Login successful!");

      // ✅ Redirect based on role
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "employee":
          navigate("/employee-dashboard");
          break;
        case "visitor":
          navigate("/visitor-dashboard");
          break;
        default:
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
        backgroundColor: "white",
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          width: "60%",
          backgroundColor: "#ffffff",
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
              backgroundColor: "#ffffff",
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
                  backgroundColor: "#1e40af",
                  color: "#fff",
                  fontWeight: "bold",
                  ":hover": { backgroundColor: "#3b82f6" },
                }}
              >
                Login
              </Button>
            </form>
          </Grid>

          {/* Right Side - Image */}
          <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 2, backgroundColor: "#ffffff" }}>
            <Box component="img" src={LoginImage} alt="Login Illustration" sx={{ width: "90%", height: "auto", borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Login;