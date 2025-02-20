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
  const [isLive, setIsLive] = useState(false);
  const [livenessConfidence, setLivenessConfidence] = useState(0);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [spoofAttempt, setSpoofAttempt] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [location, setLocation] = useState(null);

  // ✅ Get Device ID
  useEffect(() => {
    setDeviceId(navigator.userAgent); // Using user agent as a simple identifier
  }, []);

  // ✅ Get Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          });
        },
        (error) => {
          console.error("❌ Location access denied:", error);
        }
      );
    }
  }, []);

  // ✅ Load FaceAPI Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelLoaded(true);
        console.log("✅ FaceAPI models loaded.");
      } catch (error) {
        console.error("❌ Error loading face-api models:", error);
      }
    };
    loadModels();
  }, []);

  // ✅ Capture Face & Check for Smile
  const captureFace = async () => {
    if (!isModelLoaded) {
      alert("Face detection models not loaded.");
      return;
    }

    setIsLive(false);
    setFaceEmbedding(null);

    console.log("📸 Capturing initial face...");
    const imageSrc = webcamRef.current.getScreenshot();
    const img = await faceapi.bufferToImage(await fetch(imageSrc).then((res) => res.blob()));
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detection) {
      alert("No face detected. Try again.");
      return;
    }

    setFaceEmbedding(detection.descriptor);
    console.log("😊 Please SMILE to pass liveness check!");

    // ✅ Wait for Smile
    setTimeout(async () => {
      const imageSrc2 = webcamRef.current.getScreenshot();
      const img2 = await faceapi.bufferToImage(await fetch(imageSrc2).then((res) => res.blob()));
      const detection2 = await faceapi.detectSingleFace(img2).withFaceLandmarks();

      if (!detection2) {
        alert("Face disappeared! Keep your face visible.");
        return;
      }

      const landmarks = detection2.landmarks;
      const mouth = landmarks.getMouth();
      const upperLipY = mouth[3].y;
      const lowerLipY = mouth[9].y;
      const smileScore = lowerLipY - upperLipY; // Measures mouth openness

      if (smileScore > 10) { // Adjust threshold if needed
        setIsLive(true);
        setLivenessConfidence((smileScore / 20).toFixed(2)); // Normalize confidence
        console.log("✅ Smile detected! Liveness check passed.");
        alert("✅ Smile detected! Ready to mark attendance.");
      } else {
        setIsLive(false);
        setLivenessConfidence(0);
        console.log("❌ No smile detected. Try again!");
        alert("❌ No smile detected. Please smile to pass the check.");
      }
    }, 2000); // Wait 2 sec for the user to smile
  };

  // ✅ Detect if the user is on a phone
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setPhoneDetected(isMobile);
  }, []);

  // ✅ Check for Spoof Attempt
  const detectSpoofing = async () => {
    const imageSrc1 = webcamRef.current.getScreenshot();
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait 1.5 sec
    const imageSrc2 = webcamRef.current.getScreenshot();

    if (imageSrc1 === imageSrc2) {
      setSpoofAttempt(true);
      console.warn("⚠️ Possible spoofing detected!");
    } else {
      setSpoofAttempt(false);
    }
  };

  // ✅ Mark Attendance
  const markAttendance = async () => {
    if (!faceEmbedding || !isLive) {
      alert("Liveness check failed! Try again.");
      return;
    }

    await detectSpoofing(); // Check for spoof attempts

    try {
      const authToken = localStorage.getItem("token");

      const requestData = {
        faceEmbedding: [Object.values(faceEmbedding)],
        isLive,
        livenessConfidence,
        phoneDetected,
        spoofAttempt,
        deviceId,
        location,
      };

      console.log("📤 Sending attendance data...", requestData);

      const response = await axios.post(
        "https://face-regconition-backend.onrender.com/api/employee/mark-attendance",
        requestData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setAttendanceStatus(response.data.msg);
      console.log("✅ Attendance marked successfully:", response.data.msg);
      alert(response.data.msg);
    } catch (error) {
      console.error("❌ Error marking attendance:", error);
      alert("Attendance marking failed.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center">Mark Attendance</Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", borderRadius: 10 }} />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={captureFace} fullWidth>
              Capture Face
            </Button>
          </Box>
          <Box mt={2}>
            <Button variant="contained" color="secondary" onClick={markAttendance} fullWidth disabled={!isLive}>
              Mark Attendance
            </Button>
          </Box>
          {attendanceStatus && <Typography variant="h6" color="primary" align="center">{attendanceStatus}</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Attendance;
