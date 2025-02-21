import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Typography, Grid, Box, Paper, TextField } from "@mui/material";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import Sidebar from "./Sidebar";
import myImage from "./image/Profile.png"

const EmployeeDashboard = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [faceEmbeddings, setFaceEmbeddings] = useState([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          alert("Unauthorized! Please log in again.");
          return;
        }

        const response = await axios.get(
          "https://face-regconition-backend.onrender.com/api/employee/viewEmployeeDetails",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        console.log("Employee details fetched:", response.data);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        alert("Failed to fetch employee details.");
      }
    };

    fetchEmployeeDetails();
  }, []);

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

  const handleSubmit = async () => {
    if (!userDetails) {
      alert("No user details found.");
      return;
    }
    if (faceEmbeddings.length === 0) {
      alert("No face embeddings.");
      return;
    }

    try {
      const authToken = localStorage.getItem("token");
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
      window.location.reload();
    } catch (error) {
      console.error("Error updating face embeddings:", error);
      alert("Failed to update face embeddings.");
    }
  };

  return (
    <Grid container sx={{ backgroundColor: "#f0f2f5", minHeight: "100vh", display: "flex" }}>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>

      <Grid item xs={10}>
        <Container maxWidth="md" sx={{ padding: 4 }}>
          {userDetails && (
            <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, backgroundColor: "white" }}>
              <Grid container spacing={3} alignItems="center">
                
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Name" value={userDetails.name} variant="outlined" margin="dense" disabled />
                  <TextField fullWidth label="Department" value={userDetails.department} variant="outlined" margin="dense" disabled />
                  <TextField fullWidth label="Designation" value={userDetails.designation} variant="outlined" margin="dense" disabled />
                  <TextField fullWidth label="Email" value={userDetails.email} variant="outlined" margin="dense" disabled />
                  <TextField fullWidth label="Phone" value={userDetails.phone} variant="outlined" margin="dense" disabled />
                  <TextField fullWidth label="Role" value={userDetails.role} variant="outlined" margin="dense" disabled />
                  <TextField fullWidth label="Can Add Visitors" value={userDetails.canAddVisitors ? "Yes" : "No"} variant="outlined" margin="dense" disabled />
                  <TextField fullWidth label="Face Embeddings" value={userDetails.hasFaceEmbeddings ? "Available" : "Not Captured"} variant="outlined" margin="dense" disabled />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="center">
                    <img
                      src={myImage}
                      alt="attendance illustration"
                      style={{ width: "100%", maxWidth: "300px", borderRadius: 8 }}
                    />
                  </Box>
                </Grid>

              </Grid>

              {!userDetails.hasFaceEmbeddings && (
                <Box mt={4} sx={{ textAlign: "center" }}>
                  <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", borderRadius: 8, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }} />
                  <Button variant="contained" sx={{ backgroundColor: "#283593", color: "white", mt: 2 }} onClick={captureImage} disabled={capturedImages.length >= 5}>
                    Capture Image
                  </Button>
                  <Button variant="contained" sx={{ backgroundColor: "#283593", color: "white", mt: 2, ml: 2 }} onClick={handleSubmit} disabled={faceEmbeddings.length === 0}>
                    Submit Face Embeddings
                  </Button>
                </Box>
              )}
            </Paper>
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default EmployeeDashboard;
