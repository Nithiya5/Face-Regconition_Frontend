import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Grid, MenuItem } from "@mui/material";
import LoginImage from "../src/image/image.png"; // Ensure you have a login image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(""); // state to manage the random quote
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }

    // Change the quote after login attempt
    setQuote(randomQuote());
  };

  // Inspirational Quotes
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "It always seems impossible until it’s done. - Nelson Mandela",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you’re halfway there. - Theodore Roosevelt",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
  ];

  const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

  // Initialize with a random quote
  if (!quote) {
    setQuote(randomQuote());
  }

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
          flexDirection: { xs: "column", md: "row" },
          padding: 7,
          boxSizing: "border-box",
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
              backgroundColor: "#1f2937",
            }}
          >
            <Typography variant="h6" color="#facc15" fontWeight="bold" mb={2}>
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
                  style: { background: "#374151", color: "#f3f4f6", borderRadius: 6 },
                }}
                InputLabelProps={{ style: { color: "#9ca3af" } }}
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
                  backgroundColor: "#facc15",
                  color: "#000",
                  fontWeight: "bold",
                  ":hover": { backgroundColor: "#fbbf24" },
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
              backgroundColor: "#111827",
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
