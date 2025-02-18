import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ForgotPasswordIcon from "@mui/icons-material/HelpOutline"; // Forgot password icon
import { Carousel } from "react-responsive-carousel"; // Import Carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import Carousel CSS

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
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: 7,
          boxSizing: "border-box",
        }}
      >
        {/* Left Side - Support Form */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1.2,
            padding: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h5" color="#1e40af" fontWeight="bold" mb={2} display="flex" alignItems="center">
            <LoginIcon sx={{ mr: 1 }} />
            Welcome Back
          </Typography>

          {/* Attendance Line */}
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2, fontStyle: "italic", fontSize: "14px" }}>
            "Your attendance is the first step to success. Let's get started!"
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
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
              sx={{ mb: 2, backgroundColor: "#e0e7ff" }}
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
              sx={{ mb: 2, backgroundColor: "#e0e7ff" }}
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
              sx={{ mb: 2, backgroundColor: "#e0e7ff" }}
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
              disabled={loading}
              startIcon={<LoginIcon />}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Support"}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
            <Link
              href="/forgot"
              sx={{
                color: "#1e40af",
                textDecoration: "none",
                fontSize: "19px",
                display: "flex",
                alignItems: "center",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <ForgotPasswordIcon sx={{ mr: 1 }} />
              Forgot Password?
            </Link>
          </Box>

          {/* Inspirational Quote */}
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4, fontStyle: "italic", fontSize: "16px" }}>
            "{quote}"
          </Typography>
        </Box>

        {/* Right Side - Image Slideshow */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={2000}>
          <div>
              <img
                src="https://static.vecteezy.com/system/resources/previews/006/405/794/non_2x/account-login-flat-illustration-vector.jpg"
                alt="Login Illustration 2"
                style={{ height: "100%", objectFit: "cover" }} // Added consistent height and objectFit for consistent scaling
              />
            </div>
            
          <div>
              <img
                src="https://img.freepik.com/premium-vector/modern-illustration-mobile-phone-login-concept-with-modern-interface_1263357-37001.jpg?semt=ais_hybrid"
                alt="Login Illustration 2"
                style={{ height: "100%", objectFit: "cover" }} // Added consistent height and objectFit for consistent scaling
              />
            </div>
            <div>
              <img
                src="https://img.freepik.com/free-vector/sign-concept-illustration_114360-5425.jpg"
                alt="Login Illustration 1"
                style={{ height: "100%", objectFit: "cover" }} // Added consistent height and objectFit for consistent scaling
              />
            </div>

           

           
          </Carousel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
