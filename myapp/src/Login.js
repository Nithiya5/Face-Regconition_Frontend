import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, MenuItem, CircularProgress, Link,Alert } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login"; 
import LockIcon from "@mui/icons-material/Lock"; 
import { Carousel } from "react-responsive-carousel"; 
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const quotes = [
    "“The only way to do great work is to love what you do.” - Steve Jobs",
    "“Success is not final, failure is not fatal: It is the courage to continue that counts.” - Winston Churchill",
    "“Hardships often prepare ordinary people for an extraordinary destiny.” - C.S. Lewis",
    "“The future belongs to those who believe in the beauty of their dreams.” - Eleanor Roosevelt",
    "“Success usually comes to those who are too busy to be looking for it.” - Henry David Thoreau",
    "“Don’t watch the clock; do what it does. Keep going.” - Sam Levenson"
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

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
      toast.success("Login successful!"); 

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message); 
    } finally {
      setLoading(false);
    }
  };

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
            <LoginIcon sx={{ mr: 1 }} />
            Login
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2, fontStyle: "italic", fontSize: "14px" }}>
            "Welcome back! Login to continue your journey."
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

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
              <LockIcon sx={{ mr: 1 }} />
              Forgot Password?
            </Link>
          </Box>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 3, fontStyle: "italic", fontSize: "14px" }}>
            {randomQuote}
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
                src="https://static.vecteezy.com/system/resources/previews/006/405/794/non_2x/account-login-flat-illustration-vector.jpg"
                alt="Login Illustration 2"
                style={{ height: "90%", objectFit: "cover" }}
              />
            </div>
            <div>
              <img
                src="https://brokerage-free.in/images/login-amic.png"
                alt="Login Illustration 1"
                style={{ height: "90%", objectFit: "cover" }}
              />
            </div>
            <div>
              <img
                src="https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7962.jpg?semt=ais_hybrid"
                alt="Login Illustration 3"
                style={{ height: "90%", objectFit: "cover" }}
              />
            </div>
          </Carousel>
        </Box>
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default Login;