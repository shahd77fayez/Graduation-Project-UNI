// SearchPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar'; // Correct path to SearchBar.jsx within the same folder
import Navbar from "../../components/nav/Navbar"; // Correct import path for Navbar
import axiosInstance from '../../axiosInstance';
import './SeachPage.css'; // Correct path for SearchPage.css within the same folder


const SearchPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const navigate = useNavigate();

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`search?type=${query}`);
                console.log(response.data)
                if (Array.isArray(response.data)) {
                    setSearchResults(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setSearchResults([]);
                }
            } catch (error) {
                setError('Error fetching search results');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const handleSearch = (query) => {
        navigate(`/SearchPage?query=${query}`);
    };

    return (
        <div className="solid-backgroundSearch">
            <Navbar />
            <div className="gradient-backgroundSearch">
                <div className="SearchB2">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <h1>Searched for: {query}</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="results-columnSearch">
                        {searchResults.length > 0 ? (
                            searchResults.map((article, index) => (
                                <div key={index} className="result-cellSearch">
                                    <h2 className="result-titleSearch">{article.articlecontent}</h2>
                                    <h6 className="result-descriptionSearch">{article.articletype}</h6>
                                </div>
                            ))
                        ) : (
                            <p>No results found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;