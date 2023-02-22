import React, { useState } from 'react';

const QuestionForm = ({ isAdmin }) => {

    console.log("isAdmin from QuestionForm", isAdmin);

    const [chapterId, setchapterId] = useState('');
    const [quiz, setQuiz] = useState('');
    const [answer, setAnswer] = useState('');

    const handleChapterId = (event) => {
        setchapterId(event.target.value);
    };

    const handleQuestionChange = (event) => {
        setQuiz(event.target.value);
    };

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // 여기를 고쳐서 Register와 같이 register(authDispatch, {...}) 식으로 해야 할 것임. 
        const response = await fetch('/api/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chapterId: chapterId,
                quiz: quiz,
                answer: answer,
            })
        });

        const data = await response.json();
        console.log(data);
    };

    if (!isAdmin) {
        return <div>You have no permission to access the question add form.</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Chapter ID:</label>
                <input type="text" value={chapterId} onChange={handleChapterId} />
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

export default QuestionForm;
