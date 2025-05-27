import React from "react";
import Button from "@mui/material/Button";
import styles from "../NewsVaricity/NewsVaricity.module.css";
import { GoCloud } from "react-icons/go";
import Navbar from "../../components/nav/Navbar";
import ClipLoader from 'react-spinners/ClipLoader';

const HandleVeracityPage = ({ userInput, onTextChange, onImageChange, OnHandleClick, picturePreview, pictureInput , error, detection, web, loading }) => {
    
    const handleTextChange = (event) => {
        onTextChange(event.target.value);
    };

    const handlePictureChange = (event) => {
        onImageChange(event.target.files[0]);
    };

    const handleClick = () => {
        OnHandleClick();
    };

    return (
        <div className={styles.solidbackgroundNEWS}>
            <Navbar />
            <div className={styles.body}>
                <div className={styles.container}>
                    <h1>News Veracity</h1>
                    <p>
                        Enter the text of a news article or upload a clear picture of it and our advanced Machine Learning model will analyze the input and predict the accuracy, helping you determine its veracity!
                    </p>

                    <div className={styles.picture_text_container}>
                        <div className={styles.picture_container}>
                            <h2>News Picture</h2>
                            {pictureInput ? (
                                <div className={styles.picture}>
                                    <img src={picturePreview} alt="Preview" />
                                </div>
                            ) : (
                                <div className={styles.picture}>
                                    <GoCloud />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePictureChange}
                                className={styles.fileInput}
                                id="file-upload"
                                disabled={userInput.length > 0} 
                            />
                            <label htmlFor="file-upload" className={styles.uploadButton}>
                                Upload Picture
                            </label>
                        </div>
                        <div className={styles.or_label}>OR</div>
                        <div className={styles.text_container}>
                            <h2>News Text</h2>
                            <textarea
                                className={styles.text}
                                onChange={handleTextChange}
                                value={userInput}
                                disabled={pictureInput} 
                            ></textarea>
                        </div>
                    </div>
                    <div className={styles.button_container}>
                        <Button variant="contained" className={styles.customButton} onClick={handleClick}>
                            Check
                        </Button>
                    </div>
                    <br/>
                    <br/>
                    {/* Render loading spinner */}
                    {loading && (
                        <div className={styles.loadingContainer}>
                            <ClipLoader size={50} color={"#123abc"} loading={loading} />
                        </div>
                    )}
                
                    {/* Render error message */}
                    {error && <h2 style={{ color: 'red' }}>Error: {error}</h2>}
                    
                    {/* Render model prediction result */}
                    {detection.label && (
                        <div>
                            <p>Prediction: <strong>{detection.label}</strong> with confidence {detection.confidence}</p>
                        </div>
                    )}
                    
                    {/* Render web search result */}
                    {web.apiName && (
                        <div>
                            <p>Found in: <strong>{web.apiName}</strong></p>
                            <p>Title: <a href={web.link} target="_blank" rel="noopener noreferrer">{web.title}</a></p>
                            <p>Source: {web.source}</p>
                            <p>Snippet: {web.snippet}</p>
                        </div>
                    )}
                
                </div>
            </div>
        </div>
    );
};

export default HandleVeracityPage;
