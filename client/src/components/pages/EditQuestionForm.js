import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// Handle the click event for a chapter
// function handleClick(id) {
//     axios.put(`/api/question/edit/:${id}`)
//         .then(response => {
//             console.log(response.data);
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }

const EditQuestionForm = () => {

    const [imageFile, setImageFile] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [quiz, setQuiz] = useState('');
    const [correctAnswer, setAnswers] = useState('');
    const [postData, setPostData] = useState(false);

    const handleImage = async (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleAnswer = (e) => {
        const newAnswer = e.target.value;
        setAnswers(newAnswer);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('imageFile', imageFile);
        formData.append('chapterTitle', chapterTitle);
        formData.append('quiz', quiz);
        const answersArray = correctAnswer.split(',').map((answer) => answer.trim());
        formData.append('correctAnswer', answersArray);
        const config = {
            headers: {
                'content-type': `multipart/form-data; boundary=${formData._boundary}`
            }
        }
        try {
            const response = await axios.put('/api/question/edit/:id', formData, config);
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
                <label>Chapter Title:</label>
                <input type="text" value={chapterTitle} name={chapterTitle}
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
                    onChange={handleAnswer}
                />
            </div>
            <button type="submit">Submit Question</button>
        </form>
    );
}

export default EditQuestionForm;
