import React from 'react';
import './Buttonwithbackground.css';

const Buttonwithbackground = ({ text, onClick ,backgroundImage ,isSelected}) => {
    return (
        <div >
            <button className={`custom-button ${isSelected ? 'selected' : ''}`} onClick={onClick}  style={{ backgroundImage: `url(${backgroundImage})` }}>
                <span>{text}</span>
            </button>
        </div>



    );
};

export default Buttonwithbackground;
