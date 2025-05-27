import React from "react";
import Button from "@mui/material/Button";
import "./DeepFake.css";
import { GoCloud } from "react-icons/go";
import Navbar from "../../components/nav/Navbar";
import ClipLoader from 'react-spinners/ClipLoader';

const DeepFake = ({ onImageChange, onVideoChange, onHandleClick, videoPreview, PictPreview, pictureInput, videoInput, detection, loading, error }) => {
    return (
        <div className="solid-backgroundDF">
            <Navbar />
            <div className="dfbody">
                <div className="dfcontainer">
                    <h1>DeepFake Detection</h1>
                    <p>
                        Upload an image or a video and our advanced Machine Learning model will analyze the input and predict if it is a deepfake!
                    </p>
                    <div className="dfpicture_text_container">
                        <div className="dfpicture_container">
                            <h2>Upload Image</h2>
                            <div className="dfmedia_preview">
                                {pictureInput ? (
                                    <img src={PictPreview} alt="Image Preview" />
                                ) : (
                                    <GoCloud size={50} />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="dffileInput"
                                id="image-upload"
                                disabled={videoInput}
                            />
                            <label htmlFor="image-upload" className="dfuploadButton">
                                Upload Image
                            </label>
                        </div>
                        <div className="dfor_label">OR</div>
                        <div className="dfvideo_container">
                            <h2>Upload Video</h2>
                            <div className="dfmedia_preview">
                                {videoInput ? (
                                    <video controls>
                                        <source src={videoPreview} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <GoCloud size={50} />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={onVideoChange}
                                className="dffileInput"
                                id="video-upload"
                                disabled={pictureInput}
                            />
                            <label htmlFor="video-upload" className="dfuploadButton">
                                Upload Video
                            </label>
                        </div>
                    </div>
                    <br />
                    {/* Render loading spinner */}
                    {loading && (
                        <div className="loadingContainer">
                            <ClipLoader size={50} color={"#123abc"} loading={loading} />
                        </div>
                    )}
                    {/* Render error message */}
                    {error && <h2 style={{ color: 'red' }}>Error: {error}</h2>}
                    {/* Render model prediction result */}
                    {detection.label && (
                        <p>
                            Prediction: <strong>{detection.label}</strong> with confidence {detection.confidence}
                        </p>
                    )}
                    <br />
                    <div className="dfbutton_container">
                        <Button variant="contained" className='dfcustomButton' onClick={onHandleClick}>
                            Check
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeepFake;
