import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Grid } from "@mui/material";
import Registerimage from "../src/image/Register.png"; // Ensure correct import

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Registration failed!");

      alert("Registration successful! Please log in.");
      navigate("/login");
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
        backgroundColor: "#111827",
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          width: "60%",
          backgroundColor: "#1f2937",
          display: "flex",
        }}
      >
        <Grid container spacing={0}>
          {/* Left Side - Registration Form */}
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
              backgroundColor: "#1f2937",
            }}
          >
            <Typography variant="h6" color="#facc15" fontWeight="bold" mb={2}>
              Register
            </Typography>
            {error && (
              <Typography color="error" fontSize="14px" mb={1}>
                {error}
              </Typography>
            )}
            <form onSubmit={handleRegister} style={{ width: "90%" }}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                margin="dense"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                InputProps={{
                  style: { background: "#374151", color: "#f3f4f6", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#9ca3af" } }}
              />
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="dense"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  style: { background: "#374151", color: "#f3f4f6", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#9ca3af" } }}
              />
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
                  style: { background: "#374151", color: "#f3f4f6", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#9ca3af" } }}
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
                  style: { background: "#374151", color: "#f3f4f6", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#9ca3af" } }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#facc15",
                  color: "#000",
                  fontWeight: "bold",
                  ":hover": { backgroundColor: "#fbbf24" },
                }}
              >
                Register
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
              backgroundColor: "#111827",
            }}
          >
            <Box
              component="img"
              src={Registerimage} // Ensure correct import and usage
              alt="Register Illustration"
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

export default Register;
