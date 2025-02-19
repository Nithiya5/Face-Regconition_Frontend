// import React, { useState, useEffect } from "react";
// import { Container, Typography, Grid, TextField, Button, Card, CardContent, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
// import axios from "axios";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

// const AdminDashboard = () => {
//   const [searchQuery, setSearchQuery] = useState({
//     employeeId: "",
//     department: "",
//     designation: "",
//   });
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Function to handle search input changes
//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchQuery((prev) => ({ ...prev, [name]: value }));
//   };

//   const captureImage = async () => {
//     if (capturedImages.length >= 5) {
//       alert("You can only capture up to 5 images.");
//       return;
//     }

//     const imageSrc = webcamRef.current.getScreenshot();
//     if (imageSrc) {
//       setCapturedImages((prevImages) => [...prevImages, imageSrc]);

//       try {
//         // Wait until models are loaded before performing face detection
//         if (!isModelLoaded) {
//           alert("Please wait for the models to load before capturing images.");
//           return;
//         }

//         // Convert the base64 image to a Blob using fetch
//         const blob = await (await fetch(imageSrc)).blob();

//         // Convert the Blob to an image using face-api.js
//         const img = await faceapi.bufferToImage(blob);

//         // Detect the face and get landmarks and embeddings
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        
//         if (detections) {
//           setFaceEmbeddings((prevEmbeddings) => [
//             ...prevEmbeddings,
//             detections.descriptor,
//           ]);
//         } else {
//           alert("No face detected in the image.");
//         }
//       } catch (error) {
//         console.error("Error processing the image:", error);
//         alert("There was an error processing the image.");
//       }
//     } else {
//       console.error("No image captured");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (capturedImages.length === 0) {
//       alert("Please capture at least one image.");
//       return;
//     }

//     if (faceEmbeddings.length === 0) {
//       alert("Please capture face embeddings.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("employeeId", employeeData.employeeId);
//     formData.append("name", employeeData.name);
//     formData.append("department", employeeData.department);
//     formData.append("designation", employeeData.designation);
//     formData.append("email", employeeData.email);
//     formData.append("phone", employeeData.phone);
//     formData.append("password", employeeData.password);
//     formData.append("canAddVisitor", employeeData.canAddVisitor);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       // Convert images into Blob format before appending
//       for (let i = 0; i < capturedImages.length; i++) {
//         const response = await fetch(capturedImages[i]);
//         const blob = await response.blob();
//         formData.append("images", blob, `image${i + 1}.jpg`);
//       }

//       // Add face embeddings as JSON string
//       formData.append("faceEmbeddings", JSON.stringify(faceEmbeddings));

//       await axios.post(
//         "https://face-regconition-backend.onrender.com/api/admin/registerEmployee",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Employee registered successfully!");
//       setCapturedImages([]);
//       setFaceEmbeddings([]);
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert(error.response?.data?.error || "Error uploading images");
//     }
//   };

//   return (
//     <Container maxWidth="lg" style={{ marginTop: "20px" }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Admin Dashboard
//       </Typography>

//       {/* Add Employee Button */}
//       <Box mb={2} display="flex" justifyContent="flex-end">
//         <Link to="/register-employee">
//           <Button variant="contained" color="primary">
//             Add Employee
//           </Button>
//         </Link>
//       </Box>

//       {/* Search Section */}
//       <Card elevation={3} style={{ marginBottom: "20px" }}>
//         <CardContent>
//           <Typography variant="h6">Search Employees</Typography>
//           <Grid container spacing={3} style={{ marginTop: "20px" }}>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Employee ID"
//                 variant="outlined"
//                 name="employeeId"
//                 value={searchQuery.employeeId}
//                 onChange={handleSearchChange}
//                 color="primary"
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Department"
//                 variant="outlined"
//                 name="department"
//                 value={searchQuery.department}
//                 onChange={handleSearchChange}
//                 color="primary"
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Designation"
//                 variant="outlined"
//                 name="designation"
//                 value={searchQuery.designation}
//                 onChange={handleSearchChange}
//                 color="primary"
//               />
//             </Grid>
//           </Grid>
//           <Box mt={2} display="flex" justifyContent="flex-end">
//             <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
//               {loading ? "Searching..." : "Search"}
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Employee Table Section */}
//       <Card elevation={3}>
//         <CardContent>
//           <Typography variant="h6" style={{ marginBottom: "20px" }}>
//             Employee List
//           </Typography>
//           {renderEmployeeTable()}
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default AdminDashboard;

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
      const authToken = localStorage.getItem("authToken"); // Get token from localStorage
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
      const authToken = localStorage.getItem("authToken"); // Ensure you're getting the correct token
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
