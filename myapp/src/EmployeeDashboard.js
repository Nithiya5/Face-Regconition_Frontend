import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Typography, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

const EmployeeDashboard = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [faceEmbeddings, setFaceEmbeddings] = useState([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate(); // ✅ Added navigate hook

  // ✅ Fetch logged-in user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          alert("Unauthorized! Please log in again.");
          return;
        }

        const response = await axios.get("https://face-regconition-backend.onrender.com/api/auth/user", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setUserDetails(response.data);
        console.log("User details fetched:", response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, []);

  // ✅ Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models...");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelLoaded(true);
        console.log("Models loaded successfully.");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  // ✅ Capture Image & Extract Face Embeddings
  const captureImage = async () => {
    if (!isModelLoaded || capturedImages.length >= 5) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages([...capturedImages, imageSrc]);

    try {
      const img = await faceapi.bufferToImage(await fetch(imageSrc).then((res) => res.blob()));
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (detections) {
        console.log("Face detected:", detections);
        setFaceEmbeddings((prev) => [...prev, Array.from(detections.descriptor)]);
      } else {
        console.log("No face detected.");
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }
  };

  // ✅ Submit Face Embeddings
  const handleSubmit = async () => {
    if (!userDetails || faceEmbeddings.length === 0) {
      alert("No face embeddings or user details found.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Unauthorized! Please log in again.");
        return;
      }

      await axios.put(
        "https://face-regconition-backend.onrender.com/api/employee/updateFaceEmbeddings",
        { employeeId: userDetails.employeeId, faceEmbeddings },
        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
      );

      alert("Face embeddings updated successfully!");
    } catch (error) {
      console.error("Error updating face embeddings:", error);
      alert("Failed to update face embeddings.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Employee Dashboard
      </Typography>
      {userDetails && (
        <Typography variant="h6" align="center">
          Logged in as: {userDetails.employeeId} ({userDetails.role})
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* ✅ Capture Image Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Capture Employee Image</Typography>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", borderRadius: 10 }} />
          <Button variant="contained" color="primary" onClick={captureImage} style={{ marginTop: "20px" }}>
            Capture Image
          </Button>
          <Box mt={2}>
            {capturedImages.length > 0 && <Typography variant="body1">Captured Images:</Typography>}
            <Grid container spacing={2}>
              {capturedImages.map((image, index) => (
                <Grid item xs={4} key={index}>
                  <img src={image} alt={`captured-${index}`} style={{ width: "100%", borderRadius: 10 }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* ✅ Submit Face Embeddings Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
            Submit Face Embeddings
          </Button>
        </Grid>

        {/* ✅ "Attendance" Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={() => navigate("/attendance")} style={{ width: "100%" }}>
            Attendance
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard;
