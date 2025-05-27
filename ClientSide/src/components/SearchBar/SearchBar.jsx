// SearchBar.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css'; // Import the CSS for styling

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setQuery(event.target.value);
        console.log('Search triggered with query:', query); // Debugging statement
    };

    const handleSearch = () => {
        console.log('Search triggered with query:', query); // Debugging statement
        if (onSearch) {
            onSearch(query);
            navigate(`/SearchPage?query=${query}`);
        } else {
            console.error('onSearch function is not provided');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="Xsearch-bar">
            <FontAwesomeIcon icon={faSearch} className="Xsearch-icon" onClick={handleSearch} />
            <input
                type="text"
                placeholder="Search"
                className="Xsearch-input"
                value={query}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};
export default SearchBar;