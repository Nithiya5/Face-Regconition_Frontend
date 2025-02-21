import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Container,
  Avatar,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Dashboard, People, BarChart, History, ExitToApp } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material"; 
import { Link } from "react-router-dom";

const Admindetails = () => {
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    email: "",
    bio: "",
    hobbies: "",
    skills: "",
    achievements: "",
    goals: "",
    experience: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMessage("Admin profile updated successfully!");
      setToastSeverity("success");
      setOpenToast(true);
    }, 2000);
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "white", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#283593",
            color: "white",
            paddingTop: "20px",
          },
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 3 }}>
          <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1, backgroundColor: "lightgrey" }} />
          <Typography variant="h6" sx={{ color: "#fff" }}>Admin</Typography>
        </Box>
        <List>
          <ListItem button component={Link} to="/details" sx={{ color: "#fff" }}>
            <ListItemIcon sx={{ color: "#fff" }}><Dashboard /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button component={Link} to="/emp" sx={{ color: "#fff" }}>
            <ListItemIcon sx={{ color: "#fff" }}><People /></ListItemIcon>
            <ListItemText primary="Employee Records" />
          </ListItem>
          <ListItem button component={Link} to="/logs" sx={{ color: "#fff" }}>
            <ListItemIcon sx={{ color: "#fff" }}><History /></ListItemIcon>
            <ListItemText primary="View Logs" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'white' }} />
        </ListItem>
        </List>
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 8, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <br></br>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 3, color: "#283593", display: "flex", alignItems: "center", justifyContent: "center" }}>
  <AccountCircle sx={{ fontSize: 40, mr: 1 }} /> 
  Profile details
</Typography>
<br></br>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ width: "55%" }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField label="Name" name="name" value={adminDetails.name} onChange={handleInputChange} fullWidth />
                <TextField label="Email" name="email" value={adminDetails.email} onChange={handleInputChange} fullWidth />
              </Box>

              <TextField label="Bio" name="bio" value={adminDetails.bio} onChange={handleInputChange} fullWidth multiline rows={2} sx={{ my: 2 }} />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField label="Hobbies" name="hobbies" value={adminDetails.hobbies} onChange={handleInputChange} fullWidth />
                <TextField label="Skills" name="skills" value={adminDetails.skills} onChange={handleInputChange} fullWidth />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField label="Achievements" name="achievements" value={adminDetails.achievements} onChange={handleInputChange} fullWidth />
                <TextField label="Goals" name="goals" value={adminDetails.goals} onChange={handleInputChange} fullWidth />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField label="Experience" name="experience" value={adminDetails.experience} onChange={handleInputChange} fullWidth />
                <TextField label="Contact Number" name="contactNumber" value={adminDetails.contactNumber} onChange={handleInputChange} fullWidth />
              </Box>

              <Box display="flex" justifyContent="center" mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ padding: "10px 20px" }} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Save Profile"}
                </Button>
              </Box>
            </Box>

            <Box sx={{ width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img 
                src="https://cdni.iconscout.com/illustration/premium/thumb/system-administrator-illustration-download-in-svg-png-gif-file-formats--admin-manager-web-development-operator-user-pack-people-illustrations-3726273.png?f=webp" 
                alt="Admin Illustration" 
                style={{ width: "100%", maxWidth: "750px" }} 
              />
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Admindetails;