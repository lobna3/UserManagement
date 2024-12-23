import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = (props) => {
    console.log('Admin', props.user);  // Check the user data

    const [profiles, setProfiles] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [showModal, setShowModal] = useState(false);  // State to manage modal visibility
    const [selectedProfileId, setSelectedProfileId] = useState(null);  // Track the profile to delete

    // Function to fetch data from the API
    const fetchData = () => {
        const token = props.user.token || window.localStorage.getItem('jwt'); // Fallback to localStorage if token is not in user

        if (token) {
            axios.get('http://127.0.0.1:5000/api/users/profiles/getAll', {
                headers: {
                    'Authorization': ` ${token}`  // Pass token in Authorization header
                }
            })
                .then((response) => {
                    console.log(response.data);  // Log the response data
                    setProfiles(response.data);  // Update the profiles state
                })
                .catch((error) => {
                    console.error(error);  // Log any errors
                    if (error.response && error.response.status === 401) {
                        console.error("Unauthorized access, please log in again.");
                    }
                });
        } else {
            console.error("No token found, user is not authenticated.");
        }
    };

    // Function to handle delete
    const handleDeleteClick = (id) => {
        setSelectedProfileId(id);  // Set the profile ID to delete
        setShowModal(true);  // Show the confirmation modal
    };

    // Function to confirm deletion
    const deleteData = () => {
        const token = props.user.token || window.localStorage.getItem('jwt');
        if (token && selectedProfileId) {
            axios.delete(`http://127.0.0.1:5000/api/users/profiles/${selectedProfileId}`, {
                headers: {
                    'Authorization': `${token}`  // Include the token in the request header
                }
            })
                .then((response) => {
                    console.log(response.data.message);  // Log the success message
                    setRefetch(!refetch);  // Refresh the profiles list after delete
                    setShowModal(false);  // Hide the modal after deletion
                })
                .catch((error) => {
                    console.error(error);  // Log any errors
                    setShowModal(false);  // Hide the modal even if deletion fails
                });
        } else {
            console.error("No token found, unable to delete profile.");
        }
    };

    // Function to handle cancel
    const cancelDelete = () => {
        setShowModal(false);  // Hide the modal if the user cancels
    };

    // Use useEffect to fetch data when the component mounts or when refetch is triggered
    useEffect(() => {
        fetchData();  // Fetch the data when component is mounted or refetch changes
    }, [refetch]);

    return (
        <div className="container p-4 mt-4">
            <div className="row justify-content-evenly mt-4">
                <div className="col-lg-12 col-md-12 mt-4">
                    <div className="d-flex">
                        <i className="fa-solid fa-user fs-1 mx-2"></i>
                        <h2>Profiles List</h2>
                    </div>
                    <div className="shadow-lg p-3 mb-5 bg-body rounded" style={{ backgroundColor: "white" }}>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Telephone</th>
                                    <th scope="col">City</th>
                                    <th scope="col">Country</th>
                                    <th scope="col">Bio</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.length > 0 ? (
                                    profiles.map((profile) => (
                                        <tr key={profile.id}>
                                            <td>{profile.user.name}</td>
                                            <td>
                                                {profile.imageUrl ? (
                                                    <img
                                                        src={profile.imageUrl}
                                                        alt={profile.user.name}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <span>No image</span>
                                                )}
                                            </td>
                                            <td>{profile.user.email}</td>
                                            <td>{profile.user.role}</td>
                                            <td>{profile.tel}</td>
                                            <td>{profile.city}</td>
                                            <td>{profile.country}</td>
                                            <td>{profile.bio}</td>
                                            <td>
                                                <button className="btn btn-danger mx-1" onClick={() => handleDeleteClick(profile._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No profiles found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for confirmation */}
            {showModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this profile?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={deleteData}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;

