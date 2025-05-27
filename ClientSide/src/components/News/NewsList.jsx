import React from 'react';
import NewsItem from './NewsItem';

const NewsList = ({ newsData }) => {
    if (!Array.isArray(newsData)) {
        console.error('Expected newsData to be an array but got:', newsData);
        return null;
    }
    return (
        <div className="news-list">
            {newsData.map((news, index) => (
                <NewsItem key={index} news={news} />
            ))}
        </div>
    );
};

export default NewsList;
