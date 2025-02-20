import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import * as faceapi from "face-api.js"; // Import face-api.js

const AdminDashboard = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState({
    employeeId: "",
    department: "",
    designation: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [faceEmbeddings, setFaceEmbeddings] = useState([]);
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

  // Webcam reference
  const webcamRef = useRef(null);

  // Model load state
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };
    loadModels();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  // Capture Image Function
  const captureImage = async () => {
    if (capturedImages.length >= 5) {
      alert("You can only capture up to 5 images.");
      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      alert("No image captured.");
      return;
    }

    setCapturedImages((prevImages) => [...prevImages, imageSrc]);

    try {
      if (!isModelLoaded) {
        alert("Please wait for models to load.");
        return;
      }

      const blob = await (await fetch(imageSrc)).blob();
      const img = await faceapi.bufferToImage(blob);
      const detections = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        setFaceEmbeddings((prevEmbeddings) => [
          ...prevEmbeddings,
          detections.descriptor,
        ]);
      } else {
        alert("No face detected in the image.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing the image.");
    }
  };

  // Handle Form Submission
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
      for (let i = 0; i < capturedImages.length; i++) {
        const response = await fetch(capturedImages[i]);
        const blob = await response.blob();
        formData.append("images", blob, 'image${i + 1}.jpg');
      }

      formData.append("faceEmbeddings", JSON.stringify(faceEmbeddings));

      await axios.post(
        "https://face-regconition-backend.onrender.com/api/admin/registerEmployee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: 'Bearer ${token}',
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

  // Handle Employee Search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://face-regconition-backend.onrender.com/api/admin/employees", {
        params: searchQuery,
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  // Render Employee Table
  const renderEmployeeTable = () => {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.employeeId}>
              <TableCell>{employee.employeeId}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box mb={2} display="flex" justifyContent="flex-end">
        <Link to="/register-employee">
          <Button variant="contained" color="primary">Add Employee</Button>
        </Link>
      </Box>

      <Card elevation={3} style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6">Search Employees</Typography>
          <Grid container spacing={3} style={{ marginTop: "20px" }}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Employee ID" name="employeeId" onChange={handleSearchChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Department" name="department" onChange={handleSearchChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Designation" name="designation" onChange={handleSearchChange} />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSearch}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>{renderEmployeeTable()}</CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;