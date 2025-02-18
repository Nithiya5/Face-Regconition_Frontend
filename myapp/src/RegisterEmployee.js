import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Container, Typography, Grid, FormControlLabel, Checkbox, Card, CardContent, Box } from "@mui/material";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({ ...employeeData, [name]: type === "checkbox" ? checked : value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(file.type)) {
      alert("Invalid file. Ensure it is JPEG/PNG and under 5MB.");
      return;
    }
    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Append the employee data to formData
    Object.entries(employeeData).forEach(([key, value]) => formData.append(key, value));

    // Add profile image if it exists
    if (profileImage) formData.append("image", profileImage);

    // Log the form data before submitting for debugging
    console.log("Form data being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      // Retrieve the auth token from local storage
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Unauthorized! Please log in again.");
        return;
      }

      console.log("Auth Token being sent:", authToken);  // Debugging to ensure the token is sent

      // Send the request to the backend
      const response = await axios.post("https://face-regconition-backend.onrender.com/api/admin/registerEmployee", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Proper content type for form data
          Authorization: `Bearer ${authToken}`,  // Correct token usage
        },
      });

      alert("Employee registered successfully!");  // Success message
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed.");  // Failure message if there's an error
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard - Add Employee
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Employee Details</Typography>
              {Object.keys(employeeData).map((key) =>
                key !== "canAddVisitor" ? (
                  <TextField key={key} fullWidth label={key} name={key} value={employeeData[key]} onChange={handleChange} margin="normal" />
                ) : (
                  <FormControlLabel key={key} control={<Checkbox checked={employeeData.canAddVisitor} onChange={handleChange} name={key} />} label="Can Add Visitor" />
                )
              )}
              <Typography variant="h6">Upload Profile Image</Typography>
              <input type="file" accept="image/jpeg, image/png" onChange={handleProfileImageChange} />
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>Submit</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterEmployee;
