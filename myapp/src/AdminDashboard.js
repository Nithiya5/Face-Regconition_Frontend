import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Dashboard, People, BarChart, History, ExitToApp, Info } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ employeeId: "", department: "", designation: "" });
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const authToken = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://face-regconition-backend.onrender.com/api/admin/getAllEmployees",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setEmployees(response.data.employees);
      setFilteredEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
    setLoading(false);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setLoading(true);
    const filtered = employees.filter((employee) =>
      Object.keys(searchQuery).every(
        (key) => searchQuery[key] === "" || employee[key]?.toLowerCase().includes(searchQuery[key].toLowerCase())
      )
    );
    setFilteredEmployees(filtered);
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "white", minHeight: "100vh" }}>
      {/* Sidebar */}
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
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>Admin</Typography>
        </Box>
        <List>
          <ListItem button component={Link} to="/details" sx={{ color: "#fff", "&:hover": { backgroundColor: "#303f9f" } }}>
            <ListItemIcon sx={{ color: "#fff" }}><Dashboard /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button component={Link} to="/emp" sx={{ color: "#fff", "&:hover": { backgroundColor: "#303f9f" } }}>
            <ListItemIcon sx={{ color: "#fff" }}><People /></ListItemIcon>
            <ListItemText primary="Employee Records" />
          </ListItem>
          <ListItem button component={Link} to="/logs" sx={{ color: "#fff", "&:hover": { backgroundColor: "#303f9f" } }}>
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

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, flexGrow: 1 }}>
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Info sx={{ fontSize: 32, color: "#283593", marginRight: 2 }} />
    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#283593", lineHeight: 1 }}>
      Employee Details
    </Typography>
  </Box>

  <Typography variant="body1" sx={{ textAlign: "center", fontStyle: "italic", color: "#5f6368", mt: 2 }}>
    "Our employees are our greatest asset, driving success every day."
  </Typography>
  
  <br></br><br></br>


         
        

        {/* Search Form */}
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#283593" }}>Search Employees</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  name="employeeId"
                  value={searchQuery.employeeId}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "#f4f6f8", borderRadius: "4px" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={searchQuery.department}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "#f4f6f8", borderRadius: "4px" }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={searchQuery.designation}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: "#f4f6f8", borderRadius: "4px" }}
                />
              </Grid>
            </Grid>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  backgroundColor: "#283593",
                  "&:hover": { backgroundColor: "#1a237e" },
                }}
              >
                {loading ? <CircularProgress size={24} color="secondary" /> : "Search"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Employee List */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Employee ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Department</strong></TableCell>
                    <TableCell><strong>Designation</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.employeeId}>
                        <TableCell>{employee.employeeId}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.designation}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No employees found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;