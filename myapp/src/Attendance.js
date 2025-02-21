import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Button, Grid, Box, Paper, Card, CardContent } from "@mui/material";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import Sidebar from "./Sidebar";
import myImage from "./image/Attendance.png";

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

  useEffect(() => {
    setDeviceId(navigator.userAgent); 
  }, []);

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
      const smileScore = lowerLipY - upperLipY; 

      if (smileScore > 10) { 
        setIsLive(true);
        setLivenessConfidence((smileScore / 20).toFixed(2)); 
        console.log("✅ Smile detected! Liveness check passed.");
        alert("✅ Smile detected! Ready to mark attendance.");
      } else {
        setIsLive(false);
        setLivenessConfidence(0);
        console.log("❌ No smile detected. Try again!");
        alert("❌ No smile detected. Please smile to pass the check.");
      }
    }, 2000); 
  };

  
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setPhoneDetected(isMobile);
  }, []);

  const detectSpoofing = async () => {
    const imageSrc1 = webcamRef.current.getScreenshot();
    await new Promise((resolve) => setTimeout(resolve, 1500)); 
    const imageSrc2 = webcamRef.current.getScreenshot();

    if (imageSrc1 === imageSrc2) {
      setSpoofAttempt(true);
      console.warn("⚠️ Possible spoofing detected!");
    } else {
      setSpoofAttempt(false);
    }
  };

  const markAttendance = async () => {
    if (!faceEmbedding || !isLive) {
      alert("Liveness check failed! Try again.");
      return;
    }

    await detectSpoofing(); 

    if (!isLive || livenessConfidence < 0.7 || phoneDetected || spoofAttempt) {
      alert("⚠️ Liveness check failed. Possible spoof attempt detected!");
      return;
    }

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

      const response = await axios.post(
        "https://face-regconition-backend.onrender.com/api/employee/mark-attendance",
        requestData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setAttendanceStatus(response.data.msg);
      alert(response.data.msg);
    } catch (error) {
      console.error("❌ Error marking attendance:", error);
      alert("Attendance marking failed.");
    }
  };

  return (
    <Box display="flex" sx={{ height: "100vh", backgroundColor: "#f4f4f9" ,paddingLeft:"130px"}}>
      <Sidebar />
      <Box flex={1} p={3} sx={{ backgroundColor: "#fff", boxShadow: 0, borderRadius: 2 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' ,fontStyle:'italic',paddingTop:'10px'}}>Smile & Confirm Your Spot! 😊</Typography>
          
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {/* Left side: Webcam */}
            <Grid item xs={12} md={6} container direction="column" alignItems="center">
              <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 0 }}>
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", borderRadius: 10 }} />
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={captureFace}
                    fullWidth
                    sx={{
                      backgroundColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#1565c0"
                      },
                    }}
                  >
                    Capture Face & Smile
                  </Button>
                </Box>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={markAttendance}
                    fullWidth
                    disabled={!isLive}
                    sx={{
                      backgroundColor: "#d32f2f",
                      "&:hover": {
                        backgroundColor: "#c62828"
                      },
                    }}
                  >
                    Mark Attendance
                  </Button>
                </Box>
              </Paper>

              {attendanceStatus && (
                <Typography variant="h6" color="primary" align="center" sx={{ mt: 3 }}>
                  {attendanceStatus}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <img
                  src={myImage} 
                  alt="attendance illustration"
                  style={{ width: "80%", borderRadius: 8 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Attendance;
