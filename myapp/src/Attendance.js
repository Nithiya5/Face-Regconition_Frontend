import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Button, Grid, Box } from "@mui/material";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const Attendance = () => {
  const webcamRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  // ✅ Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelLoaded(true);
        console.log("FaceAPI models loaded.");
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        console.log("Decoded Token:", decoded); // Debugging
        const userId = decoded.userId;  // Extract userId from token
  
        // Fetch employee details from backend using userId
        axios.get(`https://face-regconition-backend.onrender.com/api/employee/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(response => {
          console.log("Employee Data:", response.data);
          setEmployeeId(response.data.employeeId);  // Set employeeId from DB
        })
        .catch(error => {
          console.error("Error fetching employee data:", error);
          alert("Failed to get employee details. Please log in again.");
        });
  
      } catch (error) {
        console.error("Error decoding authToken:", error);
      }
    }
  }, []);
  
  

  // ✅ Capture Face Embedding
  const captureFace = async () => {
    if (!isModelLoaded) {
      alert("Face detection models are not loaded yet.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    try {
      const img = await faceapi.bufferToImage(await fetch(imageSrc).then((res) => res.blob()));
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (detection) {
        setFaceEmbedding(Array.from(detection.descriptor));
        alert("Face detected! Ready to mark attendance.");
      } else {
        alert("No face detected. Try again.");
      }
    } catch (error) {
      console.error("Error capturing face:", error);
      alert("Failed to detect face.");
    }
  };

  // ✅ Send Attendance Data to Backend
  const markAttendance = async () => {
    if (!faceEmbedding) {
      alert("No face embedding captured!");
      return;
    }
    if (!employeeId) {
      alert("Employee ID is missing. Please log in again.");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Unauthorized! Please log in.");
      return;
    }
    console.log("Auth Token:", authToken);
    console.log("Sending Data:", {
      employeeId,
      faceEmbedding,
      isLive: true,
      livenessConfidence: 0.9,
      phoneDetected: false,
      spoofAttempt: false,
      deviceId: "DEVICE123",
      location: "Office Entrance",
    });

    try {
      const response = await axios.post(
        "https://face-regconition-backend.onrender.com/api/employee/mark-attendance",
        {
          employeeId,
          faceEmbedding,
          isLive: true,
          livenessConfidence: 0.9,
          phoneDetected: false,
          spoofAttempt: false,
          deviceId: "DEVICE123",
          location: "Office Entrance",
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setAttendanceStatus(response.data.msg);
      alert(response.data.msg);
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert(error.response?.data?.msg || "Attendance marking failed.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Mark Attendance
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", borderRadius: 10 }} />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={captureFace} fullWidth>
              Capture Face
            </Button>
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="secondary" onClick={markAttendance} fullWidth disabled={!faceEmbedding}>
              Mark Attendance
            </Button>
          </Box>
          {attendanceStatus && (
            <Typography variant="h6" color="primary" align="center" mt={2}>
              {attendanceStatus}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Attendance;
