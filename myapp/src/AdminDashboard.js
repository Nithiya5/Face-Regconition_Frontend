import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Welcome, Admin</h2>
      <p>Manage users, view reports, and configure system settings.</p>

      <div className="dashboard-links">
        <Link to="/manage-users" className="dashboard-btn">Manage Users</Link>
        <Link to="/reports" className="dashboard-btn">View Reports</Link>
        <Link to="/" className="dashboard-btn logout">Logout</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
