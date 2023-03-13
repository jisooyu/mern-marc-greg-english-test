import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Display from './Display'

const FetchData = () => {
    const [keysIndex, setKeysIndex] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [chapterTitle, setChapterTitle] = useState('');
    const [questions, setQuestions] = useState([]); // initialize questions state to null
    const navigate = useNavigate();

    useEffect(() => {
        console.log('questions from useEffect', questions);
    }, [questions]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/question/${chapterTitle}`, {
                params: { keysIndex: keysIndex, chapterIndex: chapterIndex }
            });
            console.log("response.data", response.data);
            await setQuestions(response.data);
        } catch (error) {
            console.log("Error broke out", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchData();
        console.log('questions from handleSubmit', questions);
        // navigate('/display');
        navigate('/display')
        // return <Display questions={questions} />
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
            {/* {questions !== null && <Display questions={questions} />} */}
            {questions ? <Display questions={questions} /> : <div>Loading...</div>}
        </div>
    );
};

export default FetchData;