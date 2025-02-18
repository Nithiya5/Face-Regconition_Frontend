import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from "@mui/material";
import { SupportAgent } from "@mui/icons-material"; // Importing the icon

export default function Help() {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");  // New field for category
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query || !email || !priority || !category) {
      setResponse("Please fill in all the fields.");
      return;
    }

    setLoading(true); // Show loading spinner while submitting
    setResponse(""); // Reset previous response

    // Simulating an API request (you can replace this with actual API calls)
    setTimeout(() => {
      setLoading(false); // Hide loading spinner
      setResponse("Thank you! Our support team will contact you shortly.");
    }, 2000); // Simulate 2 seconds delay
  };

  // Some nice quotes to display
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "It always seems impossible until it’s done. - Nelson Mandela",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you’re halfway there. - Theodore Roosevelt",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6", position: "fixed", top: 0, left: 0, right: 0 }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
          height: "100vh", // Full height of the viewport
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: 7, // Reduced padding to decrease the gap
          boxSizing: "border-box",
        }}
      >
        {/* Left Side - Help Form */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centering the form fields horizontally
            justifyContent: "center", // Centering the form fields vertically
            flex: 1.2,
            padding: 2, // Reduced padding to decrease the gap
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {/* IT Support Center Title with Icon */}
            <SupportAgent sx={{ color: "#1e40af", fontSize: 30, mr: 1 }} />
            <Typography variant="h5" color="#1e40af" fontWeight="bold">
              IT Support Center
            </Typography>
          </Box>
          <Typography variant="body1" color="textSecondary" align="center" paragraph sx={{ mb: 2 }}>
            Need assistance? Share your issue, and our support team will assist you.
          </Typography>

          <TextField
            label="Describe your issue"
            multiline
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: '#e0e7ff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '&:hover fieldset': { borderColor: '#1e40af' },
            }}
          />

          <TextField
            label="Your Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: '#e0e7ff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '&:hover fieldset': { borderColor: '#1e40af' },
            }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="priority-label">Issue Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Issue Priority"
              variant="outlined"
              sx={{
                borderRadius: 2,
                backgroundColor: '#e0e7ff',
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                '&:hover fieldset': { borderColor: '#1e40af' },
              }}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Issue Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: '#e0e7ff',
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '&:hover fieldset': { borderColor: '#1e40af' },
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
            startIcon={<SupportAgent />}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Issue"}
          </Button>

          {response && <Alert severity="info" sx={{ mt: 2 }}>{response}</Alert>}

          {/* Display a Random Quote */}
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4, fontStyle: "italic", fontSize: "16px" }}>
            "{randomQuote}"
          </Typography>
        </Box>

        {/* Right Side - Help Image */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center", // Centering the image vertically
            justifyContent: "center", // Centering the image horizontally
            padding: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            component="img"
            src="https://cdni.iconscout.com/illustration/premium/thumb/technical-support-illustration-download-in-svg-png-gif-file-formats--call-logo-tech-customer-provide-pack-business-illustrations-2621574.png"
            alt="Help Illustration"
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
