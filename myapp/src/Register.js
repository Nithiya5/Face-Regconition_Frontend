import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd"; 
import { Carousel } from "react-responsive-carousel"; 
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(""); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://face-regconition-backend.onrender.com/api/admin/register", {
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
    } finally {
      setLoading(false);
    }
  };

  const quotes = [
    "The best way to predict your future is to create it. - Abraham Lincoln",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
    "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
    "Believe in yourself, push your limits, and do whatever it takes to conquer your goals.",
  ];

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

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
            <PersonAddIcon sx={{ mr: 1 }} />
            Register
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2, fontStyle: "italic", fontSize: "14px" }}>
            "Start your journey with us. Register to get started!"
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
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
              sx={{ mb: 2, backgroundColor: "#e0e7ff" }}
            />
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="dense"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2, backgroundColor: "#e0e7ff" }}
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
              startIcon={<PersonAddIcon />}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </form>

          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
            <Link
              href="/login"
              sx={{
                color: "#1e40af",
                textDecoration: "none",
                fontSize: "19px",
                display: "flex",
                alignItems: "center",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Already have an account? Login
            </Link>
          </Box>


          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4, fontStyle: "italic", fontSize: "16px" }}>
            "{quote}"
          </Typography>
        </Box>

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
                src="https://img.freepik.com/premium-vector/online-registration-illustration-design-concept-websites-landing-pages-other_108061-938.jpg"
                alt="Register Illustration 1"
                style={{ height: "90%", objectFit: "cover" }}
              />
            </div>
            <div>
              <img
                src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg"
                alt="Register Illustration 3"
                style={{ height: "90%", objectFit: "cover" }}
              />
            </div>
            <div>
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/online-registration-illustration-download-in-svg-png-gif-file-formats--user-register-form-sign-create-account-pack-network-communication-illustrations-6381807.png"
                alt="Register Illustration 2"
                style={{ height: "90%", objectFit: "cover" }}
              />
            </div>
          </Carousel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;