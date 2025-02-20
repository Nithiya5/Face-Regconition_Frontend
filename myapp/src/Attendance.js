import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Button, Grid, Box } from "@mui/material";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

const Attendance = () => {
  const webcamRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceEmbedding, setFaceEmbedding] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [location, setLocation] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

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

  // ✅ Fetch user details
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

  // ✅ Get device ID (Browser Fingerprint)
  useEffect(() => {
    const getDeviceId = async () => {
      const fingerprint = await navigator.userAgent;
      setDeviceId(fingerprint);
    };

    getDeviceId();
  }, []);

  // ✅ Get User Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get location. Enable location services.");
      }
    );
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
        setFaceEmbedding([Array.from(detection.descriptor)]);
        alert("Face detected! Ready to mark attendance.");
      } else {
        alert("No face detected. Try again.");
      }
    } catch (error) {
      console.error("Error capturing face:", error);
      alert("Failed to detect face.");
    }
  };

  // ✅ Mark Attendance with Real Data
  const markAttendance = async () => {
    if (!faceEmbedding) {
      alert("No face embedding captured!");
      return;
    }

    const empId = userDetails?.employeeId;
    if (!empId) {
      alert("Employee ID is missing. Please log in again.");
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("Unauthorized! Please log in.");
      return;
    }
    const deviceId = navigator.userAgent.split(" ")[0]; // Only take the first part

    console.log("Auth Token:", authToken);
    console.log("Sending Data:", {
      empId,
      faceEmbedding,
      isLive: true, // ✅ Implement liveness detection separately
      livenessConfidence: Math.random().toFixed(2), // ✅ Simulate confidence value
      phoneDetected: false, // ✅ Implement phone detection separately
      spoofAttempt: false, // ✅ Implement anti-spoofing separately
      deviceId,
      location,
    });

    try {
      const response = await axios.post(
        "https://face-regconition-backend.onrender.com/api/employee/mark-attendance",
        {
          faceEmbedding,
          isLive: true,
          livenessConfidence: Math.random().toFixed(2),
          phoneDetected: false,
          spoofAttempt: false,
          deviceId,
          location,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setAttendanceStatus(response.data.msg);
      alert(response.data.msg);
    } catch (error) {
      console.error("Error marking attendance:", error);
      if (error.response) {
          console.error("Server Response Data:", error.response.data);
          alert(error.response.data?.msg || "Attendance marking failed.");
      } else if (error.request) {
          console.error("No response received from server:", error.request);
          alert("No response from server. Please try again.");
      } else {
          console.error("Error setting up request:", error.message);
          alert("Unexpected error occurred.");
      }
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
