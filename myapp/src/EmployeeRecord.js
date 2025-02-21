import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Search, Edit, Delete, PersonAdd } from "@mui/icons-material";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Dashboard, People, BarChart, History, ExitToApp } from "@mui/icons-material";
import axios from "axios";
import { Link } from "react-router-dom";

const EmployeeRecord = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    employeeId: "",
    department: "",
    designation: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://face-regconition-backend.onrender.com/api/admin/getAllEmployees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data.employees);
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

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`https://face-regconition-backend.onrender.com/api/admin/deleteEmployee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleEditOpen = (employee) => {
    setSelectedEmployee({ ...employee }); // Clone employee object
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `https://face-regconition-backend.onrender.com/api/admin/editEmployee/${selectedEmployee.employeeId}`,
        selectedEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Employee details updated successfully");
      fetchEmployees();
      handleEditClose();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "white", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box", backgroundColor: "#283593", color: "white" },
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 3 ,paddingTop:"15px"}}>
          <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1, backgroundColor: "lightgrey" }} />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>Admin</Typography>
        </Box>
        <List>
          <ListItem button component={Link} to="/details" sx={{ color: "#E5E7EB" }}>
            <ListItemIcon sx={{ color: "#E5E7EB" }}><Dashboard /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button component={Link} to="/customer-records" sx={{ color: "#E5E7EB" }}>
            <ListItemIcon sx={{ color: "#E5E7EB" }}><People /></ListItemIcon>
            <ListItemText primary="Employee Records" />
          </ListItem>
          <ListItem button component={Link} to="/logs" sx={{ color: "#E5E7EB", bgcolor: "#283593" }}>
            <ListItemIcon sx={{ color: "#E5E7EB" }}><History /></ListItemIcon>
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
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "#283593" }} gutterBottom>
          Employee Records
        </Typography>

        {/* Search Form */}
        <Card elevation={3} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6"><Search sx={{ mr: 1 }} /> <b>Search Employees</b></Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Employee ID" name="employeeId" onChange={(e) => handleEditChange(e)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Department" name="department" onChange={(e) => handleEditChange(e)} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card elevation={3}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Employee ID</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Department</b></TableCell>
                  <TableCell><b>designation</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => handleEditOpen(employee)} startIcon={<Edit />} />
                      <Button color="error" onClick={() => handleDelete(employee.employeeId)} startIcon={<Delete />} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Employee Dialog */}
        <Dialog open={editDialogOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogContent>
            <TextField label="Name" name="name" fullWidth value={selectedEmployee?.name || ""} onChange={handleEditChange} sx={{ mt: 2 }} />
            <TextField label="Department" name="department" fullWidth value={selectedEmployee?.department || ""} onChange={handleEditChange} sx={{ mt: 2 }} />
            <TextField label="Designation" name="designation" fullWidth value={selectedEmployee?.designation || ""} onChange={handleEditChange} sx={{ mt: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">Cancel</Button>
            <Button onClick={handleEditSubmit} color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EmployeeRecord;
