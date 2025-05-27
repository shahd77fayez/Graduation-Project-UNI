
import React from 'react';
import './AboutUs.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons'; 
import Navbar from "../../components/nav/Navbar";


const AboutUsPage = () => {
    return (
        <div className="Aboutsolid-background">
            <Navbar />
        <div className="ABOUTabout-container">
            
            <br/>
            <h1>About Us</h1>     
            
                <section>
                    <h2>Introduction</h2>
                    <div className="ABOUTunderline"></div>
                    <p>
                    Welcome to Truth Guard, your source for trendy news with advanced veracity and deep fake detection capabilities.
                     We are dedicated to providing reliable information and combating misinformation.
                    Our mission is to empower users with accurate news analysis tools to make informed decisions.

                    </p>
                </section>

                <section>
                    <div className="ABOUTh2">
                        <h2>What We Do</h2>
                    </div>                    
                    <div className="ABOUTunderline"></div>
                    <p>
                    At Truth Guard, we curate and display trending news articles while offering advanced tools 
                    for news verification and deep fake detection. Our platform empowers users to distinguish between 
                    accurate reporting and misinformation, ensuring they stay informed with trustworthy content.

                    </p>
                </section>

                <section>
                <div className="ABOUTh2">

                    <h2>Contact Us</h2>
                    </div>
                    <div className="ABOUTunderline"></div>
                    <p>
                        You can reach us via:
                        <ul>
                            <li>
                            <FontAwesomeIcon icon={faEnvelope} />  truthguard@gmail.com
                            </li>
                            <br/>
                            <li>
                            <FontAwesomeIcon icon={faPhoneAlt} />  +20 112 413 5000
                            </li>
                            
                        </ul>
                    </p>
                </section>


                <section>
                <div className="ABOUTh2">

                    <h2>Additional Information</h2>
                    </div>
                    <div className="ABOUTunderline1"></div>
                    <p>
                    We are a group of Software Engineering students at Cairo University who aspire to innovate and create impactful solutions
                     in the field of technology, and we aim that with this project we help in preserving the truth, and preventing fraud using the technologies we learnt.
                    <br/><br/>
                    For more details, please refer to our <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-of-service">Terms of Service</a>.
                    </p>
                </section>
        </div>
        </div>
    );
};

export default AboutUsPage;
