import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table, TableHead, TableRow, TableCell, TableBody, CircularProgress,
  TextField, Typography, Paper, TableContainer, Box, Alert, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Avatar, Divider, Toolbar
} from "@mui/material";
import { Dashboard, People, BarChart, History, ExitToApp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [date]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://face-regconition-backend.onrender.com/api/admin/logs", {
        params: { date: date ? new Date(date).toISOString().split("T")[0] : undefined },
        headers: `{ Authorization: Bearer ${localStorage.getItem("token")} }`,
      });
      setLogs(response.data.logs);
    } catch (error) {
      setError("Failed to fetch logs. Please try again later.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F4F6F8", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#283593",
            color: "white",
          },
        }}
      >
        <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
          <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: "lightgrey" }} />
          <Typography variant="h6">Admin</Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: "1" }} />
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
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "#1E293B", mb: 2 }}>
  Employee Logs <span style={{ fontSize: "1rem", fontWeight: "normal", color: "#6B7280" }}><br></br>"Tracking every step with precision & reaching the destiny."</span>
</Typography>

          <TextField
            type="date"
            label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ mb: 3, width: "100%" }}
          />
          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          ) : (
            <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#283593" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: "#F3F4F6" } }}>
                      <TableCell>{log.employeeId}</TableCell>
                      <TableCell>{log.isLive ? "Live Entry" : "Regular Entry"}</TableCell>
                      <TableCell>{new Date(log.entryTime).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Logs;