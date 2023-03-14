import React, { useContext } from 'react';
import { QuestionContext } from '../context/QuestionContext';

const Display = () => {
    const { questions } = useContext(QuestionContext);

    return (
        <div>
            {questions ? (
                <div>
                    {questions.map((question) => (
                        <div key={question._id}>
                            <h4>{question.title}</h4>
                            <ul>
                                {question.quizzes.map((quiz) => (
                                    <li key={quiz._id}>
                                        {quiz.quiz}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Display;
