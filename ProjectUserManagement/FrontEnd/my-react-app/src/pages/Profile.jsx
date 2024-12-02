import React, { useEffect, useState } from "react";
import axios from 'axios';

const Profile = (props) => {
    const [profile, setProfile] = useState({});
    const [refetch, setRefetch] = useState(false);

    const [tel, setTel] = useState(profile.tel || "");
    const [city, setCity] = useState(profile.city || "");
    const [country, setCountry] = useState(profile.country || "");
    const [address, setAddress] = useState(profile.address || "");
    const [bio, setBio] = useState(profile.bio || "");
    const [postalcode, setPostalCode] = useState(profile.postalcode || "");
    const [imageUrl, setImageUrl] = useState(profile.imageUrl || "");
    const [file, setFile] = useState(null);

    const fetchData = () => {
        const token = props.user?.token || window.localStorage.getItem('jwt');
        if (token) {
            axios.get('http://127.0.0.1:5000/api/users/profiles/profile', {
                headers: { 'Authorization': `${token}` }
            }).then((response) => {
                setProfile(response.data);
                setTel(response.data.tel || "");
                setCity(response.data.city || "");
                setCountry(response.data.country || "");
                setAddress(response.data.address || "");
                setBio(response.data.bio || "");
                setPostalCode(response.data.postalcode || "");
                setImageUrl(response.data.imageUrl || "");
            }).catch((error) => {
                console.error(error);
            });
        } else {
            console.error("No token found, user is not authenticated.");
        }
    };

    const postProfile = async (formData) => {
        const token = props.user?.token || window.localStorage.getItem('jwt');
        if (token) {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/users/profiles/upload', formData, {
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
                console.log('Profile updated:', response.data);
                setRefetch(!refetch);  // Trigger refetch to update profile
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("No token found, user is not authenticated.");
        }
    };

    useEffect(() => {
        if (props.user?.id) {
            fetchData();
        } else {
            console.error("User is not authenticated.");
        }
    }, [props.user?.id, refetch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("tel", tel);
        formData.append("city", city);
        formData.append("country", country);
        formData.append("address", address);
        formData.append("bio", bio);
        formData.append("postalcode", postalcode);
    
        if (file) {
            console.log("File selected:", file);  // Check if file is selected
            formData.append("my_file", file);
        } else {
            formData.append("imageUrl", imageUrl);
        }
    
        postProfile(formData);
    };
   console.log('user Profile',profile)

    return (
        <div className="container p-4 mt-4">
            <div className="row justify-content-center mt-4">
                <div className="col-lg-8 col-md-12 mt-4">
                    <div className="d-flex align-items-center mb-4">
                        <i className="fa-solid fa-user fs-1 mx-2 text-primary"></i>
                        <h2 className="text-primary">Profile</h2>
                    </div>
                    <div className="p-6 shadow-lg p-3 mb-5 bg-white rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Telephone</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Country</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Postal Code</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={postalcode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Bio</label>
                                <textarea
                                    className="form-control rounded-3"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Upload Image</label>
                                <div className="d-flex justify-content-center mb-3">
                                    <img 
                                        src={imageUrl || "https://via.placeholder.com/150"} 
                                        alt="Profile"
                                        className="w-32 h-32 object-cover rounded-circle border-4 border-primary shadow-lg" 
                                    />
                                </div>
                                <input 
                                    type="file" 
                                    className="form-control rounded-3"
                                    onChange={(e) => setFile(e.target.files[0])} 
                                />
                            </div>
                            <button type="submit" className="btn btn-outline-primary w-100 py-2 mt-4 rounded-3">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;





