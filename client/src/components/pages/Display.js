import React from 'react';
// import { useParams } from 'react-router-dom';
const Display = ({ questions }) => {
    if (!Array.isArray(questions)) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            {questions.map((question) => (
                <div key={question._id}>
                    <h3>{question.title}</h3>
                    <ul>
                        {question.quizzes.map((quiz) => (
                            <li key={quiz._id}>
                                <h4>{quiz.quiz}</h4>
                                <p>{quiz.correctAnswer}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Display;
