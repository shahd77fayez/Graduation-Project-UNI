// src/components/Navbar/Navbar.js
import React, { useState, useContext } from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faHeart, faHistory, faSignInAlt, faSignOutAlt, faTimes, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import profilePic from './oklogin2.png';
import profilelock from './lockedlogin3.png';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isSignedIn, signOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            await axiosInstance.post("/logout");
            console.log("Logged out successfully.");
        } catch (error) {
            console.error("Error logging out:", error);
        }
        signOut();
        localStorage.removeItem('isSignedIn'); // Clear local storage
        navigate("/");
    };

    const handleLogoutClick = (event) => {
        event.preventDefault();
        logoutUser();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="navbarISA">
                <div className="navbar-logoISA">
                    <a href="/" className="logo-linksISA">Truth Guard</a>
                </div>
                <ul className={`nav-menuISA ${isMenuOpen ? 'active' : ''}`}>
                    <li className="nav-itemISA">
                        <a href="/" className="nav-linksISA">Home</a>
                    </li>
                    <li className="nav-itemISA">
                        <a href="/VeracityPage" className="nav-linksISA">News Veracity</a>
                    </li>
                    <li className="nav-itemISA">
                        <a href="/Deepfake" className="nav-linksISA">Deepfake Detection</a>
                    </li>
                    <li className="nav-itemISA">
                        <a href="/AboutUsPage" className="nav-linksISA">About Us</a>
                    </li>
                </ul>
                <div className="profile-iconISA">
                    <FontAwesomeIcon icon={faUserCircle} onClick={toggleMenu} />
                </div>
            </nav>

            {isMenuOpen && (
                <>
                    <div className={`overlayISA ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
                    <div className={`popup-menuISA ${isMenuOpen ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faTimes} className="close-iconISA" onClick={closeMenu} />
                        {isSignedIn ? (
                            <div>
                                <ul>
                                    <li>
                                        <FontAwesomeIcon icon={faUserCircle} />
                                        <a href="/profile">Profile</a>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faHistory} />
                                        <a href="/History">History</a>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faHeart} />
                                        <a href="/fav">Favourite</a>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                        <a href="/" onClick={handleLogoutClick}>
                                            Sign Out<button type="button"></button>
                                        </a>
                                    </li>
                                </ul>
                                <img src={profilePic} alt="Profile" className="profile-photoISA" />
                            </div>
                        ) : (
                            <>
                                <ul>
                                    <li>
                                        <FontAwesomeIcon icon={faSignInAlt} />
                                        <a href="/login">Sign In</a>
                                    </li>
                                    <li>
                                        <FontAwesomeIcon icon={faUserPlus} />
                                        <a href="/signup">Sign Up</a>
                                    </li>
                                </ul>
                                <img src={profilelock} alt="Profile" className="lock-photoISA" />
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
