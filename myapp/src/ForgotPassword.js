import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email) {
      setError('Email is required');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setError(''); // Clear any previous errors
      // Send a POST request to the backend
      const response = await axios.post('https://face-regconition-backend.onrender.com/api/employee/forgotPassword', {
        email: email,
      });

      // Handle the response (Success message)
      setMessage(response.data.message); // Display success message
    } catch (err) {
      // Handle error
      if (err.response) {
        setError(err.response.data.error); // Display the error message from backend
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f9fc',
        padding: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          padding: 4,
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: 'black' }}>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiInputLabel-root': {
                color: '#555',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#6200ea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6200ea',
                },
              },
            }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          {message && (
            <Typography variant="body2" color="success" sx={{ marginBottom: 2 }}>
              {message}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: 2,
              padding: '10px 0',
              backgroundColor: '#6200ea',
              '&:hover': {
                backgroundColor: '#3700b3',
              },
            }}
          >
            Send Reset Link
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
