import React, { useState } from 'react';
import Display from './Display';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FetchData = () => {
    const [keysIndex, setKeysIndex] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [chapterTitle, setChapterTitle] = useState('');
    const [questions, setQuestions] = useState(null); // initialize questions state to null
    const navigate = useNavigate();

    async function fetchData() {
        try {
            const response = await axios.get(`/api/question/${chapterTitle}`, {
                params: { keysIndex: keysIndex, chapterIndex: chapterIndex }
            });
            console.log("response", response.data); // Add this line to check if data is being fetched
            return response.data;

        } catch (error) {
            console.log("Error broke out: ", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchData();
        console.log('response data:', response);
        setQuestions(response); // update questions state with response data
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
            {/* <Display questions={questions} /> */}
        </div>
    );
};

export default FetchData;
