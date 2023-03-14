import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Display from './Display';
import { QuestionContext } from '../context/QuestionContext';

const FetchData = () => {
    const { questions, setQuestions } = useContext(QuestionContext);
    const [keysIndex, setKeysIndex] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [chapterTitle, setChapterTitle] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/question/${chapterTitle}`, {
                params: { keysIndex: keysIndex, chapterIndex: chapterIndex },
            });
            console.log('response.data', response.data);
            setQuestions(response.data);
        } catch (error) {
            console.log('Error broke out', error);
        }
    };

    useEffect(() => {
        console.log("questions from useEffect", questions);
    }, [questions, location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchData();
        navigate('/display');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter the keys index number:</label>
                <input
                    type='text'
                    value={keysIndex}
                    name={keysIndex}
                    onChange={(e) => setKeysIndex(e.target.value)}
                />
                <label>Enter the chapter index number:</label>
                <input
                    type='text'
                    value={chapterIndex}
                    name={chapterIndex}
                    onChange={(e) => setChapterIndex(e.target.value)}
                />
                <label>Enter the chapter title:</label>
                <input
                    type='text'
                    value={chapterTitle}
                    name={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                />
                <button type='submit'>Edit Question</button>
            </form>
            {location.pathname === '/display' && <Display />}
        </div>
    );
};

export default FetchData;
