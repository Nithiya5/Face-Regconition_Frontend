import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Grid, IconButton } from "@mui/material";
import { blue } from "@mui/material/colors";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import LockIcon from "@mui/icons-material/Lock";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

const Slide1 = "https://img.freepik.com/premium-photo/man-with-facial-recognition-technology-overlay-modern-setting_116547-139955.jpg?semt=ais_hybrid?text=Slide+1";
const Slide2 = "https://cdn.prod.website-files.com/614c82ed388d53640613982e/635bcc2d96817846e4852f51_634fd79657515cf1330c7103_63207867a3bbeed46b755d80_guide-to-face-recognition.png?text=Slide+2";
const Slide3 = "https://st3.depositphotos.com/16122460/37311/i/450/depositphotos_373114000-stock-photo-facial-recognition-system-young-man.jpg?text=Slide+3";

export default function AboutUs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [Slide1, Slide2, Slide3];

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 3000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: 3 }}>
      <Box sx={{ textAlign: "center", mt: 10, maxWidth: "900px", margin: "auto" }}>
        <Typography variant="h5" color="black" sx={{ mt: 6 }}>
          Introducing the future of employee attendance with face recognition technology.With a simple face scan, your attendance is recorded, ensuring accuracy.
        </Typography>
        
      </Box>

      <Paper
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "80%", 
          height: "500px",
          borderRadius: 2,
          margin: "auto",
          mt: 4,
        }}
      >
        <Box
          component="img"
          src={slides[currentSlide]}
          alt="Slide"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "fill", 
            borderRadius: 2,
          }}
        />
      </Paper>

      <Grid container spacing={4} sx={{ marginTop: 4, justifyContent: "center" }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: "center", backgroundColor: "#ffffff", padding: 3, borderRadius: 2 }}>
            <IconButton sx={{ backgroundColor: blue[100], padding: 2, borderRadius: "50%" }}>
              <FastRewindIcon sx={{ fontSize: 40, color: blue[500] }} />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" color={blue[500]} sx={{ mt: 2 }}>
              Fast and Accurate
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              Our system captures your attendance in seconds with a high level of accuracy. Say goodbye to long queues and delays!
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: "center", backgroundColor: "#ffffff", padding: 3, borderRadius: 2 }}>
            <IconButton sx={{ backgroundColor: blue[100], padding: 2, borderRadius: "50%" }}>
              <LockIcon sx={{ fontSize: 40, color: blue[500] }} />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" color={blue[500]} sx={{ mt: 2 }}>
              Secure and Private
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              Your face data is securely stored, ensuring your privacy is protected. Only authorized personnel can access the records.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: "center", backgroundColor: "#ffffff", padding: 3, borderRadius: 2 }}>
            <IconButton sx={{ backgroundColor: blue[100], padding: 2, borderRadius: "50%" }}>
              <IntegrationInstructionsIcon sx={{ fontSize: 40, color: blue[500] }} />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" color={blue[500]} sx={{ mt: 2 }}>
              Easy Integration
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              Easily integrate with existing attendance systems without hassle. Our solution is compatible with various software.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 6, textAlign: "center" }}>
        <Typography variant="h5" color={blue[700]} fontWeight="bold">
         What do people say?
        </Typography>
        <Grid container spacing={4} sx={{ marginTop: 3, justifyContent: "center" }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ padding: 3, backgroundColor: "#ffffff", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" color={blue[500]}>
                John Doe
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                "The face recognition system has made attendance so much more efficient and hassle-free."
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ padding: 3, backgroundColor: "#ffffff", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" color={blue[500]}>
                Emily Smith
              </Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                "No more signing in or worrying about missing attendance. The system is quick and reliable!"
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ textAlign: "center", mt: 4, padding: 2, backgroundColor: "#1e40af", color: "white" }}>
        <Typography variant="body2">© 2025 Face Recognition Attendance System</Typography>
      </Box>
    </Box>
  );
}