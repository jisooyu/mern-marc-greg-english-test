import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const AddQuestions = () => {
    const [numQuestionsInput, setNumQuestions] = useState("");
    const [chapterTitleInput, setChapterTitle] = useState("");
    const [showQuestionsForm, setShowQuestionsForm] = useState(false);
    const navigate = useNavigate();

    const handleNumQuestions = (event) => {
        setNumQuestions(parseInt(event.target.value));
    };
    const handleChapterTitle = (event) => {
        setChapterTitle(event.target.value);
        console.log("chapterTitleInput from handleChapterTitle", chapterTitleInput);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setShowQuestionsForm(true);
        navigate({
            pathname: '/question',
            state: {
                chapterTitleInput: chapterTitleInput
            }
        })

    };
    useEffect(() => {
        console.log('numQuestions changed');
    }, [numQuestionsInput]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Number of Questions</label>
                    <input type="string" value={numQuestionsInput} onChange={handleNumQuestions} />
                    <br />
                    <label>Chapter Title</label>
                    <input type="text" value={chapterTitleInput} onChange={handleChapterTitle} />
                </div>
                <button type="submit">Add</button>
            </form>
            {/* {showQuestionsForm && [...Array(numQuestionsInput)].map((e, i) => <QuestionForm key={i} chapterTitleInput={chapterTitleInput} />)} */}

        </div>
    )
}

export default AddQuestions;