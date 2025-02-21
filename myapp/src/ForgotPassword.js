import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
import { LockOutlined, Email, ArrowBack } from "@mui/icons-material"; 
import { useNavigate } from "react-router-dom"; 
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async () => {
    if (!email) {
      setResponse("Please enter your email address.");
      return;
    }

    setLoading(true);
    setResponse(""); 

    setTimeout(() => {
      setLoading(false); 
      setResponse("A reset link has been sent to your email.");
    }, 2000); 
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6", position: "fixed", top: 0, left: 0, right: 0 }}>
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LockOutlined sx={{ color: "#1e40af", fontSize: 30, mr: 1 }} />
            <Typography variant="h5" color="#1e40af" fontWeight="bold">
              Forgot Password
            </Typography>
          </Box>

          <Typography variant="body1" color="textSecondary" align="center" paragraph sx={{ mb: 2 }}>
            Enter your email address, and we'll send you a link to reset your password.
          </Typography>

          <TextField
            label="Your Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: "#e0e7ff",
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
              "&:hover fieldset": { borderColor: "#1e40af" },
            }}
            InputProps={{
              startAdornment: (
                <Email sx={{ color: "#1e40af", marginLeft: 1 }} />
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              fontSize: 15,
              mt: 2,
              borderRadius: 3,
              ":hover": { backgroundColor: "#3b82f6" },
            }}
            startIcon={<LockOutlined />}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
          </Button>

          {response && <Alert severity="info" sx={{ mt: 2 }}>{response}</Alert>}

          <Box sx={{ mt: 4, textAlign: "center", padding: 1, color: "#5c6b8c", fontStyle: "italic" }}>
            <Typography variant="body2">
              "Don't forget to update your password regularly to keep your account secure."
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              "Passwords should be unique and complex to avoid security breaches."
            </Typography>
          </Box>

          <Button
            variant="text"
            color="blue"
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ mt: 3 }}
          >
            Back
          </Button>
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
          <Box
            component="img"
            src="https://img.freepik.com/premium-vector/forgot-password-illustration_65141-418.jpg"
            alt="Forgot Password Illustration"
            sx={{
              width: "120%",
              maxWidth: "1000px",
              height: "auto",
              borderRadius: 1,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}