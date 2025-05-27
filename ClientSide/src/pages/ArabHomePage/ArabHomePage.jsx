import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './ArabHomePage.css';
import Navbar from "../../components/nav/Navbar";
import ButtonContainerArab from "../../components/CategoriesButtonHelper/ButtonContainerArab";
import NewsList from "../../components/News/NewsList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from '../../axiosInstance';
import Footer from "../../components/footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
const Home = () => {
    const [selectedCategoryArab, setSelectedCategoryArab] = useState('World'); // Default category
    const [filteredNews, setFilteredNews] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('ar'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categoryText, setCategoryText] = useState('العالم'); // Default category text in Arabic
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
            console.log(response.data)
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
        fetchNews(selectedCategoryArab, selectedLanguage);
        setFilteredNews(selectedCategoryArab,selectedLanguage);
    }, [selectedCategoryArab,selectedLanguage]); // Empty dependency array to run only once on mount

    const handleCategoryChange = (category) => {
        setSelectedCategoryArab(category);
        setCategoryText(categoryMappingArab[category]);
        fetchNews(category);

    };

    // Mapping object to map category to its Arabic name
    const categoryMappingArab = {
        World: 'العالم',
        Sports: 'الرياضة',
        Economy: 'الاقتصاد',
        Culture: 'الثقافه و الفنون',
        Health: 'الصحه و العلوم',
        Technology: 'التكنولوجيا'
    };

    // const navigate = useNavigate();  // Use useNavigate to get the navigate function

    const switchToEnglish = () => {
        setSelectedLanguage('en'); // Set language to Arabic
        navigate("/")
    };
    const handleSearch = (query) => {
        navigate(`/SearchPage?query=${query}`);
    };

    return (
        <div className="solid-backgroundArab" >
            <div className="gradient-backgroundArab">
                <Navbar />
                <div className="searchBarArab">
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div dir="rtl">
            
                    <div className="contentArab">
                        <div className="language-switcherArab" onClick={switchToEnglish}>
                            <FontAwesomeIcon icon={faLanguage} />
                            <span> English</span>
                        </div>
                        <h1>أخبار {categoryText}</h1>
                    </div>
                    <div className="BCArab">
                        <ButtonContainerArab selectedCategory={selectedCategoryArab} onCategoryChange={handleCategoryChange} />
                    </div>
                    <div className="newsArab">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <NewsList newsData={filteredNews} />
                    )}
                    </div>
                </div>

                <div className="footerHome">
                    <Footer />
                </div>

            </div>
        </div>
    );
}

export default Home;
