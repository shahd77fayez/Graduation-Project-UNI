// Footer.jsx
import React from "react";
import './Footer.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // Import the CSS file for styling
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
    return (
        <footer className="Xfooter">
            <div className="Xfooter-content">
                <p>© 2024 JASMN. All rights reserved.</p>

                <div className="Xsocial-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} /> Facebook
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} /> Twitter
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                    </a>
                </div>
                <div className="Xinfo">
                    <p>Your trusted source for news veracity and deep-fake detection
                        <br/>
                    </p>
                </div>
                <div className="Xfooter-links">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms-of-service">Terms of Service</a>
                    <a href="/contact">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
