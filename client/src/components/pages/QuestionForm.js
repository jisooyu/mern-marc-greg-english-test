import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const QuestionForm = () => {

    const [documentId, setDocumentId] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [quiz, setQuiz] = useState('');
    const [correctAnswer, setAnswer] = useState('');
    const [postData, setPostData] = useState(false);

    const handleImage = async (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('imageFile', imageFile);
        formData.append('documentId', documentId);
        formData.append('chapterTitle', chapterTitle);
        formData.append('quiz', quiz);
        formData.append('correctAnswer', correctAnswer);
        console.log("formData from handleSubmit", formData);
        const config = {
            headers: {
                'content-type': `multipart/form-data; boundary=${formData._boundary}`
            }
        }
        try {
            const response = await axios.post('/api/question', formData, config);
            if (response) {
                setPostData(true);
                return response.data;
            }
        } catch (error) {
            console.log(error.message);
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
                <input type="text" value={documentId} name={documentId}
                    onChange={(e) => setDocumentId(e.target.value)} />
            </div>
            <div>
                <label>Chapter Title:</label>
                <input type="text" value={chapterTitle} name={documentId}
                    onChange={(e) => setChapterTitle(e.target.value)} />
            </div>
            <label htmlFor='imageFile'>Upload Images</label>
            <input
                type='file'
                name='imageFile'
                id='imageFile'
                accept='image/jpeg, image/jp, image/png'
                onChange={handleImage}
            />
            <div>
                <label>Question:</label>
                <input type="text" value={quiz} name={quiz}
                    onChange={(e) => setQuiz(e.target.value)}
                />
            </div>
            <div>
                <label>Answer:</label>
                <input type="text" value={correctAnswer} name={correctAnswer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </div>
            <button type="submit">Add Question</button>
        </form>
    );
}

export default QuestionForm;
