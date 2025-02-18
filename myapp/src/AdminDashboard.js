import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Container, Typography, Grid, FormControlLabel, Checkbox, Card, CardContent, Box } from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";
import * as faceapi from "face-api.js";

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
  const [profileImage, setProfileImage] = useState(null); // Profile image file
  const [faceEmbeddings, setFaceEmbeddings] = useState([]); // Store face embeddings for recognition
  const [isModelLoaded, setIsModelLoaded] = useState(false); // Track model loading state
  const webcamRef = useRef(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("http://localhost:3000/models/ssd_mobilenetv1_model-weights_manifest.json");
        console.log("SSD MobileNetV1 model loaded");

        await faceapi.nets.faceLandmark68Net.loadFromUri("http://localhost:3000//models/face_recognition_model-weights_manifest.json");
        console.log("Face Landmark 68 model loaded");

        await faceapi.nets.faceRecognitionNet.loadFromUri("http://localhost:3000/models/face_landmark_68_model-weights_manifest.json");
        console.log("Face Recognition model loaded");

        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Capture image from webcam and detect faces
  const captureImage = async () => {
    if (capturedImages.length >= 5) {
      alert("You can only capture up to 5 images.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages((prevImages) => [...prevImages, imageSrc]);

    if (!isModelLoaded) {
      alert("Please wait for the models to load before capturing images.");
      return;
    }

    try {
      const img = await faceapi.bufferToImage(await fetch(imageSrc).then((res) => res.blob()));

      // Detect face and landmarks
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (detections) {
        const descriptorArray = Array.from(detections.descriptor); // Convert descriptor to plain array

        // Store face embeddings
        setFaceEmbeddings((prevEmbeddings) => [...prevEmbeddings, descriptorArray]);
      } else {
        alert("No face detected.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image.");
    }
  };

  // Handle form submission with image and data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (capturedImages.length === 0) {
      alert("Please capture at least one image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please log in.");
      return;
    }

    let profileImageUrl = "";
    if (profileImage) {
      const profileFormData = new FormData();
      profileFormData.append("file", profileImage);
      profileFormData.append("upload_preset", "hjgdsfiu"); // Use your correct upload preset here

      try {
        const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/djxbzcayc/image/upload", profileFormData, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure content type is set correctly
          },
        });
        profileImageUrl = uploadRes.data.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        alert("Error uploading profile image");
        return;
      }
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
    formData.append("profileImage", profileImageUrl);

    // Append captured images as blobs
    for (let i = 0; i < capturedImages.length; i++) {
      const response = await fetch(capturedImages[i]);
      const blob = await response.blob();
      formData.append("faceImages", blob, `image${i + 1}.jpg`);
    }

    // Add the face embeddings as JSON
    formData.append("faceEmbeddings", JSON.stringify(faceEmbeddings));

    try {
      await axios.post(
        "https://face-regconition-backend.onrender.com/api/admin/registerEmployee",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Employee registered successfully!");
      setCapturedImages([]); // Clear images after successful submission
      setProfileImage(null); // Reset profile image
      setFaceEmbeddings([]); // Clear embeddings after submission
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      alert(error.response?.data?.error || "Error uploading images");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard - Add Employee
      </Typography>

      <Grid container spacing={3}>
        {/* Employee Form */}
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
              
              {/* Profile Image Upload */}
              <Typography variant="h6" gutterBottom>Upload Profile Image</Typography>
              <input type="file" accept="image/jpeg, image/png" onChange={(e) => setProfileImage(e.target.files[0])} />
            </CardContent>
          </Card>
        </Grid>

        {/* Webcam & Captured Images */}
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

      <Button variant="contained" color="secondary" fullWidth onClick={handleSubmit} style={{ marginTop: 20, padding: "10px 0", fontSize: "16px" }}>
        Register Employee
      </Button>
    </Container>
  );
};

export default AdminDashboard;
