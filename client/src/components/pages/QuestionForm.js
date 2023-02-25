import React, { useState } from 'react';
import axios from 'axios';

const QuestionForm = () => {

    const [quiz, setQuiz] = useState('');
    const [answer, setAnswer] = useState('');

    const handleQuestionChange = (event) => {
        setQuiz(event.target.value);
    };

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/question', {
                quiz: quiz,
                correctAnswer: answer,
            });
            console.log("response data from handleSubmit", response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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

export default QuestionForm;
