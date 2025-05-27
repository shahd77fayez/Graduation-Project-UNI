// ButtonContainer.jsx
import React from 'react';
import ButtonWithBackground from './Buttonwithbackground';
import './ButtonContainer.css';
import sportsImage from './sportsBlack.jpg';
import fashionImage from './fashionBlack3.jpg';
import techImage from './techBlack.jpg';
import businessImage from './businessBlack.jpg';
import entertainmentImage from './entertBlack.jpg';


const ButtonContainer = ({ selectedCategory, onCategoryChange }) => {
    const buttonData = [
        { text: 'Business', image: businessImage, category: 'Business' },
        { text: 'Sports', image: sportsImage, category: 'Sports' },
        { text: 'Fashion', image: fashionImage, category: 'Fashion' },
        { text: 'Technology', image: techImage, category: 'Technology' },
        { text: 'Entertainment', image: entertainmentImage, category: 'Entertainment' }
    ];

    return (
        <div className="button-containerENG">
            {buttonData.map((button, index) => (
                <ButtonWithBackground
                    key={index}
                    text={button.text}
                    backgroundImage={button.image}
                    onClick={() => onCategoryChange(button.category)}
                    isSelected={button.text === selectedCategory} // Pass if the button is selected

                />
            ))}
        </div>
    );
};

export default ButtonContainer;
