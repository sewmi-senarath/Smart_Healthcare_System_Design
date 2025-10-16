import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div style={{ width: 200, background: '#f4f4f4', height: '100vh', padding: 20 }}>
    <h2>Admin Panel</h2>
    <nav>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/appointments">Appointments</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
