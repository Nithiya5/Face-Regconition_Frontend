import React, { useState } from "react";
import { 
  TextField, Button, Container, Typography, Grid, FormControlLabel, Checkbox, 
  Card, CardContent, Box, Avatar, InputAdornment, Snackbar, Alert, CircularProgress 
} from "@mui/material";

import { Person, Work, Email, Phone, Lock, AccountBox, AddCircle, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    name: "",
    department: "",
    designation: "",
    email: "",
    phone: "",
    password: "",
    canAddVisitor: false,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", type: "success" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({ ...employeeData, [name]: type === "checkbox" ? checked : value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (
      !file ||
      file.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png"].includes(file.type)
    ) {
      setNotification({ open: true, message: "Invalid file. Ensure it is JPEG/PNG and under 5MB.", type: "error" });
      return;
    }
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!employeeData.name || !employeeData.email || !employeeData.password) {
      setNotification({ open: true, message: "Name, Email, and Password are required!", type: "error" });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(employeeData).forEach(([key, value]) => formData.append(key, value));
    if (profileImage) formData.append("image", profileImage);

    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        setNotification({ open: true, message: "Unauthorized! Please log in again.", type: "error" });
        setIsSubmitting(false);
        return;
      }

      await axios.post(
        "https://face-regconition-backend.onrender.com/api/admin/registerEmployee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setNotification({ open: true, message: "Employee registered successfully!", type: "success" });
      setEmployeeData({
        employeeId: "",
        name: "",
        department: "",
        designation: "",
        email: "",
        phone: "",
        password: "",
        canAddVisitor: false,
      });
      setProfileImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error:", error);
      setNotification({ open: true, message: "Registration failed. Please try again.", type: "error" });
    }

    setIsSubmitting(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: #fff;
          }
        `}
      </style>

      <Container 
        maxWidth="xl"
        sx={{
          marginTop: 4,
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          minHeight: "100vh",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" sx={{ mb: 0, color: "#007bff", fontWeight: "bold", textAlign: "center" }}>
          Employee Registration
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: "black", textAlign: "center" }}>
          "Welcome to the team! Please provide the necessary details to register the new employee."
        </Typography>

        <Grid container spacing={3} sx={{ padding: 3 }}>
          <Grid item xs={12} md={8} sx={{ paddingRight: 3 }}>
            <Card elevation={6} sx={{ borderRadius: 3, backgroundColor: "#fff", padding: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ marginBottom: 2, color: '#007bff' }}>
                  Employee Details
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      name="employeeId"
                      value={employeeData.employeeId}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountBox />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={employeeData.name}
                      onChange={handleChange}
                      required
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={employeeData.department}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      name="designation"
                      value={employeeData.designation}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={employeeData.email}
                      onChange={handleChange}
                      required
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={employeeData.phone}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      value={employeeData.password}
                      onChange={handleChange}
                      type="password"
                      required
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={employeeData.canAddVisitor}
                      onChange={handleChange}
                      name="canAddVisitor"
                    />
                  }
                  label="Can Add Visitors"
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    sx={{ py: 1, flex: 1 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : "Register Employee"}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    onClick={handleBack} 
                    sx={{ py: 1 }}
                  >
                    <ArrowBack sx={{ mr: 1 }} />
                    Back
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid 
            item 
            xs={12} 
            md={4} 
            sx={{ 
              textAlign: "center", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center", 
              alignItems: "center" 
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: "20px", 
                textAlign: "center", 
                marginBottom: 2, 
                color: "#555", 
                fontStyle: "italic" 
              }}
            >
              "Profiles define your digital presence & first impression."
            </Typography>
            <Avatar 
              src={imagePreview || ""} 
              sx={{ width: 220, height: 220, backgroundColor: "#ccc", marginBottom: 2 }}
            />
            <Button 
              variant="contained" 
              component="label" 
              startIcon={<AddCircle />}
              sx={{ textTransform: "none" }}
            >
              Upload Profile Image
              <input type="file" hidden accept="image/jpeg, image/png" onChange={handleProfileImageChange} />
            </Button>
          </Grid>
        </Grid>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={4000} 
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={notification.type} onClose={() => setNotification({ ...notification, open: false })}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default RegisterEmployee;