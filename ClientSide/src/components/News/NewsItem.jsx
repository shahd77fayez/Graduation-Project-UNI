import React, { useState, useEffect } from 'react';
import './NewsItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../axiosInstance';

const NewsItem = ({ news }) => {
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [commentError, setCommentError] = useState(''); // State for comment error
    const [favoriteError, setFavoriteError] = useState(''); // State for favorite error

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
        checkIfFavorite();
    }, [showComments]);

    const fetchComments = async () => {
        try {
            const response = await axiosInstance.get(`/getallcomments?articleid=${news.articleid}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const checkIfFavorite = async () => {
        try {
            const response = await axiosInstance.get(`/is_favorite?articleid=${news.articleid}`);
            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const handleCommentClick = () => {
        setShowComments(true);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSendComment = async () => {
        try {
            const response = await axiosInstance.post('/add_comment', {
                articleid: news.articleid,
                comment: comment
            });
            setCommentError('Comment is Added!');

            console.log(response.data.message);
            setComment(''); // Clear the input field
            fetchComments(); // Fetch updated comments
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setCommentError('You Must Login First!');
            } else {
                setCommentError('An error occurred while adding the comment');
            }
            console.error('Error adding comment:', error);
        }
    };

    const handleCloseComments = () => {
        setShowComments(false);
    };

    const handleFavClick = async () => {
        if (isFavorite) {
            return; // Do nothing if already a favorite
        }

        try {
            const response = await axiosInstance.post('/add_favorite', {
                articleid: news.articleid
            });
            setIsFavorite(true); // Set favorite state to true
            setFavoriteError(''); // Clear favorite error on success
            console.log(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setFavoriteError('You Must Login First!');
            } else {
                setFavoriteError('An error occurred while adding to favorites');
            }
            console.error('Error adding favorite:', error);
        }
    };

    return (
        <div className={`news-item ${showComments ? 'pop-up-active' : ''}`}>
            <h2 className="news-title">{news.articlecontent}</h2>

            <div className="news-header">
                <div className="date-container">
                    <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
                    <h4>{news.articledate}</h4>
                </div>
                <div className="icons-container">
                    <FontAwesomeIcon
                        icon={faComment}
                        onClick={handleCommentClick}
                        className="comment-icon"
                    />
                    <FontAwesomeIcon
                        icon={faHeart}
                        onClick={handleFavClick}
                        className={`favorite-icon ${isFavorite ? 'favorite' : ''}`} // Apply conditional class
                    />
                </div>
            </div>

            {favoriteError && <h2 className="error-message" style={{ color: 'red' }}>{favoriteError}</h2>} {/* Favorite error message */}

            {showComments && (
                <div className="comments-popup">
                    <div className="comments-header">
                        <h3>Comments</h3>
                        <button onClick={handleCloseComments} className="close-comments">X</button>
                    </div>
                    <div className="comments-list">
                        {comments.map((comment, index) => (
                            <div key={index} className="comment-item">
                                <h5>{comment.commentusername}</h5>
                                <div className="comment-info">
                                    <p>{comment.content}</p>
                                    <div className="Commentdate-container">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="Newscalendar" />
                                        <span>{comment.commentdate}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="add-comment">
                        <textarea
                            placeholder="Add a comment..."
                            onChange={handleCommentChange}
                            value={comment}
                        ></textarea>
                        <button
                            className="submit-comment"
                            onClick={handleSendComment}
                        >Submit</button>

                        {commentError && <h2 className="error-message" style={{ color: 'red' }}>{commentError}</h2>} {/* Comment error message */}

                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsItem;
