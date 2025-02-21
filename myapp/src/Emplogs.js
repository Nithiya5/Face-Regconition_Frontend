import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableHead, TableRow, TableCell, TableBody, CircularProgress,
  Button, TextField, Select, MenuItem, Typography, Paper, TableContainer, Box, Alert
} from "@mui/material";
import Sidebar from "./Sidebar";

const Emplogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [date, page, limit]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://face-regconition-backend.onrender.com/api/employee/logs", {
        params: { date: date ? new Date(date).toISOString().split("T")[0] : undefined, page, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLogs(response.data.logs);
      setHasMore(response.data.logs.length === limit);
    } catch (error) {
      setError("Failed to fetch logs. Please try again later.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("https://face-regconition-backend.onrender.com/api/employee/attendance-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch attendance stats", error);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.get("https://face-regconition-backend.onrender.com/api/employee/logs/export", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee_logs.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError("Failed to export logs. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "white"}}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3, ml: { xs: 0, md: "250px" }, backgroundColor: "white" }}>  
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          Employee Logs
        </Typography>

        {stats && (
          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2, p: 2, border: "1px solid #1976D2", borderRadius: 1 ,color:"black"}}>
            <Typography>Total Business Days: {stats.totalBusinessDays}</Typography>
            <Typography>Present Days: {stats.presentDays}</Typography>
            <Typography>Absent Days: {stats.absentDays}</Typography>
            <Typography>Attendance Percentage: {stats.attendancePercentage}</Typography>
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} variant="outlined" sx={{ width: "200px" }} />
          <Button variant="contained" color="primary" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting..." : "Export Logs"}
          </Button>
        </Box> */}

        <TableContainer component={Paper} sx={{ borderRadius: 0, backgroundColor: "white" }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#1976D2" }}>
                  {["Entry Time", "Exit Time", "Device ID", "Location", "Is Live", "Spoof Attempt"].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: "bold", color: "white" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length > 0 ? logs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell>{new Date(log.entryTime).toLocaleString()}</TableCell>
                    <TableCell>{log.exitTime ? new Date(log.exitTime).toLocaleString() : "Not Checked Out"}</TableCell>
                    <TableCell>{log.deviceId}</TableCell>
                    <TableCell>{log.location ? `${log.location.coordinates[1]}, ${log.location.coordinates[0]}` : "N/A"}</TableCell>
                    <TableCell>{log.isLive ? "Yes" : "No"}</TableCell>
                    <TableCell>{log.spoofAttempt ? "Yes" : "No"}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      No logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
          <Button variant="contained" color="secondary" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
            Previous
          </Button>
          <Typography sx={{ mx: 2 }}>Page {page}</Typography>
          <Button variant="contained" color="secondary" disabled={!hasMore} onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
          <Select value={limit} onChange={(e) => setLimit(e.target.value)} sx={{ ml: 2, height: 40 }}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default Emplogs;