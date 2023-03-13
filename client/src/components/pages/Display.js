import React, { useState, useEffect } from 'react';

const Display = ({ questions }) => {
    // if (!questions) return null;
    console.log('questions prop:', questions);

    // if (!questions) {
    //     return <div>Loading...</div>;
    // }
    return (
        <div>
            <h1>Questions </h1>
            {questions.map((question) => (
                < div key={question._id} >
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
            ))
            }
        </div >
    );
};

export default Display;
