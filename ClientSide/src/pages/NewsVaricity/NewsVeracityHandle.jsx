import React, { useState, useEffect } from 'react';
import HandleVeracityPage from "./NewsVaricity";
import axiosInstance from '../../axiosInstance';

const VeracityPage = () => {
    const [NewsToPredict, setNewsToPredict] = useState("");
    const [detection, setDetection] = useState([]);
    const [web, setWeb] = useState([]);
    const [picture, setPicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (picture) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(picture);
        }
    }, [picture]);

    const handleTextChange = (inputValue) => {
        setNewsToPredict(inputValue);
    };

    const handleImageChange = (file) => {
        setPicture(file);
    };

    const handleFormSubmit = async () => {
        try {
            const response = await axiosInstance.post('/Predict', { news: NewsToPredict });
            if (response.status === 200) {
                setDetection(response.data);
            } else if (response.status === 201) {
                setWeb(response.data);
            } else if (response.status === 205) {
                setError("This language is not detected");
            }
        } catch (error) {
            setError("There was an error processing your request");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSubmit = async () => {
        const formData = new FormData();
        formData.append('image', picture);
        try {
            const response = await axiosInstance.post('/OCRPredict', formData);
            if (response.status === 200) {
                setDetection(response.data);
            } else if (response.status === 201) {
                setWeb(response.data);
            } else if (response.status === 205) {
                setError("This language is not detected");
            }
        } catch (error) {
            setError("There was an error processing your request");
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        setError("");
        setDetection([]);
        setWeb([]);
        setLoading(true);
        
        if (NewsToPredict) {
            handleFormSubmit();
        } else if (picture) {
            handleImageSubmit();
        } else {
            setLoading(false);
            setNewsToPredict("");
            setPicture(null);
            setPreview(null);
        }
    };

    return (
        <div>
            <HandleVeracityPage
                userInput={NewsToPredict}
                picturePreview={preview}
                pictureInput={picture}
                onImageChange={handleImageChange}
                onTextChange={handleTextChange}
                OnHandleClick={handleClick}
                error={error}
                detection={detection}
                web={web}
                loading={loading}
            />
        </div>
    );
};

export default VeracityPage;
