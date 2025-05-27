import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import './FavPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHeart } from '@fortawesome/free-solid-svg-icons'; 
import axiosInstance from '../../axiosInstance';
import Navbar from "../../components/nav/Navbar";
const FavPage = () => {
    const [favourites, setFavourites] = useState([]);
    const history = useNavigate(); // Initialize useHistory for navigation

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const response = await axiosInstance.get('/getfavbyid');
                if (response.status === 200) {
                    const data =response.data;
                    setFavourites(data);
                }
                else {
                    console.error('Error fetching favourites, status code:', response.status);
                }
            } catch (error) {
                console.error('Error fetching favourites', error);
            }
        };

        fetchFavourites();
    }, []);

    const handleRemoveFavourite = async (articleId) => {
        let url = `/remove_favorite?type=${articleId}`;
        try {
            const response = await axiosInstance.delete(url);
            if (response.status===200) {
                setFavourites(favourites.filter(article => article.articleid !== articleId));
            } else {
                console.error('Error removing favourite, status code:', response.status);
            }
        } catch (error) {
            console.error('Error removing favourite', error);
        }
    };
    return (

        <div className="solid-backgroundFav">
                <Navbar />
                <div className="gradient-backgroundFav">
            
                    <h2>Your favourites</h2>
                    <div className="article-listFav">
                        {favourites.map(article => (
                            <div key={article.articleid} className="article-containerFav">
                                <h2>{article.articlecontent}</h2>
                                <p>{article.articletype}</p>
                                <button onClick={() => handleRemoveFavourite(article.articleid)}>
                                <FontAwesomeIcon icon={faHeart} className="favorite-iconFav" />                        
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
        
    );
};

export default FavPage;
