import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, TextField, Button, Card, CardContent, Box, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState({
    employeeId: "",
    department: "",
    designation: "",
  });
  const [employees, setEmployees] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null); // State to store fetched employee details
  const [loading, setLoading] = useState(false);

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle fetching employee details by employeeId
  const handleViewEmployeeDetails = async (employeeId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://your-backend-url.com/api/admin/employee/${employeeId}`);
      setEmployeeDetails(response.data.employee); // Assuming response contains employee details
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
    setLoading(false);
  };

  // Fetch employee data based on search parameters
  const handleSearch = async () => {
    setLoading(true);
    const { employeeId, department, designation } = searchQuery;

    try {
      const response = await axios.get("https://face-regconition-backend.onrender.com/api/admin//viewEmployeeDetails/:employeeId", {
        params: { employeeId, department, designation },
      });
      setEmployees(response.data); // Assuming response contains an array of employee objects
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }

    setLoading(false);
  };

  // Render employee details or display employee list
  const renderEmployeeDetails = () => {
    if (employeeDetails) {
      return (
        <Card elevation={3} style={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6">Employee Details</Typography>
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Grid item xs={12} sm={4}>
                <Typography><strong>Employee ID:</strong> {employeeDetails.employeeId}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography><strong>Name:</strong> {employeeDetails.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography><strong>Department:</strong> {employeeDetails.department}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography><strong>Designation:</strong> {employeeDetails.designation}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography><strong>Email:</strong> {employeeDetails.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography><strong>Phone:</strong> {employeeDetails.phone}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  // Render employee details in a table
  const renderEmployeeTable = () => {
    if (employees.length === 0) {
      return <Typography>No employee data found</Typography>;
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.employeeId}>
              <TableCell>{employee.employeeId}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" style={{ margin: "0 5px" }} onClick={() => handleViewEmployeeDetails(employee.employeeId)}>
                  View Details
                </Button>
                <Button variant="outlined" color="secondary" style={{ margin: "0 5px" }}>
                  Edit
                </Button>
                <Button variant="outlined" color="secondary" style={{ margin: "0 5px" }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Add Employee Button */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Link to="/register-employee">
          <Button variant="contained" color="primary">
            Add Employee
          </Button>
        </Link>
      </Box>

      {/* Search Section */}
      <Card elevation={3} style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6">Search Employees</Typography>
          <Grid container spacing={3} style={{ marginTop: "20px" }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Employee ID"
                variant="outlined"
                name="employeeId"
                value={searchQuery.employeeId}
                onChange={handleSearchChange}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Department"
                variant="outlined"
                name="department"
                value={searchQuery.department}
                onChange={handleSearchChange}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Designation"
                variant="outlined"
                name="designation"
                value={searchQuery.designation}
                onChange={handleSearchChange}
                color="primary"
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Render Employee Table */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" style={{ marginBottom: "20px" }}>
            Employee List
          </Typography>
          {renderEmployeeTable()}
        </CardContent>
      </Card>

      {/* Render Employee Details */}
      {renderEmployeeDetails()}
    </Container>
  );
};

export default AdminDashboard;
