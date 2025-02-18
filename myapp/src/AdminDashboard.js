import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, FormControlLabel, Checkbox, Card, CardContent, Box } from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";
import * as faceapi from "face-api.js"; // Import face-api.js

const AdminDashboard = () => {
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

  const [capturedImages, setCapturedImages] = useState([]); // Array for multiple images
  const [faceEmbeddings, setFaceEmbeddings] = useState([]); // Store face embeddings
  const [isModelLoaded, setIsModelLoaded] = useState(false); // Track if the model is loaded
  const webcamRef = useRef(null);

  useEffect(() => {
    // Load the face-api.js models when the component mounts
    const loadModels = async () => {
      try {
        // Load the SSD MobileNetV1 model for face detection
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models"); // Assuming the model files are at '/models'
        console.log("SSD MobileNetV1 model loaded");

        // Load the Face Landmark 68 model for facial landmarks and embeddings
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        console.log("Face Landmark 68 model loaded");

        // Load the Face Recognition model for embeddings
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Face Recognition Net model loaded");

        setIsModelLoaded(true); // Set the flag to true once all models are loaded
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    
    loadModels();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const captureImage = async () => {
    if (faceEmbeddings.length >= 10) {
      alert("You can only capture up to 10 face embeddings.");
      return;
    }
  
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prevImages) => [...prevImages, imageSrc]);
  
      try {
        if (!isModelLoaded) {
          alert("Please wait for the models to load before capturing images.");
          return;
        }
  
        const blob = await (await fetch(imageSrc)).blob();
        const img = await faceapi.bufferToImage(blob);
        const detections = await faceapi.detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
  
        if (detections && detections.descriptor) {
          const descriptorArray = Array.from(detections.descriptor); // Convert to plain array
          setFaceEmbeddings((prevEmbeddings) => [
            ...prevEmbeddings,
            descriptorArray,
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
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard - Add Employee
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Employee Details</Typography>
              <TextField fullWidth label="Employee ID" name="employeeId" value={employeeData.employeeId} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Name" name="name" value={employeeData.name} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Department" name="department" value={employeeData.department} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Designation" name="designation" value={employeeData.designation} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Email" type="email" name="email" value={employeeData.email} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Phone" name="phone" value={employeeData.phone} onChange={handleChange} margin="normal" />
              <TextField fullWidth label="Password" type="password" name="password" value={employeeData.password} onChange={handleChange} margin="normal" />
              <FormControlLabel control={<Checkbox checked={employeeData.canAddVisitor} onChange={handleChange} name="canAddVisitor" />} label="Can Add Visitor" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent style={{ textAlign: "center" }}>
              <Typography variant="h6">Capture Employee Image</Typography>
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", borderRadius: 10 }} />
              <Button variant="contained" color="primary" onClick={captureImage} style={{ marginTop: 10 }}>
                Capture Image
              </Button>

              {capturedImages.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6">Captured Images</Typography>
                  <Grid container spacing={2}>
                    {capturedImages.map((img, index) => (
                      <Grid item xs={4} key={index}>
                        <img src={img} alt={`Captured ${index + 1}`} style={{ width: "100%", borderRadius: 10, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" }} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="contained" color="secondary" onClick={handleSubmit} style={{ padding: "10px 0", fontSize: "16px" }}>
          Register Employee
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
