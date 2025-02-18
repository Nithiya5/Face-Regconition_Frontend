
        // await faceapi.nets.ssdMobilenetv1.loadFromUri("http://localhost:3000/models/ssd_mobilenetv1_model-weights_manifest.json");
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

  const [capturedImages, setCapturedImages] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [faceEmbeddings, setFaceEmbeddings] = useState([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("http://localhost:3000/models/ssd_mobilenetv1_model-weights_manifest.json");
        await faceapi.nets.faceLandmark68Net.loadFromUri("http://localhost:3000/models/ssd_mobilenetv1_model-weights_manifest.json");
        await faceapi.nets.faceRecognitionNet.loadFromUri("http://localhost:3000/models/ssd_mobilenetv1_model-weights_manifest.json");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({ ...employeeData, [name]: type === "checkbox" ? checked : value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(file.type)) {
      alert("Invalid file. Ensure it is JPEG/PNG and under 5MB.");
      return;
    }
    setProfileImage(file);
  };

  const captureImage = async () => {
    if (!isModelLoaded || capturedImages.length >= 5) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages([...capturedImages, imageSrc]);
    try {
      const img = await faceapi.bufferToImage(await fetch(imageSrc).then((res) => res.blob()));
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (detections) setFaceEmbeddings([...faceEmbeddings, Array.from(detections.descriptor)]);
    } catch (error) {
      console.error("Face detection error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(employeeData).forEach(([key, value]) => formData.append(key, value));
    if (faceEmbeddings.length) formData.append("faceEmbeddings", JSON.stringify(faceEmbeddings));
    if (profileImage) formData.append("image", profileImage);

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post("https://face-regconition-backend.onrender.com/api/admin/registerEmployee", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
      });
      alert("Employee registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed.");
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
              <Typography variant="h6">Employee Details</Typography>
              {Object.keys(employeeData).map((key) =>
                key !== "canAddVisitor" ? (
                  <TextField key={key} fullWidth label={key} name={key} value={employeeData[key]} onChange={handleChange} margin="normal" />
                ) : (
                  <FormControlLabel key={key} control={<Checkbox checked={employeeData.canAddVisitor} onChange={handleChange} name={key} />} label="Can Add Visitor" />
                )
              )}
              <Typography variant="h6">Upload Profile Image</Typography>
              <input type="file" accept="image/jpeg, image/png" onChange={handleProfileImageChange} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent style={{ textAlign: "center" }}>
              <Typography variant="h6">Capture Employee Image</Typography>
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%", borderRadius: 10 }} />
              <Button variant="contained" color="primary" onClick={captureImage} style={{ marginTop: "20px" }}>Capture Image</Button>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>Submit</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;

