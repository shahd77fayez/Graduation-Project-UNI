import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { FaPen } from 'react-icons/fa';
import profileImage from '../../assets/1.png'; // Adjust the path as needed
import axiosInstance from '../../axiosInstance';
import Navbar from "../../components/nav/Navbar";
const ProfilePage = () => {
    const [userData, setUserData] = useState({
        email: '',
        age: '',
        bio: '',
        password: '',
        username: ''

    });
    const [password, setPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response =  await axiosInstance.get('/user/profile');
            if (response.status === 200) {
                const data =response.data;
                setUserData(data);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const updateData = { ...userData };
        if (password) {
            updateData.password = password;
        }
        try {
            const response =await  axiosInstance.post('/user/editProfile', updateData);
            if (response.status===200) {
                alert('User data updated successfully!');
                setIsEditing(false);
                fetchUserData(); // Refresh the user data
            } else {
                alert('Error updating user data');
            }
        } catch (error) {
            console.error('Error updating user data', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    return (

        <div className="solid-backgroundProf">
                <Navbar />
                <div className="gradient-backgroundProf">

                    <div className="profile-container">
                        {isEditing ? (
                            <form onSubmit={handleFormSubmit} className="profile-form">
                                <h1>Edit your profile</h1>
                                <div className="form-group-row">
                                    <div className="form-group name-group">
                                        <label htmlFor="username">Name</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={userData.username}
                                            onChange={handleChange}
                                            className="profile-input"
                                        />
                                    </div>
                                    <div className="form-group age-group">
                                        <label htmlFor="age">Age</label>
                                        <input
                                            type="number"
                                            id="age"
                                            name="age"
                                            value={userData.age}
                                            onChange={handleChange}
                                            className="profile-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-group-row">
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />
                                </div>
                                </div>
                                <div className="form-group-row">
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className="profile-input"
                                    />
                                </div>
                                </div>
                                <div className="form-group-row">
                                <div className="form-group">
                                    <label>Bio:</label>
                                    <input
                                        name="bio"
                                        value={userData.bio}
                                        onChange={handleChange}
                                        className="profile-input "
                                    />
                                </div>
                                </div>
                                <div className="button-container">
                                    <button type="submit" className="profile-button">Save Changes</button>
                                    <button type="button" className="profile-button-cancel" onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-view">
                                <button onClick={handleEditClick} className="profile-button edit-button">
                                    <FaPen />
                                </button>
                        
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <p1>Your Name</p1>
                                                <h1>{userData.username}</h1>
                                                <div className="underline"></div>
                                                <div className='info'><p><strong>Email:</strong> {userData.email}</p></div>
                                                <div className='info'><p><strong>Age:</strong> {userData.age}</p></div>
                                                <div className='info'><p><strong>Bio:</strong> {userData.bio}</p></div>
                                                
                                                
                                            </td>
                                            <td className="profile-image-cell">
                                                <img src={profileImage} alt="Profile" className="profile-image" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
        </div>
    );
};

export default ProfilePage;
