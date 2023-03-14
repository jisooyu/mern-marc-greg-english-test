import React, { useState, createContext } from 'react';

export const QuestionContext = createContext({
    questions: null,
    setQuestions: () => { },
});

export const QuestionsProvider = ({ children }) => {
    const [questions, setQuestions] = useState(null);
    return (
        <QuestionContext.Provider value={{ questions, setQuestions }}>
            {children}
        </QuestionContext.Provider>
    );
};

