import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, TextField, Button, Card, CardContent, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState({
    employeeId: "",
    department: "",
    designation: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const captureImage = async () => {
    if (capturedImages.length >= 5) {
      alert("You can only capture up to 5 images.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prevImages) => [...prevImages, imageSrc]);

      try {
        // Wait until models are loaded before performing face detection
        if (!isModelLoaded) {
          alert("Please wait for the models to load before capturing images.");
          return;
        }

        // Convert the base64 image to a Blob using fetch
        const blob = await (await fetch(imageSrc)).blob();

        // Convert the Blob to an image using face-api.js
        const img = await faceapi.bufferToImage(blob);

        // Detect the face and get landmarks and embeddings
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        
        if (detections) {
          setFaceEmbeddings((prevEmbeddings) => [
            ...prevEmbeddings,
            detections.descriptor,
          ]);
        } else {
          alert("No face detected in the image.");
        }
      } catch (error) {
        console.error("Error processing the image:", error);
        alert("There was an error processing the image.");
      }
    } else {
      console.error("No image captured");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (capturedImages.length === 0) {
      alert("Please capture at least one image.");
      return;
    }

    if (faceEmbeddings.length === 0) {
      alert("Please capture face embeddings.");
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", employeeData.employeeId);
    formData.append("name", employeeData.name);
    formData.append("department", employeeData.department);
    formData.append("designation", employeeData.designation);
    formData.append("email", employeeData.email);
    formData.append("phone", employeeData.phone);
    formData.append("password", employeeData.password);
    formData.append("canAddVisitor", employeeData.canAddVisitor);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please log in.");
      return;
    }

    try {
      // Convert images into Blob format before appending
      for (let i = 0; i < capturedImages.length; i++) {
        const response = await fetch(capturedImages[i]);
        const blob = await response.blob();
        formData.append("images", blob, `image${i + 1}.jpg`);
      }

      // Add face embeddings as JSON string
      formData.append("faceEmbeddings", JSON.stringify(faceEmbeddings));

      await axios.post(
        "https://face-regconition-backend.onrender.com/api/admin/registerEmployee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Employee registered successfully!");
      setCapturedImages([]);
      setFaceEmbeddings([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.error || "Error uploading images");
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Add Employee Button */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Link to="/register-employee">
          <Button variant="contained" color="primary">
            Add Employee
          </Button>
        </Link>
      </Box>

      {/* Search Section */}
      <Card elevation={3} style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6">Search Employees</Typography>
          <Grid container spacing={3} style={{ marginTop: "20px" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Employee ID"
                variant="outlined"
                name="employeeId"
                value={searchQuery.employeeId}
                onChange={handleSearchChange}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Department"
                variant="outlined"
                name="department"
                value={searchQuery.department}
                onChange={handleSearchChange}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Designation"
                variant="outlined"
                name="designation"
                value={searchQuery.designation}
                onChange={handleSearchChange}
                color="primary"
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Employee Table Section */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" style={{ marginBottom: "20px" }}>
            Employee List
          </Typography>
          {renderEmployeeTable()}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
