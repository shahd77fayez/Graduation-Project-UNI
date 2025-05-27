import React from 'react';
import './ButtonwithbackgroundArab.css';

const ButtonwithbackgroundArab = ({ text, onClick ,backgroundImage ,isSelected}) => {
    return (
        <div >
            <button className={`custom-buttonArab ${isSelected ? 'selectedArab' : ''}`} onClick={onClick}  style={{ backgroundImage: `url(${backgroundImage})` }}>
                <span>{text}</span>
            </button>
        </div>



    );
};

export default ButtonwithbackgroundArab;
