import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './Home.css';
import Navbar from "../../components/nav/Navbar";
import ButtonContainer from "../../components/CategoriesButtonHelper/ButtonContainer";
import NewsList from "../../components/News/NewsList";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axiosInstance from '../../axiosInstance';
import Footer from "../../components/footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('World'); // Default category
    const [selectedLanguage, setSelectedLanguage] = useState('en'); 
    const [filteredNews, setFilteredNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate =useNavigate()


    const fetchNews = async (category,lang) => {
        setLoading(true);
        setError(null);
        try {
            let url = `/getarticlesbytype?type=${category}`;
            if (lang) {
                url += `&lang=${lang}`;
            }
            console.log("Fetching news from:", url);
            const response = await axiosInstance.get(url);
            console.log(response.data.articles);
            if (Array.isArray(response.data)) {
                console.log(response.data)
                setFilteredNews(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setFilteredNews([]);
            }
        } catch (error) {
            setError('Error fetching news data');
        } finally {
            setLoading(false);
        }
    };


    // Set initial news data to 'World'
    useEffect(() => {
        fetchNews(selectedCategory, selectedLanguage);
        setFilteredNews(selectedCategory,selectedLanguage);
    }, [selectedCategory,selectedLanguage]); // Empty dependency array to run only once on mount
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        fetchNews(category);
    };
    // const navigate = useNavigate();  // Use useNavigate to get the navigate function
    const switchToArabic = () => {
        setSelectedLanguage('ar'); // Set language to Arabic
        navigate("/ArabHomePage")

    };
    const handleSearch = (query) => {
        navigate(`/SearchPage?query=${query}`);
    };


    return (
        <div className="solid-backgroundEng">
            <div className="gradient-backgroundEng">
                <Navbar />
                <div className="searchBarEng">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <div className="language-switcherEng" onClick={switchToArabic}>
                    <FontAwesomeIcon icon={faLanguage} />
                    <span> العربية</span>
                </div>
                <div className="contentEng">
                    <h1>{selectedCategory} News</h1>
                </div>
                <div className="BCEng">
                    <ButtonContainer selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                </div>
                <div className="newsEng">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <NewsList newsData={filteredNews} />
                    )}
                </div>
                <div className="footerHome">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Home;
