import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = (props) => {
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalProfiles: 0,
     
    });

    // Fetch statistics data (could be from an API endpoint)
    const fetchStats = () => {
        const token = props.user.token || window.localStorage.getItem('jwt'); // Fallback to localStorage if token is not in user
        if (token) {
            axios.get('http://127.0.0.1:5000/api/users/profiles/admin', {
                headers: {
                    'Authorization': ` ${token}`,
                }
            })
                .then((response) => {
                    setStatistics(response.data);  // Set statistics data
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        fetchStats();  // Fetch statistics when component is mounted
    }, []);

    return (
        <div className="container p-5 mt-4">
            <h2 className="text-center text-primary mb-4">Admin Dashboard</h2>
            
            {/* Statistics Cards */}
            <div className="row mt-4">
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card shadow-lg border-0 rounded-3 p-4">
                        <h5 className="card-title text-muted">Total Users</h5>
                        <h3 className="card-text text-primary">{statistics.totalUsers}</h3>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card shadow-lg border-0 rounded-3 p-4">
                        <h5 className="card-title text-muted">Total Profiles</h5>
                        <h3 className="card-text text-success">{statistics.totalProfiles}</h3>
                    </div>
                </div>
               
            </div>

            {/* Recent Activities and Profiles Section */}
            <div className="row mt-5">
                <div className="col-lg-6 col-md-6 mb-4">
                    <div className="card shadow-lg border-0 rounded-3 p-4">
                        <h5 className="card-title text-muted">Recent Profiles</h5>
                        <ul className="list-unstyled">
                            {/* You can replace this with actual profile data from API */}
                            <li><Link to="/admin" className="text-decoration-none text-primary">View All Profiles</Link></li>
                            <li><Link to="/profile" className="text-decoration-none text-primary">Edit Your Profile</Link></li>
                        </ul>
                    </div>
                </div>
            
            </div>
        </div>
    );
};

export default Dashboard;

