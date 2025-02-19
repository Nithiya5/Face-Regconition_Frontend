import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Typography, Grid, Box } from "@mui/material";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

const EmployeeDashboard = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [faceEmbeddings, setFaceEmbeddings] = useState([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models...");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("http://localhost:3000/models/ssd_mobilenetv1_model-weights_manifest.json");
        await faceapi.nets.faceLandmark68Net.loadFromUri("http://localhost:3000/models/face_landmark_68_model-weights_manifest.json");
        await faceapi.nets.faceRecognitionNet.loadFromUri("http://localhost:3000/models/face_recognition_model-weights_manifest.json");
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
    console.log("Captured image src:", imageSrc);

    setCapturedImages([...capturedImages, imageSrc]);

    try {
      const img = await faceapi.bufferToImage(await fetch(imageSrc).then((res) => res.blob()));

      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (detections) {
        console.log("Face detected:", detections);
        const newEmbedding = Array.from(detections.descriptor);
        console.log("New embedding:", newEmbedding);

        setFaceEmbeddings((prevEmbeddings) => [...prevEmbeddings, newEmbedding]);
      } else {
        console.log("No face detected in the image.");
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }
  };

  const handleSubmit = async () => {
    if (faceEmbeddings.length === 0) {
      alert("No face embeddings to submit.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      console.log("Auth Token in frontend:", authToken); // Debug: Log the token

      if (!authToken) {
        alert("Unauthorized! Please log in again.");
        return;
      }

      const response = await axios.put(
        "http://localhost:8000/api/employee/updateFaceEmbeddings",
        { faceEmbeddings: faceEmbeddings }, // Send the array directly
        { headers: { Authorization: `Bearer ${authToken}` } }
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
      <Grid container spacing={3}>
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

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
            Submit Face Embeddings
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard;
