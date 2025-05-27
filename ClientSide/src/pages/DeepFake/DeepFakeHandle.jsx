import React, { useState, useEffect } from 'react';
import DeepFake from "./DeepFake";
import axiosInstance from '../../axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader';

const DeepfakePage = () => {
    const [prediction, setPrediction] = useState({ label: '' });
    const [picture, setPicture] = useState(null);
    const [video, setVideo] = useState(null);
    const [Imgpreview, setImgPreview] = useState(null);
    const [Vidpreview, setVidPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (picture) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            reader.readAsDataURL(picture);
        }
    }, [picture]);

    useEffect(() => {
        if (video) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVidPreview(reader.result);
            };
            reader.readAsDataURL(video);
        }
    }, [video]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setPicture(file);
        setVideo(null); // Clear the video if an image is selected
    };

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        setVideo(file);
        setPicture(null); // Clear the image if a video is selected
    };

    const handleVideoSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('video', video);
        try {
            const response = await axiosInstance.post('/VideoPredict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            setPrediction({ label: response.data.label, confidence: response.data.confidence });
            if (response.status === 204) {
                setError("YOU MUST BE LOGGED IN");
            } 
        } catch (error) {
            setLoading(false);
            setError("There was an error submitting the video.");
        }
    };

    const handleImageSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', picture);
        try {
            const response = await axiosInstance.post('/ImagePredict', formData);
            setLoading(false);
            setPrediction({ label: response.data.label, confidence: response.data.confidence });
            if (response.status === 204) {
                setError("YOU MUST BE LOGGED IN");
            } 
        } catch (error) {
            setLoading(false);
            setError("There was an error submitting the image.");
        }
    };

    const handleClick = () => {
        setPrediction({ label: '', confidence: 0 }); // Clear previous predictions
        setError(null);
        if (picture) {
            handleImageSubmit();
        } else if (video) {
            handleVideoSubmit();
        }
    };

    return (
        <div>
            <DeepFake 
                videoPreview={Vidpreview}
                PictPreview={Imgpreview}
                pictureInput={picture}
                videoInput={video}
                onImageChange={handleImageChange}
                onVideoChange={handleVideoChange}
                onHandleClick={handleClick}
                detection={prediction}
                loading={loading} // Pass the loading state
                error={error} // Pass the error state
            />
        </div>
    );
};

export default DeepfakePage;
