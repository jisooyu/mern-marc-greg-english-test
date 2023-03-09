import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Display = () => {
    /*
    Display에 모든 quiz 데이터 display
    각 quiz옆에 button
    button click하면 EditQuestionForm으로 연결하며 quiz data를 보냄
    EditQuestionForm에서 수정하여 button click
    /api/question/edit/:id로 연결
    */
    const [keysIndex, setKeysIndex] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [chapterTitle, setChapterTitle] = useState('');
    async function fetchData() {
        try {
            const response = await axios.get(`/api/question/${chapterTitle}`, {
                params: { keysIndex: keysIndex, chapterIndex: chapterIndex }
            });
            console.log("response", response);
        } catch (error) {
            console.log("Error broke out: ", error);
        }
    }
    useEffect(() => {

        console.log("Page rerendered");

    }, [chapterTitle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchData();
    }
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
    return (
        <div>

            <form onSubmit={handleSubmit}>
                <label>Enter the keys index number:</label>
                <input
                    type='text' value={keysIndex} name={keysIndex}
                    onChange={e => setKeysIndex(e.target.value)}
                />
                <label>Enter the chapter index number:</label>
                <input
                    type='text' value={chapterIndex} name={chapterIndex}
                    onChange={e => setChapterIndex(e.target.value)}
                />
                <label>Enter the chapter title:</label>
                <input
                    type='text' value={chapterTitle} name={chapterTitle}
                    onChange={e => setChapterTitle(e.target.value)}
                />
                <button type="submit">Edit Question</button>
            </form>
        </div>
    )
}

export default Display;