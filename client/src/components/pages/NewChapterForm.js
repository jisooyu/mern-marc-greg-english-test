import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const NewQuestionForm = () => {
    const [documentId, setDocumentId] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [quiz, setQuiz] = useState('');
    const [answer, setAnswer] = useState('');
    const [postData, setPostData] = useState(false);

    const handleDocumentChange = (event) => {
        setDocumentId(event.target.value);
    };
    const handleChapterChange = (event) => {
        setChapterTitle(event.target.value);
    };

    const handleQuestionChange = (event) => {
        setQuiz(event.target.value);
    };

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/newChapter', {
                documentId: documentId,
                chapterTitle: chapterTitle,
                quiz: quiz,
                correctAnswer: answer,
            });
            if (response) {
                setPostData(true);
            }
        } catch (error) {
            console.log("Oops! Error: ", error.message);
        }
    };

    // 데이터 저장에 성공하면 display로 이동
    if (postData) {
        return <Navigate to='/' />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Document Id:</label>
                <input type="text" value={documentId} onChange={handleDocumentChange} />
            </div>
            <div>
                <label>Chapter Title:</label>
                <input type="text" value={chapterTitle} onChange={handleChapterChange} />
            </div>
            <div>
                <label>Question:</label>
                <input type="text" value={quiz} onChange={handleQuestionChange} />
            </div>
            <div>
                <label>Answer:</label>
                <input type="text" value={answer} onChange={handleAnswerChange} />
            </div>
            <button type="submit">Add Question</button>
        </form>
    );
}

export default NewQuestionForm;
