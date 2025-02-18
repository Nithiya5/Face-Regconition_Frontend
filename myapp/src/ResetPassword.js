import React, { useState } from "react";
import { Box, Paper, Grid, Typography, TextField, Button, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios"; // To make API calls

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = new URLSearchParams(window.location.search).get("token"); // Get token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setError(""); // Clear any previous errors

      // Prepare data to send to the backend
      const data = {
        token: token,
        password: password,
        confirmPassword: confirmPassword,
      };

      // Make API request to reset password
      const response = await axios.post("https://your-backend-url/api/employee/resetPassword", data);

      // Handle success response
      setSuccessMessage(response.data.message);
      setPassword(""); // Clear form inputs
      setConfirmPassword("");
    } catch (err) {
      // Handle error response
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again later.");
      }
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
          backgroundColor: "#ffffff", // White background for container
          display: "flex",
        }}
      >
        <Grid container spacing={0}>
          {/* Left Side - Reset Password Form */}
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
              Reset Password
            </Typography>

            <form style={{ width: "90%" }} onSubmit={handleSubmit}>
              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="dense"
                InputProps={{
                  style: { background: "#e0e7ff", color: "#1e40af", borderRadius: 6 },
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#1e40af" },
                }}
              />

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="dense"
                InputProps={{
                  style: { background: "#e0e7ff", color: "#1e40af", borderRadius: 6 },
                  endAdornment: (
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "#1e40af" },
                }}
              />

              {/* Error Message */}
              {error && <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>{error}</Typography>}

              {/* Success Message */}
              {successMessage && <Typography color="success" variant="body2" sx={{ marginTop: 2 }}>{successMessage}</Typography>}

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#1e40af",
                  color: "#fff",
                  fontWeight: "bold",
                  ":hover": { backgroundColor: "#3b82f6" },
                }}
                type="submit"
              >
                Reset Password
              </Button>
            </form>
          </Grid>

          {/* Right Side - Image Illustration (optional) */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <Box
              component="img"
              src="https://www.shutterstock.com/image-vector/men-forgot-password-flat-illustration-260nw-1765279121.jpg"
              alt="Reset Password Illustration"
              sx={{
                width: "80%",
                height: "auto",
                borderRadius: 2,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
