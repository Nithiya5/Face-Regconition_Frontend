import React, { useState } from "react";
import { Button, Container, Typography, Grid, Box, Paper, TextField, List, ListItem, ListItemText } from "@mui/material";
import Sidebar from "./Sidebar";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>

      <Grid item xs={10}>
        <Container maxWidth="md" sx={{ padding: 3 }}>
          <Paper
            elevation={3}
            sx={{ padding: 3, borderRadius: 2, backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h5" align="center" sx={{ color: "#283593" }}>
              To-Do List
            </Typography>

            <Box sx={{ mt: 3 }}>
              <TextField
                label="Add a new task"
                variant="outlined"
                fullWidth
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={addTask}
              >
                Add Task
              </Button>

              <List sx={{ mt: 3 }}>
                {tasks.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default EmployeeDashboard;