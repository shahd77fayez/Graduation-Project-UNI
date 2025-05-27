// ButtonContainer.jsx
import React from 'react';
import ButtonWithBackground from './ButtonwithbackgroundArab';
import './ButtonContainerArab.css';
import sportsImage from './sportsBlack.jpg';
import economyImage from './economyBlack.jpg';
import healthImage from './healthBlack.jpg';
import techImage from './techBlack.jpg';
import entertainmentImage from './entertBlack.jpg';


const ButtonContainerArab = ({ selectedCategory, onCategoryChange }) => {
    const buttonDataArab = [
        { text: 'الرياضة', image: sportsImage, category: 'Sports' },
        { text: 'الاقتصاد', image: economyImage, category: 'Economy' },
        { text: 'التكنولوجيا', image: techImage, category: 'Technology' },
        { text: 'الثقافة و الفنون', image: entertainmentImage, category: 'Culture' },
        { text: 'الصحة و العلوم', image: healthImage, category: 'Health' }
    ];

    return (
        <div className="button-containerArab">
            {buttonDataArab.map((button, index) => (
                <ButtonWithBackground
                    key={index}
                    text={button.text}
                    backgroundImage={button.image}
                    onClick={() => onCategoryChange(button.category)}
                    isSelected={button.category === selectedCategory} // Pass if the button is selected

                />
            ))}
        </div>
    );
};

export default ButtonContainerArab;
