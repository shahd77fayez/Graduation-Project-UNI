import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import './History.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faHeart, faHistory } from '@fortawesome/free-solid-svg-icons'; 
import axiosInstance from '../../axiosInstance';
import Navbar from "../../components/nav/Navbar";
const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axiosInstance.get('/getHistById');
                if (response.status === 200) {
                    const data =response.data;
                    setHistory(data);
                }
                else {
                    console.error('Error fetching history, status code:', response.status);
                }
            } catch (error) {
                console.error('Error fetching history', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        
        <div className="solid-backgroundHistory">
             <Navbar />
             <div className="gradient-backgroundHistory">
               
               <h2>Your History</h2>
               <div className="Historyarticle-list">
                   {history.map(article => (
                       <div key={article.historyid} className="Historyarticle-container">
                           <h4>{article.articlehistorycontent}</h4>
                           <p>{article.checktype}</p>
                           <p>{article.veracityresult}</p>
                          
                           <div className="Historydate-container">
                           <FontAwesomeIcon icon={faHistory} className="hHistory-icon" />   
                           <p>{article.historydate}</p>                     
                           </div>
                       </div>
                   ))}
               </div>

             </div>
        </div>

            
    );
};

export default History;
