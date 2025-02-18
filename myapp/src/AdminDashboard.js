import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, FormControlLabel, Checkbox, Card, CardContent } from "@mui/material";
import axios from "axios";

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

  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to handle async token fetch

  // Fetch logged-in user details and set the user state
  const fetchUserDetails = async () => {
    try {
      const authToken = localStorage.getItem("token"); // Get token from localStorage
      if (!authToken) {
        // Handle the case where token is not available
        alert("Token not found. Please log in again.");
        return;
      }
      const response = await axios.get("http://localhost:8000/api/auth/user", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data); // Set user details after successful fetch
      setLoading(false); // Set loading to false after the data is fetched
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false); // Stop loading in case of error
    }
  };

  // Load user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Handle input changes for employee data
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData({ ...employeeData, [name]: type === "checkbox" ? checked : value });
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(file.type)) {
      alert("Invalid file. Ensure it is JPEG/PNG and under 5MB.");
      return;
    }
    setProfileImage(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent form submission if the token is still being fetched

    const formData = new FormData();
    Object.entries(employeeData).forEach(([key, value]) => formData.append(key, value));
    if (profileImage) formData.append("image", profileImage);

    try {
      const authToken = localStorage.getItem("token"); // Ensure you're getting the correct token
      if (!authToken) {
        alert("Token not found. Please log in again.");
        return;
      }

      await axios.post("http://localhost:8000/api/admin/registerEmployee", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
      });
      alert("Employee registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed.");
    }
  };

  // Wait for user details to load, then render the UI
  if (loading) {
    return <Typography variant="h6" align="center">Loading user details...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard - Add Employee
      </Typography>
      {user && <Typography variant="h6" align="center">Logged in as: {user.name} ({user.role})</Typography>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Employee Details</Typography>
              {Object.keys(employeeData).map((key) =>
                key !== "canAddVisitor" ? (
                  <TextField
                    key={key}
                    fullWidth
                    label={key}
                    name={key}
                    value={employeeData[key]}
                    onChange={handleChange}
                    margin="normal"
                  />
                ) : (
                  <FormControlLabel
                    key={key}
                    control={<Checkbox checked={employeeData.canAddVisitor} onChange={handleChange} name={key} />}
                    label="Can Add Visitor"
                  />
                )
              )}
              <Typography variant="h6">Upload Profile Image</Typography>
              <input type="file" accept="image/jpeg, image/png" onChange={handleProfileImageChange} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ width: "100%", marginTop: "20px" }}
            disabled={loading} // Disable button while loading
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
